import { createFileRoute, useLocation } from "@tanstack/react-router";
import { cmsTemplate, itemListComponent } from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";
import DocumentHead from "@/components/layout/DocumentHead";

export const Route = createFileRoute("/cms/_auth/items/")({
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
          seoDescription: "The item collection for the CSM tech demonstration.",
        }}
      />
      <Suspense fallback={<Loading />}>
        <Blocks.ItemList
          component={itemListComponent}
          params={{}}
          path={location.pathname}
        />
      </Suspense>
    </>
  );
}
