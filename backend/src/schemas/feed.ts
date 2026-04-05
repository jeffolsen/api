import { z } from "zod";
import { RELATIVE_PATH_REGEX } from "../config/constants";
import {
  dateTimeSchema,
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

export const feedsSortArraySchema = z
  .array(z.union(validFeedSortValues.map((val) => z.literal(val))))
  .refine((items) => {
    return (
      new Set(items.map((item) => item.replace(/^-/, ""))).size === items.length
    );
  }, "Sort values must be unique");

export const GetAllFeedsQuerySchema = z.object({
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
    path: z.string().min(1).max(255).regex(RELATIVE_PATH_REGEX),
    subjectType: subjectTypeSchema,
  })
  .extend(publishedAtAndExpiredAtSchema.shape);

export const GetFeedsResourcesSchema = z.object({
  feedId: idStringSchema,
});

export const GetFeedsResourceByIdSchema = z.object({
  feedId: idStringSchema,
  id: idStringSchema,
});
