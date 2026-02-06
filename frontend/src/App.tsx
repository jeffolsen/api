import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
