import { describe, expect, test } from "@jest/globals";
import generateCode from "../generateCode";

describe("generateCode", () => {
  it("should return a random 6 character numeric string", async () => {
    const code = generateCode();
    const code2 = generateCode();
    const sixDigitIntegerNumeric = /^\d{6}/;

    expect(code).toBeDefined();
    expect(typeof code).toBe("string");
    expect(code).not.toBe(code2);
    expect(sixDigitIntegerNumeric.test(code)).toBe(true);
  });
});
