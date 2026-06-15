import { TComponent } from "@/network/component/types";
import { TFeedWithIncludes } from "@/network/feed/types";

type ProcessedFeedAndHeaderHero = {
  processedFeed: TFeedWithIncludes;
  headerHero: TComponent | null;
};

const processFeed = (feed: TFeedWithIncludes): ProcessedFeedAndHeaderHero => {
  // we might want to filter some types of components by the feed's tags
  // ie, ensureOnTopicComponents(feed)
  // we might want to filter by authstate
  // ie, ensureOnlyCurrentAuthStateComponents(feed.components)
  const firstHeaderComponent = ensureOnlyOneHeaderComponent(feed.components);
  const bodyComponents = ensureOnlyBodyComponents(feed.components);
  const sortedComponents = ensureSinglePrimaryContent(bodyComponents).sort(
    (a, b) => a.order - b.order,
  );
  const components = ensureFirstComponentIsCritical(sortedComponents);

  return {
    processedFeed: { ...feed, components },
    headerHero: firstHeaderComponent,
  };
};

// transformations for cleanup
const ensureOnlyOneHeaderComponent = (components: TComponent[]) => {
  const headerHero = components.find(
    (component) =>
      component.typeName === "HeroCarousel" &&
      component.propertyValues.location === "header",
  );
  return headerHero
    ? {
        ...headerHero,
        propertyValues: { ...headerHero.propertyValues, critical: true },
      }
    : null;
};

const ensureOnlyBodyComponents = (components: TComponent[]) => {
  return [
    ...components.filter(
      (component) => component.propertyValues.location !== "header",
    ),
  ];
};

const ensureSinglePrimaryContent = (components: TComponent[]) => {
  const firstPrimaryContentIndex = components.findIndex(
    (component) => component.propertyValues.isPrimaryContent,
  );

  if (firstPrimaryContentIndex === -1) {
    return [
      {
        ...components[0],
        propertyValues: {
          ...components[0].propertyValues,
          isPrimaryContent: true,
        },
      },
      ...components.slice(1),
    ];
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

const ensureFirstComponentIsCritical = (components: TComponent[]) => {
  if (!components.length) return components;

  const firstComponent = { ...components[0] };
  return [
    {
      ...firstComponent,
      propertyValues: { ...firstComponent.propertyValues, critical: true },
    },
    ...components.slice(1),
  ];
};

export default processFeed;
