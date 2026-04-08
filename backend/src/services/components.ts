import { ObjectSchema, validatePropertySchema } from "../schemas/componentType";
import { Component, ComponentType } from "../db/client";
import throwError from "../util/throwError";
import { BAD_REQUEST } from "../config/errorCodes";

export const validateComponentPropertyValues = async (
  componentType: ComponentType,
  propertyValues: Record<string, unknown>,
) => {
  // const { tagAllowList, itemAllowList, ...propertySchema }
  const propertySchema = ObjectSchema.parse(componentType.propertySchema);
  const values = ObjectSchema.parse(propertyValues);
  // there are two special properties for content filtering: tagAllowList and itemAllowList.
  // these are validated as arrays of strings and numeric ids.
  // await TagAllowListSchema.parseAsync({ tagAllowList });
  // await ItemAllowListSchema.parseAsync({ itemAllowList });

  // for simplicity, all other properties will be enums and the values must be found in the corresponding schema's list.
  for (const property in propertySchema) {
    const schema = ObjectSchema.parse(propertySchema[property]);
    await validatePropertySchema(schema, values[property]);
  }
};

interface OrderFeedComponentsForDeletionParams {
  components: Component[];
  component: Component;
  newOrder?: never;
}

interface OrderFeedComponentsForUpdateParams {
  components: Component[];
  component: Component;
  newOrder?: number;
}

interface OrderFeedComponentsForCreationParams {
  components: Component[];
  component: null;
  newOrder?: number;
}

type OrderFeedComponentsParams =
  | OrderFeedComponentsForDeletionParams
  | OrderFeedComponentsForUpdateParams
  | OrderFeedComponentsForCreationParams;

export const orderFeedsComponents: (
  params: OrderFeedComponentsParams,
) => Component[] = ({ components, component, newOrder }) => {
  throwError(
    component?.id || newOrder,
    BAD_REQUEST,
    "Either component or newOrder must be provided",
  );
  throwError(
    newOrder === undefined || newOrder > 0,
    BAD_REQUEST,
    "New order must be greater than 0",
  );
  throwError(
    newOrder === undefined ||
      newOrder <= components.length + (component ? 0 : 1),
    BAD_REQUEST,
    "New order cannot be higher than the number of components in the feed",
  );
  throwError(
    component === null || components.some((c) => c.id === component.id),
    BAD_REQUEST,
    "Component must be in the feed's components",
  );

  // if component is provided and newOrder is not provided, we are deleting the component and need to reorder the other components accordingly by decrementing the order of all components with an order greater than the deleted component's order.
  if (component && !newOrder) {
    return components
      .filter((c) => c.id !== component.id && c.order > component.order)
      .map((c) => ({ ...c, order: c.order - 1 }));
  }
  // if component is null and newOrder is provided, we are creating a new component and need to reorder the other components accordingly by incrementing the order of all components with an order greater than or equal to the new component's order.
  if (component === null && newOrder) {
    return components
      .filter((c) => c.order >= newOrder)
      .map((c) => ({ ...c, order: c.order + 1 }));
  }

  // if component and newOrder are both provided, we are updating the component's order and need to reorder the other components accordingly.
  if (newOrder === component?.order) return [];

  if (component && newOrder) {
    return components
      .filter(
        (c) =>
          c.id !== component.id &&
          ((c.order >= newOrder && c.order < component.order) ||
            (c.order <= newOrder && c.order > component.order)),
      )
      .map((c) => ({
        ...c,
        order:
          c.order >= newOrder && c.order < component.order
            ? c.order + 1
            : c.order - 1,
      }));
  }

  return [];
};

const componentsService = {
  validateComponentPropertyValues,
  orderFeedsComponents,
};
export default componentsService;
