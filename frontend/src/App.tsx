import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router";
import GenericPage from "./pages/GenericPage";
import { ModalProvider } from "./contexts/ModalProvider";
import ModalManager from "./components/modals/Modal";

function App() {
  return (
    <ModalProvider>
      <Layout>
        <Routes>
          <Route path="*" element={<GenericPage />} />
        </Routes>
      </Layout>
      <ModalManager />
    </ModalProvider>
  );
}

export default App;
