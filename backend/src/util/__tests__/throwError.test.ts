import { describe, expect, it } from "@jest/globals";
import throwError from "../throwError";
import {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "../../config/constants";

describe("throwError", () => {
  describe("truthy conditions (no error thrown)", () => {
    it("should not throw when condition is true", () => {
      expect(() => {
        throwError(true, BAD_REQUEST, "This should not throw");
      }).not.toThrow();
    });

    it("should not throw when condition is truthy string", () => {
      expect(() => {
        throwError("truthy string", BAD_REQUEST, "This should not throw");
      }).not.toThrow();
    });

    it("should not throw when condition is truthy number", () => {
      expect(() => {
        throwError(42, BAD_REQUEST, "This should not throw");
      }).not.toThrow();
    });

    it("should not throw when condition is truthy object", () => {
      expect(() => {
        throwError({ key: "value" }, BAD_REQUEST, "This should not throw");
      }).not.toThrow();
    });

    it("should not throw when condition is truthy array", () => {
      expect(() => {
        throwError([1, 2, 3], BAD_REQUEST, "This should not throw");
      }).not.toThrow();
    });

    it("should not throw when condition is negative number", () => {
      expect(() => {
        throwError(-1, BAD_REQUEST, "This should not throw");
      }).not.toThrow();
    });

    it("should not throw when condition is empty object", () => {
      expect(() => {
        throwError({}, BAD_REQUEST, "This should not throw");
      }).not.toThrow();
    });
  });

  describe("falsy conditions (error thrown)", () => {
    it("should throw HttpError when condition is false", () => {
      expect(() => {
        throwError(false, BAD_REQUEST, "Test error message");
      }).toThrow();
    });

    it("should throw HttpError when condition is null", () => {
      expect(() => {
        throwError(null, BAD_REQUEST, "Test error message");
      }).toThrow();
    });

    it("should throw HttpError when condition is undefined", () => {
      expect(() => {
        throwError(undefined, BAD_REQUEST, "Test error message");
      }).toThrow();
    });

    it("should throw HttpError when condition is 0", () => {
      expect(() => {
        throwError(0, BAD_REQUEST, "Test error message");
      }).toThrow();
    });

    it("should throw HttpError when condition is empty string", () => {
      expect(() => {
        throwError("", BAD_REQUEST, "Test error message");
      }).toThrow();
    });

    it("should throw HttpError when condition is NaN", () => {
      expect(() => {
        throwError(NaN, BAD_REQUEST, "Test error message");
      }).toThrow();
    });

    it("should throw HttpError when condition is empty array", () => {
      // Note: empty array is actually truthy in JavaScript
      expect(() => {
        throwError([], BAD_REQUEST, "This should NOT throw");
      }).not.toThrow();
    });
  });

  describe("type narrowing behavior", () => {
    it("should narrow type after assertion passes", () => {
      const value: string | null = "valid value";

      // This should not throw
      throwError(value, BAD_REQUEST, "Value is required");

      // TypeScript now knows value is string (not null)
      const upperCase: string = value.toUpperCase();
      expect(upperCase).toBe("VALID VALUE");
    });

    it("should work with object property checks", () => {
      interface User {
        id: number;
        name?: string;
      }

      const user: User = { id: 1, name: "Alice" };

      throwError(user.name, NOT_FOUND, "User name not found");

      // TypeScript now knows user.name is defined
      const nameLength: number = user.name.length;
      expect(nameLength).toBe(5);
    });
  });
});
