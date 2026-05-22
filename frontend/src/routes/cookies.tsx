import { createFileRoute, useLocation } from "@tanstack/react-router";
import Blocks from "@/components/blocks/Blocks";
import { cookiesComponent, policyTemplate } from "@/config/routes";
import DocumentHead from "@/components/layout/DocumentHead";

export const Route = createFileRoute("/cookies")({
  component: CookiesComponent,
});

function CookiesComponent() {
  const location = useLocation();

  return (
    <>
      <DocumentHead
        feed={{
          ...policyTemplate,
          path: location.pathname,
          seoTitle: "Cookie Policy",
          seoDescription: "Cookie policy for this site.",
        }}
      />
      <Blocks.Policy
        component={cookiesComponent}
        params={{}}
        path={location.pathname}
      />
    </>
  );
}
