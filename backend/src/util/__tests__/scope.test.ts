import { describe, expect, test } from "@jest/globals";
import { createScopeString, parseScopeString } from "../scope";

describe("createScopeString", () => {
  it("should create a space-delimited string from an array", () => {
    const scopeArray = ["scope1", "scope2", "another-scope", "scope:scope"];
    const scopeString = createScopeString(scopeArray);
    const delimiter = " ";

    expect(scopeString).toBeDefined();
    expect(typeof scopeString).toBe("string");
    expect(scopeString.split(delimiter)).toBe(scopeArray);
  });
});

describe("parseScopeString", () => {
  it("should create an array from a space-delimited string", () => {
    const scopeString = "scope1 scope2 another-scope scope:scope";
    const scopeArray = parseScopeString(scopeString);
    const delimiter = " ";

    expect(scopeArray).toBeDefined();
    expect(Array.isArray(scopeArray)).toBe(true);
    expect(scopeArray.join(delimiter)).toBe(scopeString);
  });
});
