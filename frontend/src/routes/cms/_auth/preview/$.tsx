import PageResolver from "@/pages/PageResolver";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { queryCmsFeedByPath } from "@/network/cms/feed";
import { queryCmsItemBySlug } from "@/network/cms/item";
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

export const Route = createFileRoute("/cms/_auth/preview/$")({
  loader: async ({ params }) => {
    const path = params._splat || "home";

    const collectionResult: FeedResult = await queryCmsFeedByPath(
      queryClient,
      path,
      "COLLECTION",
    ).catch((e) => e);

    if (isSuccess<GetFeedWithIncludesResponse>(collectionResult)) {
      const feed = collectionResult.feed;
      const { processedFeed, headerHero } = processFeed(feed);

      if (!processedFeed.components.length) {
        throw new UnderConstructionError();
      }

      return {
        feed: processedFeed,
        headerHero,
        renderFor: "user" as ClientTypeName,
      };
    }

    rejectIfNotFound(collectionResult);

    if (!path.includes("/")) throw new Response("Not found", { status: 404 });

    const lastSlash = path.lastIndexOf("/");
    const singleSubjectPath = path.substring(0, lastSlash);
    const itemSlug = path.substring(lastSlash + 1);

    const [feedResult, itemResult]: [FeedResult, ItemResult] =
      await Promise.all([
        queryCmsFeedByPath(queryClient, singleSubjectPath, "SINGLE").catch(
          (e) => e,
        ),
        queryCmsItemBySlug(queryClient, itemSlug).catch((e) => e),
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
      throw new UnderConstructionError();
    }

    return {
      feed: processedFeed,
      headerHero,
      item,
      renderFor: "user" as ClientTypeName,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const params = Route.useParams();
  const location = useLocation();

  if (!data?.feed) return null;

  return (
    <PageResolver
      pageData={{ feed: data.feed, item: data.item, renderFor: data.renderFor }}
      params={params}
      path={location.pathname}
    />
  );
}
