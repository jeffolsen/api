import { z } from "zod";
import {
  descriptionSchema,
  tagNameArraySchema,
  nameSchema,
  idArraySchema,
} from "./properties";
import { dateRangeArraySchema } from "./dateRange";
import sortWord from "../util/sortWord";

// controllers
export const CreateItemSchema = z
  .object({
    name: nameSchema,
    description: descriptionSchema.optional(),
    tags: tagNameArraySchema.default([]),
    imageIds: idArraySchema.default([]),
    dateRanges: dateRangeArraySchema.default([]),
  })
  .transform((data) => {
    return {
      ...data,
      sortName: sortWord(data.name),
    };
  });
