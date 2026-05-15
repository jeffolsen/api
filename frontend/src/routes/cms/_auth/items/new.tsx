import { createFileRoute, useLocation } from "@tanstack/react-router";
import { itemCreateComponent } from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";

export const Route = createFileRoute("/cms/_auth/items/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  return (
    <>
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
