import { describe, expect, it } from "@jest/globals";
import templates from "../templates";
import { CodeType } from "../../db/client";

describe("templates", () => {
  describe("LOGIN template", () => {
    it("should return HTML string with LOGIN topic and code", () => {
      const code = "123456";
      const result = templates.LOGIN(CodeType.LOGIN, code);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result).toContain(CodeType.LOGIN);
      expect(result).toContain(code);
    });

    it("should include code in strong tags", () => {
      const code = "654321";
      const result = templates.LOGIN(CodeType.LOGIN, code);

      expect(result).toContain(`<strong>${code}</strong>`);
    });

    it("should handle empty string code", () => {
      const code = "";
      const result = templates.LOGIN(CodeType.LOGIN, code);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result).toContain(CodeType.LOGIN);
    });

    it("should handle HTML special characters in code", () => {
      const code = "<script>alert('xss')</script>";
      const result = templates.LOGIN(CodeType.LOGIN, code);

      expect(result).toBeDefined();
      expect(result).toContain(code);
    });

    it("should handle very long codes", () => {
      const code = "1".repeat(1000);
      const result = templates.LOGIN(CodeType.LOGIN, code);

      expect(result).toBeDefined();
      expect(result).toContain(code);
    });
  });

  describe("LOGOUT_ALL template", () => {
    it("should return HTML string with LOGOUT_ALL topic and code", () => {
      const code = "789012";
      const result = templates.LOGOUT_ALL(CodeType.LOGOUT_ALL, code);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result).toContain(CodeType.LOGOUT_ALL);
      expect(result).toContain(code);
    });

    it("should include code in strong tags", () => {
      const code = "345678";
      const result = templates.LOGOUT_ALL(CodeType.LOGOUT_ALL, code);

      expect(result).toContain(`<strong>${code}</strong>`);
    });
  });

  describe("PASSWORD_RESET template", () => {
    it("should return HTML string with PASSWORD_RESET topic and code", () => {
      const code = "901234";
      const result = templates.PASSWORD_RESET(CodeType.PASSWORD_RESET, code);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result).toContain(CodeType.PASSWORD_RESET);
      expect(result).toContain(code);
    });

    it("should include code in strong tags", () => {
      const code = "567890";
      const result = templates.PASSWORD_RESET(CodeType.PASSWORD_RESET, code);

      expect(result).toContain(`<strong>${code}</strong>`);
    });
  });

  describe("DELETE_PROFILE template", () => {
    it("should return HTML string with DELETE_PROFILE topic and code", () => {
      const code = "112233";
      const result = templates.DELETE_PROFILE(CodeType.DELETE_PROFILE, code);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result).toContain(CodeType.DELETE_PROFILE);
      expect(result).toContain(code);
    });

    it("should include code in strong tags", () => {
      const code = "445566";
      const result = templates.DELETE_PROFILE(CodeType.DELETE_PROFILE, code);

      expect(result).toContain(`<strong>${code}</strong>`);
    });
  });

  describe("CREATE_API_KEY template", () => {
    it("should return HTML string with CREATE_API_KEY topic and code", () => {
      const code = "778899";
      const result = templates.CREATE_API_KEY(CodeType.CREATE_API_KEY, code);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result).toContain(CodeType.CREATE_API_KEY);
      expect(result).toContain(code);
    });

    it("should include code in strong tags", () => {
      const code = "998877";
      const result = templates.CREATE_API_KEY(CodeType.CREATE_API_KEY, code);

      expect(result).toContain(`<strong>${code}</strong>`);
    });
  });

  describe("templates object", () => {
    it("should have all CodeType enum values as keys", () => {
      const codeTypes: CodeType[] = [
        CodeType.LOGIN,
        CodeType.LOGOUT_ALL,
        CodeType.PASSWORD_RESET,
        CodeType.DELETE_PROFILE,
        CodeType.CREATE_API_KEY,
      ];

      codeTypes.forEach((codeType) => {
        expect(templates[codeType]).toBeDefined();
        expect(typeof templates[codeType]).toBe("function");
      });
    });

    it("should return valid HTML for all template functions", () => {
      const code = "123456";
      const codeTypes: CodeType[] = [
        CodeType.LOGIN,
        CodeType.LOGOUT_ALL,
        CodeType.PASSWORD_RESET,
        CodeType.DELETE_PROFILE,
        CodeType.CREATE_API_KEY,
      ];

      codeTypes.forEach((codeType) => {
        const result = templates[codeType](codeType, code);

        expect(result).toBeDefined();
        expect(typeof result).toBe("string");
        expect(result).toContain("<p>");
        expect(result).toContain("</p>");
        expect(result).toContain("<strong>");
        expect(result).toContain("</strong>");
        expect(result).toContain(code);
      });
    });

    it("should render topic and code correctly", () => {
      const code = "999888";
      const result = templates.LOGIN(CodeType.LOGIN, code);

      expect(result).toMatch(new RegExp(`${CodeType.LOGIN}.*${code}`));
    });

    it("should handle special characters without escaping", () => {
      const code = "&<>\"'";
      const result = templates.LOGIN(CodeType.LOGIN, code);

      // Templates don't escape HTML - they render directly
      expect(result).toContain(code);
    });
  });
});
