import { z } from "zod";
import { MESSAGE_TAGS_UNIQUE } from "../config/errorMessages";

export const tagNameArraySchema = z.array(z.string()).refine((items) => {
  return new Set(items).size === items.length;
}, MESSAGE_TAGS_UNIQUE);
