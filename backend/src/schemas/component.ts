import { z } from "zod";
import { publishedAtAndExpiredAtSchema, idStringSchema } from "./properties";

export const CreateComponentSchema = z
  .object({
    feedId: z.number(),
    typeId: z.number(),
    name: z.string(),
    order: z.number().gt(0).optional(),
    propertyValues: z.record(z.string(), z.unknown()).optional(),
  })
  .extend(publishedAtAndExpiredAtSchema.shape);

export type CreateComponentInput = z.infer<typeof CreateComponentSchema>;

export const UpdateComponentSchema = z
  .object({
    id: idStringSchema,
    name: z.string(),
    order: z.number().gt(0).optional(),
    propertyValues: z.record(z.string(), z.unknown()).optional(),
  })
  .extend(publishedAtAndExpiredAtSchema.shape);

export type UpdateComponentInput = z.infer<typeof UpdateComponentSchema>;

export const ModifyComponentSchema = UpdateComponentSchema.partial();

export type ModifyComponentInput = z.infer<typeof ModifyComponentSchema>;
