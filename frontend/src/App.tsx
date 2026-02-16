import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router";
// import LoginPage from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GenericPage from "./pages/GenericPage";
import { CookiesProvider } from "react-cookie";

const queryClient = new QueryClient();

function App() {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Routes>
            <Route path="*" element={<GenericPage />} />
          </Routes>
        </Layout>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
