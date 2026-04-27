import { ObjectSchema, validatePropertySchema } from "@schemas/componentType";
import { Component, ComponentType } from "@db/client";
import throwError from "@util/throwError";
import { BAD_REQUEST } from "@config/errorCodes";

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

export const reorderComponentsForDeletion = (
  components: Component[],
  componentToDelete: Component,
) => {
  return components
    .filter(
      (c) => c.id !== componentToDelete.id && c.order > componentToDelete.order,
    )
    .map((c) => ({ ...c, order: c.order - 1 }));
};

export const reorderComponentsForUpdate = (
  components: Component[],
  componentToUpdate: Component,
  newOrder: number,
) => {
  throwError(
    newOrder <= components.length,
    BAD_REQUEST,
    "New order cannot be higher than the number of components in the feed",
  );
  if (newOrder === componentToUpdate.order) return [];

  return components
    .filter(
      (c) =>
        c.id !== componentToUpdate.id &&
        ((c.order >= newOrder && c.order < componentToUpdate.order) ||
          (c.order <= newOrder && c.order > componentToUpdate.order)),
    )
    .map((c) => ({
      ...c,
      order:
        c.order >= newOrder && c.order < componentToUpdate.order
          ? c.order + 1
          : c.order - 1,
    }));
};

export const reorderComponentsForCreation = (
  components: Component[],
  newOrder: number,
) => {
  throwError(
    newOrder <= components.length + 1,
    BAD_REQUEST,
    "New order cannot be higher than the number of components in the feed",
  );
  return components
    .filter((c) => c.order >= newOrder)
    .map((c) => ({ ...c, order: c.order + 1 }));
};

const componentsService = {
  validateComponentPropertyValues,
  reorderComponentsForCreation,
  reorderComponentsForUpdate,
  reorderComponentsForDeletion,
};
export default componentsService;
