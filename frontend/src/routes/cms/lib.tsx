import Blocks from "@/components/blocks/Blocks";
import Loading from "@/components/common/Loading";
import DocumentHead from "@/components/layout/DocumentHead";
import { cmsTemplate } from "@/config/routes";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/cms/lib")({
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
        <Blocks.StyleGuide />
      </Suspense>
    </>
  );
}
