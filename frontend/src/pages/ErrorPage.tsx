import { ReactNode, Suspense } from "react";
import { useLocation } from "@tanstack/react-router";
import Loading from "@/components/common/Loading";
import Blocks from "@/components/blocks/Blocks";
import {
  twoOhFourComponent,
  fourOhFourComponent,
  fourOhOneComponent,
  fourTwentyNineComponent,
} from "@/config/routes";
import Layout from "@/components/layout/Layout";
import {
  RateLimitError,
  UnauthorizedError,
  UnderConstructionError,
} from "@/utils/errors";
import { TComponent } from "@/network/component/types";

type ErrorConfig = {
  component: TComponent;
};

const errorConfigs: Record<number, ErrorConfig> = {
  204: {
    component: twoOhFourComponent,
  },
  401: {
    component: fourOhOneComponent,
  },
  403: {
    component: fourOhOneComponent,
  },
  404: {
    component: fourOhFourComponent,
  },
  429: {
    component: fourTwentyNineComponent,
  },
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

  const settledErrorCode = config.component?.propertyValues?.errorCode;
  const settledErrorMessage = config.component.name;
  const title = settledErrorCode + " " + settledErrorMessage;

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex, nofollow" />
      <title>{`${title} | Jeff Olsen`}</title>
      <Suspense fallback={<Loading />}>
        <Blocks.Error
          component={config.component}
          params={params}
          path={path}
        />
      </Suspense>
    </>
  );
}
