import { createFileRoute, useLocation } from "@tanstack/react-router";
import { cmsTemplate, itemCreateComponent } from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";
import DocumentHead from "@/components/layout/DocumentHead";

export const Route = createFileRoute("/cms/_auth/items/new")({
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
          seoDescription: "Create a new item for the CSM tech demonstration.",
        }}
      />
      <Suspense fallback={<Loading />}>
        <Blocks.ItemCreate
          component={itemCreateComponent}
          params={{}}
          path={location.pathname}
        />
      </Suspense>
    </>
  );
}
