import Layout from "./components/Layout";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
