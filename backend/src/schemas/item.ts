import { z } from "zod";
import {
  contentSchema,
  subtitleSchema,
  tagNameArraySchema,
  titleSchema,
} from "./properties";

// controllers
export const CreateItemSchema = z.object({
  title: titleSchema,
  subtitle: subtitleSchema.optional(),
  content: contentSchema,
  tags: tagNameArraySchema,
});
