import { useLoaderData } from "react-router";
import Layout from "./components/layout/Layout.tsx";
import PageResolver from "./pages/PageResolver.tsx";

function App() {
  const data = useLoaderData();
  return (
    <Layout>
      <details>
        <summary>Loader Data</summary>
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </details>

      <PageResolver
        pageData={data.pageLayout}
        params={data.params}
        path={data.path}
      />
    </Layout>
  );
}

export default App;
