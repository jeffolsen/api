import { z } from "zod";
import { dateTimeSchema, publishedAtAndExpiredAtSchema } from "./properties";

export const CreateComponentSchema = z
  .object({
    feedId: z.number(),
    typeId: z.number(),
    order: z.number(),
    name: z.string(),
    propertyValues: z.record(z.string(), z.unknown()).optional(),
  })
  .extend(publishedAtAndExpiredAtSchema.shape);

export type CreateComponentInput = z.infer<typeof CreateComponentSchema>;

export const UpdateComponentSchema = z
  .object({
    order: z.number(),
    name: z.string(),
    propertyValues: z.record(z.string(), z.unknown()).optional(),
  })
  .extend(publishedAtAndExpiredAtSchema.shape);

export type UpdateComponentInput = z.infer<typeof UpdateComponentSchema>;

export const ModifyComponentSchema = UpdateComponentSchema.partial();

export type ModifyComponentInput = z.infer<typeof ModifyComponentSchema>;
