import { createFileRoute, useLocation } from "@tanstack/react-router";
import { cmsTemplate, feedUpdateComponent } from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";
import DocumentHead from "@/components/layout/DocumentHead";

export const Route = createFileRoute("/cms/_auth/feeds/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const location = useLocation();
  return (
    <>
      <DocumentHead
        feed={{
          ...cmsTemplate,
          path: location.pathname,
          seoTitle: "CMS Tech Demo",
          seoDescription:
            "Update an existing feed for the CSM tech demonstration.",
        }}
      />
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
