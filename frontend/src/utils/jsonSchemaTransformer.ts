import { EmptyObject } from "react-hook-form";
import { FormComponentProps } from "../components/inputs/Input";
import {
  convertIdArrayToNumbers,
  convertNumbersToIdArray,
  convertStringsToTagnameArray,
  convertTagnameArrayToStrings,
} from "./formToApiMapper";

function getMaxItems(schema: JSONSchemaForArray): {
  maxLength?: { value: number; message: string };
} {
  if (typeof schema.maxItems === "number" && schema.maxItems > 0) {
    return {
      maxLength: {
        value: schema.maxItems,
        message: `You can select up to ${schema.maxItems} items`,
      },
    };
  }
  return {};
}

function getMinItems(schema: JSONSchemaForArray): {
  minLength?: { value: number; message: string };
} {
  if (typeof schema.minItems === "number" && schema.minItems > 0) {
    return {
      minLength: {
        value: schema.minItems,
        message: `You must select at least ${schema.minItems} items`,
      },
    };
  }
  return {};
}

function getUniqueItems(schema: JSONSchemaForArray): {
  validate?: (value: unknown) => true | string;
} {
  if (schema.uniqueItems === true) {
    return {
      validate: (value: unknown) => {
        if (Array.isArray(value)) {
          const uniqueValues = new Set(value);
          return uniqueValues.size === value.length || "Items must be unique";
        }
        return true;
      },
    };
  }
  return {};
}

type JSONSchema = {
  type: "array" | "enum";
  title?: string;
  description?: string;
};

type JSONSchemaForArray = JSONSchema & {
  type: "array";
  items: {
    type: "string" | "number";
  };
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
};

type JSONSchemaForEnum = JSONSchema & {
  type: "enum";
  enum: string[];
  enumNames?: string[];
  default?: string;
};

export type JSONSchemaForArrayOrEnum =
  | JSONSchemaForArray
  | JSONSchemaForEnum
  | EmptyObject;

export default function convertJSONSchemaToFormInputs(
  schema: JSONSchemaForArrayOrEnum,
): {
  inputs: FormComponentProps[];
  defaults: Record<string, unknown>;
} {
  const inputs: FormComponentProps[] = [];
  const defaults: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema)) {
    switch (key) {
      case "tagAllowList":
        inputs.push({
          dataName: `propertyValues.${key}`,
          displayName: value?.["title"] || key,
          componentName: "TagArrayInput",
          description: value?.["description"],
          input: {
            rules: {
              ...getMaxItems(value),
              ...getMinItems(value),
              ...getUniqueItems(value),
            },
          },
        });
        defaults[key] = [];
        break;
      case "itemAllowList":
        inputs.push({
          dataName: `propertyValues.${key}`,
          displayName: value?.["title"] || key,
          componentName: "ItemArrayInput",
          description: value?.["description"],
          input: {
            rules: {
              ...getMaxItems(value),
              ...getMinItems(value),
              ...getUniqueItems(value),
            },
          },
        });
        defaults[key] = [];
        break;
      case "referenceFeed":
        inputs.push({
          dataName: `propertyValues.${key}`,
          displayName: value?.["title"] || key,
          componentName: "ReferenceFeedInput",
          description: value?.["description"],
          input: {
            rules: {
              ...getMaxItems(value),
              ...getMinItems(value),
              ...getUniqueItems(value),
            },
          },
        });
        defaults[key] = [];
        break;
      case "isPrimaryContent":
        inputs.push({
          dataName: `propertyValues.${key}`,
          displayName: value?.["title"] || key,
          componentName: "ToggleInput",
          description: value?.["description"],

          input: {},
        });
        defaults[key] = false;
        break;
      default:
        inputs.push({
          dataName: `propertyValues.${key}`,
          displayName: value?.["title"] || key,
          componentName: "RadioInput",
          description: value?.["description"],
          input: {
            valueOptions:
              "enum" in value && Array.isArray(value.enum)
                ? value.enum.map((option: string, index: number) => ({
                    label: value?.["enumNames"]?.[index] || option,
                    value: option,
                  }))
                : [],
          },
        });
        defaults[key] = value.default;
        break;
    }
  }

  return { inputs, defaults: { propertyValues: defaults } };
}

export const propertyValuesFromFormMapper = (values: {
  propertyValues: Record<string, unknown>;
}) => {
  const { tagAllowList, itemAllowList, referenceFeed, ...rest } =
    values.propertyValues;
  return {
    ...rest,
    ...(!!tagAllowList && {
      tagAllowList: convertTagnameArrayToStrings(
        tagAllowList as { name: string }[],
      ),
    }),
    ...(!!itemAllowList && {
      itemAllowList: convertIdArrayToNumbers(
        "itemId",
        itemAllowList as { itemId: number }[],
      ),
    }),
    ...(!!referenceFeed && {
      referenceFeed: convertIdArrayToNumbers(
        "feedId",
        referenceFeed as { feedId: number }[],
      ),
    }),
  };
};

export const propertyValuesToFormMapper = (
  propertyValues: Record<string, unknown>,
) => {
  const { tagAllowList, itemAllowList, referenceFeed, ...rest } =
    propertyValues;
  return {
    ...rest,
    ...(!!tagAllowList && {
      tagAllowList: convertStringsToTagnameArray(tagAllowList as string[]),
    }),
    ...(!!itemAllowList && {
      itemAllowList: convertNumbersToIdArray(
        "itemId",
        itemAllowList as number[],
      ),
    }),
    ...(!!referenceFeed && {
      referenceFeed: convertNumbersToIdArray(
        "feedId",
        referenceFeed as number[],
      ),
    }),
  };
};
