import { createFileRoute, useLocation } from "@tanstack/react-router";
import { feedUpdateComponent } from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";

export const Route = createFileRoute("/cms/_auth/feeds/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const location = useLocation();
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Blocks.FeedUpdate
          component={feedUpdateComponent}
          params={params}
          path={location.pathname}
        />
      </Suspense>
    </>
  );
}
