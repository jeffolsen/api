import { Suspense } from "react";
import Loading from "../components/common/Loading";
import { LocalFeedWithComponents } from "../config/routes";
import Blocks from "../components/blocks/Blocks";
import { NotFoundError } from "../utils/errors";

export default function PageResolver({
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
  // if (pageData.components.length === 0) {
  //   throw new NotFoundError(`No components found for path: ${path}`);
  // }

  const renderedComponents = pageData.components
    .map((component, index) => {
      const Block = Blocks[component.typeName as keyof typeof Blocks];
      if (Block) {
        return (
          <Block
            component={component}
            params={params}
            path={path}
            key={index}
          />
        );
      }
      return null;
    })
    .filter(Boolean);

  if (renderedComponents.length === 0) {
    throw new NotFoundError(`No renderable components found for path: ${path}`);
  }

  return <Suspense fallback={<Loading />}>{renderedComponents}</Suspense>;
}
