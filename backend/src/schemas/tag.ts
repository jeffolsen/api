import { z } from "zod";
import {
  MESSAGE_CODE_TYPE,
  MESSAGE_TAGS_UNIQUE,
} from "../config/errorMessages";
import { TagName } from "../db/client";
const tagArray = [...Object.values(TagName)] as const;

export const tagNameSchema = z.enum(TagName, MESSAGE_CODE_TYPE);

export const tagNameArraySchema = z
  .array(z.union(tagArray.map((val) => z.literal(val))))
  .refine((items) => {
    return new Set(items).size === items.length;
  }, MESSAGE_TAGS_UNIQUE);
