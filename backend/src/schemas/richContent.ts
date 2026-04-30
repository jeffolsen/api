import { z } from "zod";

const ALLOWED_NODES = new Set([
  "doc",
  "paragraph",
  "bulletList",
  "orderedList",
  "listItem",
  "text",
  "hardBreak",
]);

const ALLOWED_MARKS = new Set(["bold", "italic", "pseudoHeading"]);

type TiptapNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string }[];
  content?: TiptapNode[];
};

function validateNode(node: TiptapNode): boolean {
  if (!ALLOWED_NODES.has(node.type)) return false;
  if (node.marks?.some((m) => !ALLOWED_MARKS.has(m.type))) return false;
  if (node.content) {
    return node.content.every(validateNode);
  }
  return true;
}

function isEmptyParagraph(node: TiptapNode): boolean {
  if (node.type !== "paragraph") return false;
  if (!node.content || node.content.length === 0) return true;
  return node.content.every(
    (child) => child.type === "text" && !child.text?.trim(),
  );
}

export const richContentSchema = z
  .record(z.string(), z.unknown())
  .refine(
    (val) => {
      if (Object.keys(val).length === 0) return true;
      return validateNode(val as TiptapNode);
    },
    { message: "richContent contains disallowed element types" },
  )
  .transform((val) => {
    if (Object.keys(val).length === 0) return val;
    const doc = val as TiptapNode;
    if (!doc.content) return {};

    let start = 0;
    let end = doc.content.length;

    while (start < end && isEmptyParagraph(doc.content[start])) start++;
    while (end > start && isEmptyParagraph(doc.content[end - 1])) end--;

    if (start === end) return {};
    if (start === 0 && end === doc.content.length) return val;
    return { ...doc, content: doc.content.slice(start, end) };
  })
  .default({});
