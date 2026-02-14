import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router";
// import LoginPage from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GenericPage from "./pages/GenericPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="*" element={<GenericPage />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
