import { z } from "zod";
import {
  descriptionSchema,
  nameSchema,
  idArraySchema,
  idStringSchema,
  publishedAtAndExpiredAtSchema,
  slugArraySchema,
} from "./properties";
import { tagNameArraySchema } from "./tag";
import { dateRangeArraySchema, dateRangeSchema } from "./dateRange";
import { richContentSchema } from "./richContent";
import { MESSAGE_SLUG, MESSAGE_START_END_DATE } from "@config/errorMessages";
import sortWord from "@util/sortWord";

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
    overrideLink: z.string().optional(),
    richContent: richContentSchema,
    tagNames: tagNameArraySchema.default([]),
    imageIds: idArraySchema.default([]),
    dateRanges: dateRangeArraySchema.default([]),
  })
  .extend(publishedAtAndExpiredAtSchema.shape)
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
  })
  .extend(publishedAtAndExpiredAtSchema.shape)
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
    overrideLink: z.string().optional(),
  })
  .extend(publishedAtAndExpiredAtSchema.shape)
  .transform((data) => {
    return {
      ...data,
      sortName: data.name ? sortWord(data.name) : undefined,
    };
  });

export type ModifyItemInput = z.infer<typeof ModifyItemSchema>;

const itemIncludeFields = ["tags", "images", "dateRanges"] as const;
export type ItemIncludeField = (typeof itemIncludeFields)[number];

export const GetAllItemsQuerySchema = z.object({
  privateOnly: z.coerce.boolean().default(false),
  liveOnly: z.coerce.boolean().default(false),
  includes: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [];
      },
      z.array(z.enum(itemIncludeFields)),
    )
    .default([]),
  ids: z
    .preprocess((val) => {
      if (typeof val === "string") {
        const idArray = val.split(",").map((id) => id.trim());
        if (idArray.every((id) => !isNaN(Number(id)))) {
          return idArray.map((id) => Number(id));
        }
      }
      return [];
    }, idArraySchema)
    .default([]),
  slugs: z.preprocess((val) => {
    if (typeof val === "string") {
      const slugArray = val
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean);
      return slugArray;
    }
    return [];
  }, slugArraySchema),
  searchName: z.string().optional(),
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

const buildIncludeObject = z
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
  .default({});

export const GetItemByIdSchema = z.object({
  id: idStringSchema,
  include: buildIncludeObject,
});

export const GetItemBySlugSchema = z.object({
  slug: z.string(MESSAGE_SLUG),
  include: buildIncludeObject,
});

export const GetItemsResourcesSchema = z.object({
  itemId: idStringSchema,
});

export const GetItemResourceByIdSchema = z.object({
  itemId: idStringSchema,
  id: idStringSchema,
});

export const AddItemImageByIdSchema = z.object({
  itemId: idStringSchema,
  id: idStringSchema.optional(),
  url: z.string().optional(),
});

export const AddItemTagByIdSchema = z.object({
  itemId: idStringSchema,
  id: idStringSchema.optional(),
  name: z.string().optional(),
});

export const AddItemDateRangeByIdSchema = z
  .object({ itemId: idStringSchema })
  .extend(dateRangeSchema.shape)
  .refine((data) => new Date(data.startAt) <= new Date(data.endAt), {
    message: MESSAGE_START_END_DATE,
  });
