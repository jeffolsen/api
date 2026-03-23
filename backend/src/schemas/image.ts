import { z } from "zod";
import { ImageType } from "../db/client";

export const imageTypeSchema = z.enum(ImageType);

const validImageSortValues = [
  "createdAt",
  "-createdAt",
  "updatedAt",
  "-updatedAt",
] as const;

export const validImageSortArraySchema = z
  .array(z.union(validImageSortValues.map((val) => z.literal(val))))
  .refine((items) => {
    return (
      new Set(items.map((item) => item.replace(/^-/, ""))).size === items.length
    );
  }, "Sort values must be unique");

export const GetAllImagesQuerySchema = z.object({
  type: imageTypeSchema.optional(),
  sort: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.split(",").map((sort) => sort.trim());
    }
    return ["-updatedAt"];
  }, validImageSortArraySchema),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(50),
});

export type GetAllImagesQuery = z.infer<typeof GetAllImagesQuerySchema>;

// not creating images through the API, so no create/update schemas for now
