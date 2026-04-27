import { useLoaderData } from "react-router";
import Layout from "@/components/layout/Layout.tsx";
import PageResolver from "@/pages/PageResolver.tsx";
import { TComponent } from "@/network/component/index.ts";

function App() {
  const data = useLoaderData();
  const headerHero = data.pageLayout.components.find(
    (c: TComponent) =>
      c.typeName === "HeroCarousel" && c.propertyValues.location === "header",
  );
  const components = data.pageLayout.components.filter(
    (c: TComponent) => c.id !== headerHero?.id,
  );

  return (
    <Layout>
      <PageResolver
        pageData={{ ...data.pageLayout, components }}
        params={data.params}
        path={data.path}
      />
    </Layout>
  );
}

export default App;
