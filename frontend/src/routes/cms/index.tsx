import { createFileRoute, useLocation } from "@tanstack/react-router";
import {
  loginOrRegisterComponent,
  profileDashBoardComponent,
} from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import Loading from "@/components/common/Loading";
import { Suspense } from "react";
import { useAuthState } from "@/contexts/AuthContext";

export const Route = createFileRoute("/cms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuthState();
  const loggedIn = isAuthenticated();
  const location = useLocation();
  return (
    <>
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
