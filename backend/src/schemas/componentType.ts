import { z } from "zod";

export const TagAllowListSchema = z.object({
  itemAllowList: z.array(z.string()),
});

export const ItemAllowListSchema = z.object({
  itemAllowList: z.array(z.number()),
});

export const ObjectSchema = z.record(z.string(), z.unknown());

export const validatePropertySchema = async (
  property: Record<string, unknown>,
  value: unknown,
) => {
  const schema = z.fromJSONSchema(property);
  return await schema.parseAsync(value);
};
