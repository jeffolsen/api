import { describe, expect } from "@jest/globals";
import { hashValue, compareValue } from "../bcrypt";

describe("hashValue", () => {
  it("should return a different string than its input string", async () => {
    const password = "password123";
    const hashedPassword = await hashValue(password);

    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe("string");
    expect(hashedPassword).not.toBe(password);
  });
});

describe("compareValue", () => {
  it("should return true when comparing original string with hashed string", async () => {
    const password = "password123";
    const hashedPassword = await hashValue(password);

    expect(await compareValue(password, hashedPassword)).toBe(true);
  });
  it("should return false when comparing incorrect string with hashed string", async () => {
    const password = "password123";
    const incorrect = "incorrect";
    const hashedPassword = await hashValue(password);

    expect(await compareValue(incorrect, hashedPassword)).toBe(false);
  });
});
