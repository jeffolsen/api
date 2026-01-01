import { describe, expect, test } from "@jest/globals";
import generateCode from "../generateCode";
import { NUMERIC_CODE_REGEX } from "../../config/constants";

describe("generateCode", () => {
  it("should return a random 6 character numeric string", async () => {
    const code = generateCode();
    const code2 = generateCode();

    expect(code).toBeDefined();
    expect(typeof code).toBe("string");
    expect(code).not.toBe(code2);
    expect(NUMERIC_CODE_REGEX.test(code)).toBe(true);
  });
});
