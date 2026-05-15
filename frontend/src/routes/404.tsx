import { createRootRoute, Outlet } from "@tanstack/react-router";
import Blocks from "@/components/blocks/Blocks";
import { fourOhFourComponent } from "@/config/routes";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: () => {
    return (
      <Blocks.Error component={fourOhFourComponent} params={{}} path={"404"} />
    );
  },
});
