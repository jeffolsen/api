import { createFileRoute, useLocation } from "@tanstack/react-router";
import { cmsTemplate, feedListComponent } from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import Loading from "@/components/common/Loading";
import { Suspense } from "react";
import DocumentHead from "@/components/layout/DocumentHead";

export const Route = createFileRoute("/cms/_auth/feeds/")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  return (
    <>
      <DocumentHead
        feed={{
          ...cmsTemplate,
          path: location.pathname,
          seoTitle: "CMS Tech Demo",
          seoDescription: "The feed collection for the CSM tech demonstration.",
        }}
      />
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
