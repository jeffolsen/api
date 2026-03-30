import { z } from "zod";
import {
  descriptionSchema,
  nameSchema,
  idArraySchema,
  dateTimeSchema,
  idStringSchema,
} from "./properties";
import { tagNameArraySchema } from "./tag";
import { dateRangeArraySchema } from "./dateRange";
import sortWord from "../util/sortWord";

const validItemSortValues = [
  "sortName",
  "-sortName",
  "publishedAt",
  "-publishedAt",
  "expiredAt",
  "-expiredAt",
  "createdAt",
  "-createdAt",
  "updatedAt",
  "-updatedAt",
] as const;

export type ItemSortValues = keyof typeof validItemSortValues;

export const itemSortSchema = z.enum(validItemSortValues, "Invalid sort value");

export const itemsSortArraySchema = z
  .array(z.union(validItemSortValues.map((val) => z.literal(val))))
  .refine((items) => {
    return (
      new Set(items.map((item) => item.replace(/^-/, ""))).size === items.length
    );
  }, "Sort values must be unique");

// controllers
export const CreateItemSchema = z
  .object({
    name: nameSchema,
    description: descriptionSchema.optional(),
    tagNames: tagNameArraySchema.default([]),
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

export type CreateItemInput = z.infer<typeof CreateItemSchema>;

export const UpdateItemSchema = z
  .object({
    name: nameSchema,
    description: descriptionSchema.optional(),
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

export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

export const ModifyItemSchema = z
  .object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    publishedAt: dateTimeSchema.nullish().optional(),
    expiredAt: dateTimeSchema.nullish().optional(),
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
      sortName: data.name ? sortWord(data.name) : undefined,
    };
  });

export type ModifyItemInput = z.infer<typeof ModifyItemSchema>;

export const GetAllItemsQuerySchema = z.object({
  sort: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.split(",").map((sort) => sort.trim());
    }
    return ["-updatedAt"];
  }, itemsSortArraySchema),
  tags: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.split(",").map((tag) => tag.trim());
      }
      return [];
    }, tagNameArraySchema)
    .default([]),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

export const GetItemByIdSchema = z.object({
  id: idStringSchema,
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
  itemId: idStringSchema,
});

export const GetItemResourceByIdSchema = z.object({
  itemId: idStringSchema,
  id: idStringSchema,
});
