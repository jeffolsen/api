import { createFileRoute, useLocation } from "@tanstack/react-router";
import { feedListComponent } from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import Loading from "@/components/common/Loading";
import { Suspense } from "react";

export const Route = createFileRoute("/cms/_auth/feeds/")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Blocks.FeedList
          component={feedListComponent}
          params={{}}
          path={location.pathname}
        />
      </Suspense>
    </>
  );
}
