import { createFileRoute, useLocation } from "@tanstack/react-router";
import Blocks from "@/components/blocks/Blocks";
import { privacyComponent } from "@/config/routes";

export const Route = createFileRoute("/privacy")({
  component: PrivacyComponent,
});

function PrivacyComponent() {
  const location = useLocation();

  return (
    <Blocks.Policy
      component={privacyComponent}
      params={{}}
      path={location.pathname}
    />
  );
}
