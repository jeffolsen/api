import { describe, expect, test } from "@jest/globals";

describe("running jest", () => {
  test("this test always passes", () => {
    expect(true).toBe(true);
  });
});
