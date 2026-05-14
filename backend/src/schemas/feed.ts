import { z } from "zod";
import { RELATIVE_PATH_REGEX } from "@config/constants";
import {
  idArraySchema,
  idStringSchema,
  pathArraySchema,
  publishedAtAndExpiredAtSchema,
  subjectTypesArraySchema,
  subjectTypeSchema,
} from "./properties";
import { tagNameArraySchema } from "./tag";

export const feedIncludeFields = ["tags", "components"] as const;
export type FeedIncludeField = (typeof feedIncludeFields)[number];

const validFeedSortValues = [
  "publishedAt",
  "-publishedAt",
  "expiredAt",
  "-expiredAt",
  "createdAt",
  "-createdAt",
  "updatedAt",
  "-updatedAt",
] as const;

export type FeedSortValues = keyof typeof validFeedSortValues;

export const feedSortSchema = z.enum(validFeedSortValues, "Invalid sort value");
const pathSchema = z.string().min(1).max(255).regex(RELATIVE_PATH_REGEX);

export const feedsSortArraySchema = z
  .array(z.union(validFeedSortValues.map((val) => z.literal(val))))
  .refine((items) => {
    return (
      new Set(items.map((item) => item.replace(/^-/, ""))).size === items.length
    );
  }, "Sort values must be unique");

export const GetAllFeedsQuerySchema = z.object({
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
  paths: z.preprocess((val) => {
    if (typeof val === "string") {
      const slugArray = val
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean);
      return slugArray;
    }
    return [];
  }, pathArraySchema),
  searchPath: z.string().optional(),
  sort: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.split(",").map((sort) => sort.trim());
    }
    return ["-updatedAt"];
  }, feedsSortArraySchema),
  subjectTypes: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.split(",").map((tag) => tag.trim());
      }
      return [];
    }, subjectTypesArraySchema)
    .default([]),
  tags: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
      return [];
    }, tagNameArraySchema)
    .default([]),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  includes: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          return val
            .split(",")
            .map((s) => s.trim())
            .filter((s) => feedIncludeFields.includes(s as FeedIncludeField));
        }
        return [];
      },
      z.array(z.enum(feedIncludeFields)),
    )
    .default([]),
});

export const GetFeedIncludesQuerySchema = z.object({
  includes: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          return val
            .split(",")
            .map((s) => s.trim())
            .filter((s) => feedIncludeFields.includes(s as FeedIncludeField));
        }
        return [];
      },
      z.array(z.enum(feedIncludeFields)),
    )
    .default([]),
});

const tagIdsSchema = z
  .preprocess((val) => {
    if (Array.isArray(val)) return val.map(Number).filter((n) => !isNaN(n));
    return undefined;
  }, z.array(z.number().int().positive()))
  .optional();

export const CreateFeedBodySchema = z
  .object({
    path: pathSchema,
    subjectType: subjectTypeSchema,
    tagNames: tagNameArraySchema.default([]),
  })
  .extend(publishedAtAndExpiredAtSchema.shape);

export const UpdateFeedBodySchema = z
  .object({
    id: idStringSchema,
    path: pathSchema.optional(),
    tagNames: tagNameArraySchema.default([]),
  })
  .extend(publishedAtAndExpiredAtSchema.shape);

export const ModifyFeedBodySchema = UpdateFeedBodySchema;

export const DeleteFeedParamsSchema = z.object({
  id: idStringSchema,
});

export const GetFeedsResourcesSchema = z.object({
  feedId: idStringSchema,
});

export const GetFeedsResourceByIdSchema = z.object({
  feedId: idStringSchema,
  id: idStringSchema,
});

export const GetFeedComponentsQuery = z.object({
  published: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.toLowerCase() === "true";
      }
      return false;
    }, z.boolean())
    .optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});
