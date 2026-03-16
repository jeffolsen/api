import { z } from "zod";
import {
  descriptionSchema,
  tagNameArraySchema,
  itemsSortArraySchema,
  nameSchema,
  idArraySchema,
  dateTimeSchema,
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
  )
  .transform((data) => {
    return {
      ...data,
      sortName: sortWord(data.name),
    };
  });

export const GetAllItemsQuerySchema = z.object({
  sort: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.split(",").map((tag) => tag.trim());
    }
    return ["publishedAt"];
  }, itemsSortArraySchema),
  tags: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.split(",").map((tag) => tag.trim());
      }
      return [];
    }, tagNameArraySchema)
    .default([]),
});

export const GetItemByIdSchema = z.object({
  id: z.preprocess((val) => {
    const parsed = parseInt(val as string);
    if (isNaN(parsed)) {
      throw new Error("ID should be a number");
    }
    return parsed;
  }, z.number()),
  include: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          return val.split(",").map((field) => field.trim());
        }
        return [];
      },
      z.array(z.enum(["tags", "images", "dateRanges"])).transform((fields) => {
        const includeObj: Record<string, boolean> = {};
        fields.forEach((field) => {
          includeObj[field] = true;
        });
        return includeObj;
      }),
    )
    .default({}),
});

export const GetItemsResourcesSchema = z.object({
  itemId: z.preprocess((val) => {
    const parsed = parseInt(val as string);
    if (isNaN(parsed)) {
      throw new Error("ID should be a number");
    }
    return parsed;
  }, z.number()),
});

export const GetItemResourceByIdSchema = z.object({
  itemId: z.preprocess((val) => {
    const parsed = parseInt(val as string);
    if (isNaN(parsed)) {
      throw new Error("Item ID should be a number");
    }
    return parsed;
  }, z.number()),
  id: z.preprocess((val) => {
    const parsed = parseInt(val as string);
    if (isNaN(parsed)) {
      throw new Error("Tag ID should be a number");
    }
    return parsed;
  }, z.number()),
});
