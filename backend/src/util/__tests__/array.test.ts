import { describe, expect, it } from "@jest/globals";
import { isTagArray } from "../array";
import { TagName } from "../../db/client";

describe("isTagArray", () => {
  describe("valid arrays", () => {
    it("should return true for valid TagName array", () => {
      const validArray: TagName[] = [TagName.RED, TagName.BLUE, TagName.GREEN];
      const result = isTagArray(validArray);

      expect(result).toBe(true);
    });

    it("should return true for empty array", () => {
      const emptyArray: unknown[] = [];
      const result = isTagArray(emptyArray);

      expect(result).toBe(true);
    });

    it("should return true for single element array", () => {
      const singleArray = [TagName.PERSON];
      const result = isTagArray(singleArray);

      expect(result).toBe(true);
    });

    it("should return true for array with all TagName values", () => {
      const allTags = [
        TagName.PERSON,
        TagName.PLACE,
        TagName.THING,
        TagName.PAST,
        TagName.PRESENT,
        TagName.FUTURE,
        TagName.RED,
        TagName.BLUE,
        TagName.GREEN,
        TagName.FOO,
        TagName.BAR,
        TagName.BAZ,
      ];
      const result = isTagArray(allTags);

      expect(result).toBe(true);
    });

    it("should return true for array with duplicate valid tags", () => {
      const duplicateArray = [TagName.RED, TagName.RED, TagName.BLUE];
      const result = isTagArray(duplicateArray);

      expect(result).toBe(true);
    });
  });

  describe("invalid arrays", () => {
    it("should return false for non-array", () => {
      const notAnArray = "not an array";
      const result = isTagArray(notAnArray);

      expect(result).toBe(false);
    });

    it("should return false for null", () => {
      const nullValue = null;
      const result = isTagArray(nullValue);

      expect(result).toBe(false);
    });

    it("should return false for undefined", () => {
      const undefinedValue = undefined;
      const result = isTagArray(undefinedValue);

      expect(result).toBe(false);
    });

    it("should return false for array with invalid tag", () => {
      const invalidArray = ["INVALID_TAG"];
      const result = isTagArray(invalidArray);

      expect(result).toBe(false);
    });

    it("should return false for mixed valid/invalid tags", () => {
      const mixedArray = [TagName.RED, "INVALID", TagName.BLUE];
      const result = isTagArray(mixedArray);

      expect(result).toBe(false);
    });

    it("should return false for array of numbers", () => {
      const numberArray = [1, 2, 3];
      const result = isTagArray(numberArray);

      expect(result).toBe(false);
    });

    it("should return false for array of objects", () => {
      const objectArray = [{ name: TagName.RED }, { name: TagName.BLUE }];
      const result = isTagArray(objectArray);

      expect(result).toBe(false);
    });

    it("should return false for array with similar but incorrect strings", () => {
      const similarArray = ["red", "blue", "green"]; // lowercase instead of uppercase
      const result = isTagArray(similarArray);

      expect(result).toBe(false);
    });

    it("should return false for array with object containing TagName property", () => {
      const objectWithTagName = [{ tag: TagName.RED }];
      const result = isTagArray(objectWithTagName);

      expect(result).toBe(false);
    });

    it("should return false for object (not array)", () => {
      const objectNotArray = { 0: TagName.RED, 1: TagName.BLUE, length: 2 };
      const result = isTagArray(objectNotArray);

      expect(result).toBe(false);
    });

    it("should return false for boolean", () => {
      const boolValue = true;
      const result = isTagArray(boolValue);

      expect(result).toBe(false);
    });

    it("should return false for number", () => {
      const numValue = 123;
      const result = isTagArray(numValue);

      expect(result).toBe(false);
    });
  });
});
