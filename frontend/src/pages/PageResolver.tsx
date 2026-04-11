import { Suspense } from "react";
import Loading from "../components/common/Loading";
import { LocalFeedWithComponents } from "../config/routes";
import Blocks from "../components/blocks/Blocks";
import { fourOhFourComponent } from "../config/routes";
import { NotFoundError } from "../utils/errors";

export default function GenericPage({
  pageData,
  params,
  path,
}: {
  pageData: LocalFeedWithComponents;
  params: Record<string, string>;
  path: string;
}) {
  console.log(
    "PageResolver received pageData:",
    pageData,
    "with params:",
    params,
    "and path:",
    path,
  );

  // pageData contains a feed with components that can be rendered
  // Each component should govern if it can be rendered based on the user's auth state and other factors
  // If no components can be rendered, we should render a default 404 component
  if (pageData.components.length === 0) {
    throw new NotFoundError(`No components found for path: ${path}`);
  }
  return (
    <>
      {pageData.components.map((component, index) => {
        const Block = Blocks[component.typeName as keyof typeof Blocks];
        if (Block) {
          return (
            <Suspense key={index} fallback={<Loading />}>
              <Block component={component} params={params} path={path} />
            </Suspense>
          );
        }
        return (
          <Suspense key={index} fallback={<Loading />}>
            <Blocks.FourOhFour
              component={fourOhFourComponent}
              params={params}
              path={path}
            />
          </Suspense>
        );
      })}
    </>
  );
}
