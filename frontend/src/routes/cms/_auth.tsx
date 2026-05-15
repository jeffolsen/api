import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/network/clients/api";

export const Route = createFileRoute("/cms/_auth")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/cms" });
    }
  },
  component: () => <Outlet />,
});
