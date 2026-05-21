import PageResolver from "@/pages/PageResolver";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { queryAppFeedByPath } from "@/network/app/feed";
import { queryAppItemBySlug } from "@/network/app/item";
import { GetFeedWithIncludesResponse } from "@/network/feed/types";
import { GetItemWithIncludesResponse } from "@/network/item/types";
import queryClient from "@/utils/queryClient";
import { RateLimitError, UnderConstructionError } from "@/utils/errors";
import { isAxiosError } from "axios";
import processFeed from "@/utils/processFeed";
import { ClientTypeName } from "@/network/clients/type";

type FeedResult = GetFeedWithIncludesResponse | unknown;
type ItemResult = GetItemWithIncludesResponse | unknown;

const isSuccess = <T extends object>(result: T | unknown): result is T =>
  result !== null &&
  typeof result === "object" &&
  !(result instanceof Error) &&
  !(result instanceof Response);

const rejectIfNotFound = (error: unknown): void => {
  if (error instanceof Response) throw error;
  if (error instanceof RateLimitError)
    throw new Response("Too many requests", { status: 429 });
  if (isAxiosError(error) && error.response?.status !== 404)
    throw new Response(error.message, {
      status: error.response?.status ?? 500,
    });
};

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const path = params._splat || "home";

    const collectionResult: FeedResult = await queryAppFeedByPath(queryClient, {
      path,
      subjectType: "COLLECTION",
    }).catch((e) => e);

    if (isSuccess<GetFeedWithIncludesResponse>(collectionResult)) {
      const feed = collectionResult.feed;
      const { processedFeed, headerHero } = processFeed(feed);

      if (!processedFeed.components.length) {
        throw new UnderConstructionError();
      }

      return {
        feed: processedFeed,
        headerHero,
        renderFor: "app" as ClientTypeName,
      };
    }

    console.log("failed to get collection feed");

    rejectIfNotFound(collectionResult);

    console.log("got past rejectIfNotFound");

    if (!path.includes("/")) throw new Response("Not found", { status: 404 });

    console.log("got past path.includes(/)", !path.includes("/"));

    const lastSlash = path.lastIndexOf("/");
    const singleSubjectPath = path.substring(0, lastSlash);
    const itemSlug = path.substring(lastSlash + 1);

    const [feedResult, itemResult]: [FeedResult, ItemResult] =
      await Promise.all([
        queryAppFeedByPath(queryClient, {
          path: singleSubjectPath,
          subjectType: "SINGLE",
        }).catch((e) => e),
        queryAppItemBySlug(queryClient, itemSlug).catch((e) => e),
      ]);

    rejectIfNotFound(feedResult);
    rejectIfNotFound(itemResult);

    if (!isSuccess<GetFeedWithIncludesResponse>(feedResult)) {
      throw new Response("Not found", { status: 404 });
    }
    if (!isSuccess<GetItemWithIncludesResponse>(itemResult)) {
      throw new Response("Not found", { status: 404 });
    }

    const feed = feedResult.feed;
    const item = itemResult.item;
    const feedTagNames = new Set(feed.tags.map((t) => t.tag.name));

    if (
      !item.tags.map((t) => t.tag.name).some((name) => feedTagNames.has(name))
    ) {
      throw new Response("Not found", { status: 404 });
    }

    const { processedFeed, headerHero } = processFeed(feed);

    if (!processedFeed.components.length) {
      throw new Response("Under Construction", { status: 204 });
    }

    return {
      feed: processedFeed,
      headerHero,
      item,
      renderFor: "app" as ClientTypeName,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const params = Route.useParams();
  const location = useLocation();

  if (!data?.feed) return null;

  const pageData = {
    feed: data.feed,
    item: data.item,
  };
  return (
    <PageResolver
      pageData={pageData}
      params={params}
      path={location.pathname}
    />
  );
}
