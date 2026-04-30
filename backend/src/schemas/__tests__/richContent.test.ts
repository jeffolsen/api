import { describe, expect, it } from "@jest/globals";
import { richContentSchema } from "../richContent";

const parse = (val: unknown) => richContentSchema.parse(val);

const emptyParagraph = { type: "paragraph" };
const emptyParagraphWithText = {
  type: "paragraph",
  content: [{ type: "text", text: "   " }],
};

const realParagraph = {
  type: "paragraph",
  content: [{ type: "text", text: "Hello world" }],
};

const paragraphWithBold = {
  type: "paragraph",
  content: [
    { type: "text", text: "Hello ", marks: [{ type: "bold" }] },
    { type: "text", text: "world" },
  ],
};

const nestedList = {
  type: "orderedList",
  attrs: { start: 1, type: null },
  content: [
    {
      type: "listItem",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "item" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "nested",
                      marks: [{ type: "italic" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe("richContentSchema", () => {
  describe("default and empty object", () => {
    it("returns {} when no value is provided", () => {
      expect(parse(undefined)).toEqual({});
    });

    it("passes {} through unchanged", () => {
      expect(parse({})).toEqual({});
    });
  });

  describe("empty doc collapsing", () => {
    it("collapses a doc of only empty paragraphs to {}", () => {
      const doc = {
        type: "doc",
        content: [emptyParagraph, emptyParagraph, emptyParagraph],
      };
      expect(parse(doc)).toEqual({});
    });

    it("collapses a doc of only whitespace-text paragraphs to {}", () => {
      const doc = {
        type: "doc",
        content: [emptyParagraphWithText, emptyParagraphWithText],
      };
      expect(parse(doc)).toEqual({});
    });

    it("collapses a doc with no content array to {}", () => {
      expect(parse({ type: "doc" })).toEqual({});
    });
  });

  describe("trimming empty paragraphs", () => {
    it("strips trailing empty paragraphs", () => {
      const doc = {
        type: "doc",
        content: [realParagraph, emptyParagraph, emptyParagraph],
      };
      expect(parse(doc)).toEqual({ type: "doc", content: [realParagraph] });
    });

    it("strips leading empty paragraphs", () => {
      const doc = {
        type: "doc",
        content: [emptyParagraph, emptyParagraph, realParagraph],
      };
      expect(parse(doc)).toEqual({ type: "doc", content: [realParagraph] });
    });

    it("strips both leading and trailing empty paragraphs", () => {
      const doc = {
        type: "doc",
        content: [
          emptyParagraph,
          emptyParagraph,
          realParagraph,
          emptyParagraph,
        ],
      };
      expect(parse(doc)).toEqual({ type: "doc", content: [realParagraph] });
    });

    it("preserves empty paragraphs between real content nodes", () => {
      const doc = {
        type: "doc",
        content: [realParagraph, emptyParagraph, paragraphWithBold],
      };
      expect(parse(doc)).toEqual(doc);
    });
  });

  describe("valid content passes through", () => {
    it("passes a doc with real paragraphs unchanged", () => {
      const doc = { type: "doc", content: [realParagraph, paragraphWithBold] };
      expect(parse(doc)).toEqual(doc);
    });

    it("passes bold marks", () => {
      const doc = { type: "doc", content: [paragraphWithBold] };
      expect(parse(doc)).toEqual(doc);
    });

    it("passes italic marks", () => {
      const doc = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "hi", marks: [{ type: "italic" }] },
            ],
          },
        ],
      };
      expect(parse(doc)).toEqual(doc);
    });

    it("passes pseudoHeading marks", () => {
      const doc = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Title",
                marks: [{ type: "pseudoHeading" }],
              },
            ],
          },
        ],
      };
      expect(parse(doc)).toEqual(doc);
    });

    it("passes nested orderedList inside bulletList", () => {
      const doc = { type: "doc", content: [nestedList] };
      expect(parse(doc)).toEqual(doc);
    });

    it("passes attrs on orderedList through unchanged", () => {
      const doc = {
        type: "doc",
        content: [
          {
            type: "orderedList",
            attrs: { start: 3, type: null },
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "item" }],
                  },
                ],
              },
            ],
          },
        ],
      };
      expect(parse(doc)).toEqual(doc);
    });
  });

  describe("disallowed node types are rejected", () => {
    it("rejects a heading node at the top level", () => {
      const doc = {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "hi" }],
          },
        ],
      };
      expect(() => parse(doc)).toThrow();
    });

    it("rejects a blockquote node", () => {
      const doc = {
        type: "doc",
        content: [{ type: "blockquote", content: [realParagraph] }],
      };
      expect(() => parse(doc)).toThrow();
    });

    it("rejects a codeBlock node", () => {
      const doc = {
        type: "doc",
        content: [
          { type: "codeBlock", content: [{ type: "text", text: "code" }] },
        ],
      };
      expect(() => parse(doc)).toThrow();
    });

    it("rejects a disallowed node buried inside a nested list", () => {
      const doc = {
        type: "doc",
        content: [
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "ok" }],
                  },
                  {
                    type: "orderedList",
                    content: [
                      {
                        type: "listItem",
                        content: [
                          { type: "blockquote", content: [realParagraph] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      expect(() => parse(doc)).toThrow();
    });
  });

  describe("disallowed mark types are rejected", () => {
    it("rejects a strike mark", () => {
      const doc = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "hi", marks: [{ type: "strike" }] },
            ],
          },
        ],
      };
      expect(() => parse(doc)).toThrow();
    });

    it("rejects a code mark", () => {
      const doc = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "hi", marks: [{ type: "code" }] }],
          },
        ],
      };
      expect(() => parse(doc)).toThrow();
    });

    it("rejects a disallowed mark buried inside a nested list", () => {
      const doc = {
        type: "doc",
        content: [
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "sneaky",
                        marks: [{ type: "strike" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      expect(() => parse(doc)).toThrow();
    });
  });
});
