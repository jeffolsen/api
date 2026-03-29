import { z } from "zod";
import { RELATIVE_PATH_REGEX } from "../config/constants";
import { dateTimeSchema, subjectTypeSchema } from "./properties";

export const CreateFeedBodySchema = z
  .object({
    path: z.string().min(1).max(255).regex(RELATIVE_PATH_REGEX),
    subjectType: subjectTypeSchema,
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
  );
