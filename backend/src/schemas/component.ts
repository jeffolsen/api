import { z } from "zod";
import { dateTimeSchema } from "./properties";

export const CreateComponentSchema = z
  .object({
    feedId: z.number(),
    typeId: z.number(),
    propertyValues: z.record(z.string(), z.unknown()).optional(),
    publishedAt: dateTimeSchema.nullish(),
    expiredAt: dateTimeSchema.nullish(),
  })
  .refine(
    (data) => {
      if (data.publishedAt && data.expiredAt) {
        return new Date(data.publishedAt) <= new Date(data.expiredAt);
      }
      return true;
    },
    {
      message: "publishedAt must be before expiredAt",
    },
  );
