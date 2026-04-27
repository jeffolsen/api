import { z } from "zod";
import { RELATIVE_PATH_REGEX } from "@config/constants";
import {
  idArraySchema,
  idStringSchema,
  publishedAtAndExpiredAtSchema,
  subjectTypesArraySchema,
  subjectTypeSchema,
} from "./properties";
import { id } from "zod/v4/locales";

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
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

export const CreateFeedBodySchema = z
  .object({
    path: pathSchema,
    subjectType: subjectTypeSchema,
  })
  .extend(publishedAtAndExpiredAtSchema.shape);

export const UpdateFeedBodySchema = z
  .object({
    id: idStringSchema,
    path: pathSchema.optional(),
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
