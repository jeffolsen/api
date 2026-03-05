import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router";
import GenericPage from "./pages/GenericPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="*" element={<GenericPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
