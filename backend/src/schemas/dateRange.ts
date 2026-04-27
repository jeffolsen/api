import { z } from "zod";
import { dateTimeSchema, descriptionSchema } from "./properties";
import { MESSAGE_START_END_DATE } from "@config/errorMessages";

export const dateRangeSchema = z
  .object({
    startAt: dateTimeSchema,
    endAt: dateTimeSchema,
    description: descriptionSchema.optional(),
  })
  .refine((data) => new Date(data.startAt) <= new Date(data.endAt), {
    message: MESSAGE_START_END_DATE,
  });

export const dateRangeArraySchema = z.array(dateRangeSchema);

export type DateRange = z.infer<typeof dateRangeSchema>;
export type DateRangeArray = z.infer<typeof dateRangeArraySchema>;
