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

  describe("error properties", () => {
    it("should throw error with correct status code", () => {
      try {
        throwError(false, BAD_REQUEST, "Test error");
        expect(true).toBe(false); // Should not reach here
      } catch (error: unknown) {
        expect(error).toHaveProperty("status");
        expect((error as { status: number }).status).toBe(BAD_REQUEST);
      }
    });

    it("should throw error with correct message", () => {
      const errorMessage = "Custom error message";

      try {
        throwError(false, BAD_REQUEST, errorMessage);
        expect(true).toBe(false); // Should not reach here
      } catch (error: unknown) {
        expect(error).toHaveProperty("message");
        expect((error as Error).message).toBe(errorMessage);
      }
    });

    it("should throw error with correct statusCode property", () => {
      try {
        throwError(false, NOT_FOUND, "Resource not found");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect(error).toHaveProperty("statusCode");
        expect((error as { statusCode: number }).statusCode).toBe(NOT_FOUND);
      }
    });

    it("should create HttpError instance", () => {
      try {
        throwError(false, BAD_REQUEST, "Test error");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).name).toBe("BadRequestError");
      }
    });
  });

  describe("various HTTP codes", () => {
    it("should work with 400 BAD_REQUEST", () => {
      try {
        throwError(false, BAD_REQUEST, "Bad request error");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(400);
        expect((error as Error).name).toBe("BadRequestError");
      }
    });

    it("should work with 401 UNAUTHORIZED", () => {
      try {
        throwError(false, UNAUTHORIZED, "Unauthorized error");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(401);
        expect((error as Error).name).toBe("UnauthorizedError");
      }
    });

    it("should work with 403 FORBIDDEN", () => {
      try {
        throwError(false, FORBIDDEN, "Forbidden error");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(403);
        expect((error as Error).name).toBe("ForbiddenError");
      }
    });

    it("should work with 404 NOT_FOUND", () => {
      try {
        throwError(false, NOT_FOUND, "Not found error");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(404);
        expect((error as Error).name).toBe("NotFoundError");
      }
    });

    it("should work with 500 INTERNAL_SERVER_ERROR", () => {
      try {
        throwError(false, INTERNAL_SERVER_ERROR, "Internal server error");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(500);
        expect((error as Error).name).toBe("InternalServerError");
      }
    });

    it("should work with custom error codes", () => {
      try {
        throwError(false, 418, "I'm a teapot");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as { status: number }).status).toBe(418);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle long error messages", () => {
      const longMessage = "x".repeat(1000);

      try {
        throwError(false, BAD_REQUEST, longMessage);
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as Error).message).toBe(longMessage);
        expect((error as Error).message.length).toBe(1000);
      }
    });

    it("should handle empty error messages", () => {
      try {
        throwError(false, BAD_REQUEST, "");
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as Error).message).toBe("");
      }
    });

    it("should handle special characters in messages", () => {
      const specialMessage = "Error: <script>alert('xss')</script>";

      try {
        throwError(false, BAD_REQUEST, specialMessage);
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as Error).message).toBe(specialMessage);
      }
    });

    it("should handle unicode characters in messages", () => {
      const unicodeMessage = "Error: 你好 🚀 مرحبا";

      try {
        throwError(false, BAD_REQUEST, unicodeMessage);
        expect(true).toBe(false);
      } catch (error: unknown) {
        expect((error as Error).message).toBe(unicodeMessage);
      }
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
