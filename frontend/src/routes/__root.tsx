import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import Layout from "@/components/layout/Layout";
import ErrorPage from "@/pages/ErrorPage";
import queryClient from "@/utils/queryClient";
import { queryAppTags } from "@/network/app/tag";
import { queryAppComponentTypes } from "@/network/app/componentType";

export const Route = createRootRoute({
  loader: async () => {
    await Promise.all([
      queryAppTags(queryClient),
      queryAppComponentTypes(queryClient),
    ]);
  },
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>

      {/* Devtools for debugging routes */}
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
  errorComponent: ({ error }) => <ErrorPage error={error} />,
});
