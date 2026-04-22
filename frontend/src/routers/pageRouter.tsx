import queryClient from "../utils/queryClient";
import { createBrowserRouter } from "react-router";
import routes, { paths } from "../config/routes";
import {
  fetchAppFeeds,
  appFeedsQueryKey,
  fetchAppFeedComponents,
  appFeedComponentsQueryKey,
  fetchAppItemById,
  appItemQueryKey,
} from "../network/app";
import {
  fetchUserFeeds,
  userFeedsQueryKey,
  fetchUserFeedById,
  fetchUserItemById,
  userItemQueryKey,
  fetchUserRefresh,
  fetchUserFeedComponents,
  userFeedComponentsQueryKey,
} from "../network/user";
import { QueryClient } from "@tanstack/react-query";
import { TFeed } from "../network/feed";

// we only have a handful of types of pages we need to handle in the router loader:
// 1. COLLECTION Pages owned by the app's api-key. They have arbitrary paths with no dynamic segments.
// 2. SINGLE Pages owned by the app's api-key. They have paths with a single dynamic segment representing an Item ID. We will check if that item is owned by the app before rendering.
// 3. The CMS egress page. Availiable to everyone.
// 4. CMS preview preview paths for user owned COLLECTION feeds. Preffixed with /cms/preview. They have arbitrary paths with no dynamic segments. We will check if the feed is owned by the user before rendering.
// 5. CMS preview paths for user owned SINGLE feeds. Preffixed with /cms/preview. They have paths with a single dynamic segment representing an Item ID. We will check if the feed is owned by the user and that the item is owned by the user before rendering.
// 6. CMS feed update pages for user owned feeds. Preffixed with /cms/feed. They have paths with a single dynamic segment representing the feed ID. We will check if the feed is owned by the user before rendering.
// 7. CMS item update pages for user owned feeds. Preffixed with /cms/item. They have paths with a single dynamic segment representing the item ID. We will check if the item is owned by the user before rendering.
// 8. Remaining CMS internal pages. Check that user is logged in before rendering.

const loader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/|\/$/g, "") || "home";

    let dbRoutes = null;
    let rootPath = "";

    const cmsHomePath = paths.cmsHome.slice(1);
    const cmsPreviewPath = paths.cmsPreview.slice(1);

    // login check for any cms path
    if (path.startsWith(cmsHomePath) && path !== cmsHomePath) {
      try {
        await fetchUserRefresh();
      } catch (error) {
        throw new Response(
          error instanceof Error ? error.message : "Unknown error",
          { status: 404 },
        );
      }
    }

    // select feeds and prefix for cms preview.
    const isPreviewLink =
      path.startsWith(cmsPreviewPath) && path !== cmsPreviewPath;
    if (isPreviewLink) {
      try {
        dbRoutes = await queryClient.fetchQuery({
          queryKey: userFeedsQueryKey(),
          queryFn: async () => {
            return fetchUserFeeds();
          },
        });

        rootPath = cmsPreviewPath + "/";
      } catch (error) {
        throw new Response(
          error instanceof Error ? error.message : "Unknown error",
          { status: 404 },
        );
      }
    } else {
      try {
        dbRoutes = await queryClient.fetchQuery({
          queryKey: appFeedsQueryKey(),
          queryFn: async () => {
            return fetchAppFeeds();
          },
        });
      } catch (error) {
        throw new Response(
          error instanceof Error ? error.message : "Unknown error",
          { status: 404 },
        );
      }
    }

    const allRoutes = [
      ...routes,
      ...(dbRoutes?.feeds.map((f: TFeed) => ({
        ...f,
        path:
          rootPath + (f.subjectType === "SINGLE" ? `${f.path}/:id` : f.path),
      })) || []),
    ];

    let feed = allRoutes.find((r) => r.path === path);

    const params: Record<string, string> = {};

    if (!feed) {
      for (const route of allRoutes) {
        // Only consider keys with dynamic segments for pattern matching
        const routePath = route.path.replace(/^\/|\/$/g, "");

        if (!routePath.includes(":")) continue;
        const pattern = routePath.replace(/:([^/]+)/g, "([^/]+)");
        const match = path.match(new RegExp(`^${pattern}$`));

        if (match) {
          feed = allRoutes.find((r) => r.path === routePath);
          const paramNames = [...routePath.matchAll(/:([^/]+)/g)].map(
            (m) => m[1],
          );
          paramNames.forEach((name, i) => (params[name] = match[i + 1]));
          break;
        }
      }
    }
    // check if you have permission for dynamic paths before rendering
    const cmsFeedUpdatePath = paths.cmsFeedUpdate.slice(1);
    const cmsItemUpdatePath = paths.cmsItemUpdate.slice(1);
    const isCmsFeedUpdatePath = !!(
      feed?.path === cmsFeedUpdatePath && params.id
    );
    const isCmsItemUpdatePath = !!(
      feed?.path === cmsItemUpdatePath && params.id
    );
    const isCmsPreviewDynamicPath =
      feed?.path.startsWith(cmsPreviewPath) && params.id;
    const isAppDynamicPath = !!params.id;

    try {
      // if it's a cms feed update path, check that the feed is owned by the user
      if (isCmsFeedUpdatePath) {
        await queryClient.fetchQuery({
          queryKey: userFeedsQueryKey(Number(params.id)),
          queryFn: async () => {
            return fetchUserFeedById(Number(params.id));
          },
        });
        // if it's a cms item update path or cms preview path with an ID, check that the item is owned by the user
      } else if (isCmsItemUpdatePath || isCmsPreviewDynamicPath) {
        await queryClient.fetchQuery({
          queryKey: userItemQueryKey(Number(params.id)),
          queryFn: async () => {
            return fetchUserItemById(Number(params.id));
          },
        });
        // if it's an app dynamic path, check that the item is owned by the app
      } else if (isAppDynamicPath) {
        await queryClient.fetchQuery({
          queryKey: appItemQueryKey(Number(params.id)),
          queryFn: async () => {
            return fetchAppItemById(Number(params.id));
          },
        });
      }
    } catch (error) {
      throw new Response("Not found", {
        status: 404,
        statusText: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // we need to ensure the feed has components. Either grab components for the site or preview.
    const needsComponents = feed && !feed.components;
    if (needsComponents && isPreviewLink) {
      const feedComponents = await queryClient.fetchQuery({
        queryKey: userFeedComponentsQueryKey(feed.id),
        queryFn: async () => {
          return fetchUserFeedComponents(feed.id);
        },
      });
      feed = { ...feed, components: feedComponents.components };
    } else if (needsComponents) {
      const feedComponents = await queryClient.fetchQuery({
        queryKey: appFeedComponentsQueryKey(feed.id),
        queryFn: async () => {
          return fetchAppFeedComponents(feed.id);
        },
      });
      feed = { ...feed, components: feedComponents.components };
    }

    console.log("Matched feed for path:", feed, "with params:", params);

    return {
      pageLayout: feed || allRoutes.find((r) => r.path === "404"),
      params,
      path,
    };
  };

export default function createPageRouter({
  element,
  errorElement,
}: {
  element: React.ReactNode;
  errorElement: React.ReactNode;
}) {
  return createBrowserRouter([
    {
      path: "*",
      element,
      loader: loader(queryClient),
      action: () => null,
      errorElement,
    },
  ]);
}
