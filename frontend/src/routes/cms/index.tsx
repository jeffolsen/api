import { createFileRoute, useLocation } from "@tanstack/react-router";
import {
  cmsTemplate,
  loginOrRegisterComponent,
  profileDashBoardComponent,
} from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import Loading from "@/components/common/Loading";
import { Suspense } from "react";
import { useAuthState } from "@/contexts/AuthContext";
import DocumentHead from "@/components/layout/DocumentHead";

export const Route = createFileRoute("/cms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuthState();
  const loggedIn = isAuthenticated();
  const location = useLocation();
  return (
    <>
      <DocumentHead
        feed={{
          ...cmsTemplate,
          path: location.pathname,
          seoTitle: "CMS Tech Demo",
          seoDescription: "The ingress and hub of the CSM tech demonstration.",
        }}
      />
      <Suspense fallback={<Loading />}>
        {loggedIn ? (
          <Blocks.ProfileDashboard
            component={profileDashBoardComponent}
            params={{}}
            path={location.pathname}
          />
        ) : (
          <Blocks.LoginRegister
            component={loginOrRegisterComponent}
            params={{}}
            path={location.pathname}
          />
        )}
      </Suspense>
    </>
  );
}
