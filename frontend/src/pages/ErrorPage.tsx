import { ReactNode, Suspense } from "react";
import { useLocation } from "@tanstack/react-router";
import Loading from "@/components/common/Loading";
import Blocks from "@/components/blocks/Blocks";
import {
  twoOhFourComponent,
  twoOhFourFeed,
  fourOhFourComponent,
  fourOhFourFeed,
  fourOhOneComponent,
  fourOhOneFeed,
  fourTwentyNineComponent,
  fourTwentyNineFeed,
  LocalFeedComponent,
  LocalFeedWithComponents,
} from "@/config/routes";
import Layout from "@/components/layout/Layout";
import DocumentHead from "@/components/layout/DocumentHead";
import {
  RateLimitError,
  UnauthorizedError,
  UnderConstructionError,
} from "@/utils/errors";

type ErrorConfig = {
  feed: LocalFeedWithComponents;
  component: LocalFeedComponent;
};

const errorConfigs: Record<number, ErrorConfig> = {
  204: { feed: twoOhFourFeed, component: twoOhFourComponent },
  401: { feed: fourOhOneFeed, component: fourOhOneComponent },
  403: { feed: fourOhOneFeed, component: fourOhOneComponent },
  404: { feed: fourOhFourFeed, component: fourOhFourComponent },
  429: { feed: fourTwentyNineFeed, component: fourTwentyNineComponent },
};

function getStatus(error: unknown): number {
  if (error instanceof UnderConstructionError) return 204;
  if (error instanceof RateLimitError) return 429;
  if (error instanceof UnauthorizedError) return 401;
  if (
    error != null &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }
  return 0;
}

export default function ErrorPage({ error }: { error?: unknown }) {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, "");
  return <Layout>{PageFallback(error, {}, path)}</Layout>;
}

export function PageFallback(
  error: unknown,
  params: Record<string, string>,
  path: string,
): ReactNode {
  const status = getStatus(error);
  const config = errorConfigs[status] ?? errorConfigs[404];
  return (
    <>
      <DocumentHead feed={config.feed} />
      <Suspense fallback={<Loading />}>
        <Blocks.Error component={config.component} params={params} path={path} />
      </Suspense>
    </>
  );
}
