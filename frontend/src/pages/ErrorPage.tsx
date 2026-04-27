import { Suspense } from "react";
import { useLocation, useRouteError } from "react-router";
import Loading from "@/components/common/Loading";
import Blocks from "@/components/blocks/Blocks";
import { fourOhFourComponent, fourOhFourFeed } from "@/config/routes";
import Layout from "@/components/layout/Layout";
import DocumentHead from "@/components/layout/DocumentHead";

export default function ErrorPage() {
  const error = useRouteError();
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, "");

  return (
    <Layout>
      <>
        {path && error ? (
          <>
            <DocumentHead feed={fourOhFourFeed} />
            <Suspense fallback={<Loading />}>
              <Blocks.FourOhFour
                component={fourOhFourComponent}
                params={{}}
                path={path}
              />
            </Suspense>
          </>
        ) : (
          <Loading />
        )}
      </>
    </Layout>
  );
}
