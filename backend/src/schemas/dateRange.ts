import { z } from "zod";
import { dateTimeSchema, descriptionSchema } from "./properties";
import { ERROR_START_END_DATE } from "../config/constants";

export const dateRangeSchema = z
  .object({
    startAt: dateTimeSchema,
    endAt: dateTimeSchema,
    description: descriptionSchema.optional(),
  })
  .refine((data) => new Date(data.startAt) <= new Date(data.endAt), {
    message: ERROR_START_END_DATE,
  });

export const dateRangeArraySchema = z.array(dateRangeSchema);

export type DateRange = z.infer<typeof dateRangeSchema>;
export type DateRangeArray = z.infer<typeof dateRangeArraySchema>;
