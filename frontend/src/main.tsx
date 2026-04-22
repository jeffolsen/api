import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthProvider";
import { Toaster } from "react-hot-toast";
import ErrorPage from "./pages/ErrorPage";
import createPageRouter from "./routers/pageRouter.tsx";
import queryClient from "./utils/queryClient";
import { createHead } from "@unhead/react/client";
import { UnheadProvider } from "@unhead/react/client";

const head = createHead();

const router = createPageRouter({
  element: <App />,
  errorElement: <ErrorPage />,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UnheadProvider head={head}>
          <RouterProvider router={router} />
          <Toaster />
        </UnheadProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
