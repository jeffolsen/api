import queryClient from "../utils/queryClient";
import { createBrowserRouter } from "react-router";
import routes from "../config/routes";
import {
  fetchAppFeeds,
  appFeedsQueryKey,
  fetchAppFeedComponents,
  appFeedComponentsQueryKey,
} from "../network/app";
import { QueryClient } from "@tanstack/react-query";

const loader =
  (queryClient: QueryClient) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/|\/$/g, "") || "home";

    const dbRoutes = await queryClient.fetchQuery({
      queryKey: appFeedsQueryKey(),
      queryFn: async () => {
        return fetchAppFeeds();
      },
    });

    const allRoutes = [...routes, ...(dbRoutes?.feeds || [])];

    let feed = allRoutes.find((r) => r.path === path);

    const params: Record<string, string> = {};

    if (!feed) {
      for (const route of allRoutes) {
        // Only consider keys with dynamic segments for pattern matching
        const routePath = route.path.replace(/^\/|\/$/g, "");
        console.log(
          `Checking route pattern: ${routePath} against path: ${path}`,
        );
        if (!routePath.includes(":")) continue;
        console.log(
          `Route has dynamic segments, attempting to match pattern.`,
          routePath,
          path,
        );
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

    if (feed && !feed.components) {
      const feedComponents = await queryClient.fetchQuery({
        queryKey: appFeedComponentsQueryKey(feed.id),
        queryFn: async () => {
          return fetchAppFeedComponents(feed.id);
        },
      });
      feed = { ...feed, components: feedComponents.components };
    }

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
