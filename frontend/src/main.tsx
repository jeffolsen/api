import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/global.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AuthProvider } from "@/contexts/AuthProvider";
import { Toaster } from "react-hot-toast";

import queryClient, { persister } from "@/utils/queryClient";
import { createHead } from "@unhead/react/client";
import { UnheadProvider } from "@unhead/react/client";

const head = createHead();

const router = createRouter({ routeTree });

// 2. Register for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000,
        buster: "v1",
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.queryKey[0] === "app",
        },
      }}
    >
      <AuthProvider>
        <UnheadProvider head={head}>
          <RouterProvider router={router} />
          <Toaster />
        </UnheadProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
);
