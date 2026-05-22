import { createFileRoute, useLocation } from "@tanstack/react-router";
import Blocks from "@/components/blocks/Blocks";
import { termsComponent, policyTemplate } from "@/config/routes";
import DocumentHead from "@/components/layout/DocumentHead";

export const Route = createFileRoute("/terms")({
  component: TermsComponent,
});

function TermsComponent() {
  const location = useLocation();

  return (
    <>
      <DocumentHead
        feed={{
          ...policyTemplate,
          path: location.pathname,
          seoTitle: "Terms of Service",
          seoDescription: "Terms of service for this site.",
        }}
      />
      <Blocks.Policy
        component={termsComponent}
        params={{}}
        path={location.pathname}
      />
    </>
  );
}
