import { createFileRoute, useLocation } from "@tanstack/react-router";
import Blocks from "@/components/blocks/Blocks";
import { privacyComponent, policyTemplate } from "@/config/routes";
import DocumentHead from "@/components/layout/DocumentHead";

export const Route = createFileRoute("/privacy")({
  component: PrivacyComponent,
});

function PrivacyComponent() {
  const location = useLocation();

  return (
    <>
      <DocumentHead
        feed={{
          ...policyTemplate,
          path: location.pathname,
          seoTitle: "Privacy policy",
          seoDescription: "Privacy policy for this site.",
        }}
      />
      <Blocks.Policy
        component={privacyComponent}
        params={{}}
        path={location.pathname}
      />
    </>
  );
}
