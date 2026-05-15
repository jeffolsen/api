import { createFileRoute, useLocation } from "@tanstack/react-router";
import { itemListComponent } from "@/config/routes";
import Blocks from "@/components/blocks/Blocks";
import { Suspense } from "react";
import Loading from "@/components/common/Loading";

export const Route = createFileRoute("/cms/_auth/items/")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Blocks.ItemList
          component={itemListComponent}
          params={{}}
          path={location.pathname}
        />
      </Suspense>
    </>
  );
}
