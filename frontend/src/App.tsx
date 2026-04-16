import { useLoaderData } from "react-router";
import Layout from "./components/layout/Layout.tsx";
import PageResolver from "./pages/PageResolver.tsx";
import { TComponent } from "./network/component.ts";

function App() {
  const data = useLoaderData();
  const headerHeroIndex = data.pageLayout.components.findIndex(
    (c: TComponent) =>
      c.typeName === "HeroCarousel" && c.propertyValues.location === "header",
  );
  const headerHero =
    headerHeroIndex !== -1
      ? data.pageLayout.components.splice(headerHeroIndex, 1)[0]
      : null;
  return (
    <Layout headerHero={headerHero}>
      {/* <details>
        <summary>Loader Data</summary>
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </details> */}

      <PageResolver
        pageData={data.pageLayout}
        params={data.params}
        path={data.path}
      />
    </Layout>
  );
}

export default App;
