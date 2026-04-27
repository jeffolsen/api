import { z } from "zod";
import { SubjectType } from "@db/client";

export const TagAllowListSchema = z.object({
  tagAllowList: z.array(z.string()),
});

export const ItemAllowListSchema = z.object({
  itemAllowList: z.array(z.number()),
});

export const ReferenceFeedSchema = z.object({
  referenceFeed: z.array(z.number()),
});

export const ObjectSchema = z.record(z.string(), z.unknown());

export const validatePropertySchema = async (
  property: Record<string, unknown>,
  value: unknown,
) => {
  const schema = z.fromJSONSchema(property);
  return await schema.parseAsync(value);
};

export const GetAllComponentTypesQuerySchema = z.object({
  subjectType: z.enum(SubjectType).optional(),
});
