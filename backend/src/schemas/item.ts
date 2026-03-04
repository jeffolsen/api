import { z } from "zod";
import {
  contentSchema,
  subtitleSchema,
  tagNameArraySchema,
  titleSchema,
  idArraySchema,
} from "./properties";

// controllers
export const CreateItemSchema = z.object({
  title: titleSchema.optional(),
  subtitle: subtitleSchema.optional(),
  content: contentSchema.optional(),
  tags: tagNameArraySchema.optional(),
  images: idArraySchema.optional(),
});
