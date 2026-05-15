import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import Layout from "@/components/layout/Layout";
import ErrorPage from "@/pages/ErrorPage";

export const Route = createRootRoute({
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
