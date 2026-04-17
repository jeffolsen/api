import { Suspense } from "react";
import Loading from "../components/common/Loading";
import { LocalFeedWithComponents } from "../config/routes";
import Blocks from "../components/blocks/Blocks";
import { NotFoundError } from "../utils/errors";
import { isAuthenticated } from "../network/api";

export default function PageResolver({
  pageData,
  params,
  path,
}: {
  pageData: LocalFeedWithComponents;
  params: Record<string, string>;
  path: string;
}) {
  // Filter components based on authentication status
  const authenticated = isAuthenticated();
  const filteredComponents = filterByAuthentication(
    pageData.components,
    authenticated,
  );

  // If no component we should
  if (filteredComponents.length === 0) {
    throw new NotFoundError();
  }

  // Ensure only the first component with isPrimaryContent=true retains that property to respect H1 usage for SEO and accessibility
  const h1RespectingComponents = ensureSinglePrimaryContent(filteredComponents);

  const renderedComponents = h1RespectingComponents
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

const filterByAuthentication = (
  components: LocalFeedWithComponents["components"],
  isAuthenticated: boolean,
) => {
  return components.filter((component) => {
    const hideFor = component.propertyValues.hideFor;
    if (hideFor === "authenticated" && isAuthenticated) {
      return false;
    }
    if (hideFor === "unauthenticated" && !isAuthenticated) {
      return false;
    }
    return true;
  });
};

const ensureSinglePrimaryContent = (
  components: LocalFeedWithComponents["components"],
) => {
  const firstPrimaryContentIndex = components.findIndex(
    (component) => component.propertyValues.isPrimaryContent,
  );

  if (firstPrimaryContentIndex === -1) {
    // no primaryConent found, add a default one to the first component
    components[0] = {
      ...components[0],
      propertyValues: {
        ...components[0].propertyValues,
        isPrimaryContent: true,
      },
    };
    return components;
  }
  return components.map((component, index) => {
    if (
      index > firstPrimaryContentIndex &&
      component.propertyValues.isPrimaryContent
    ) {
      return {
        ...component,
        propertyValues: {
          ...component.propertyValues,
          isPrimaryContent: false,
        },
      };
    }
    return component;
  });
};
