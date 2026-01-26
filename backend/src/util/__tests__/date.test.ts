import {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import date, {
  getNewVerificationCodeExpirationDate,
  getVerificationCodeExpirationWindow,
  getNewAccessTokenExpirationDate,
  getNewRefreshTokenExpirationDate,
  beforeNow,
  afterNow,
  oneDayAgo,
} from "../date";

// Constants from config/constants.ts
const VERIFICATION_CODE_LIFESPAN = 8 * 60 * 60 * 1000; // 8 hours
const ACCESS_TOKEN_LIFESPAN = 15 * 60 * 1000; // 15 minutes
const SESSION_TOKEN_LIFESPAN = 4 * 24 * 60 * 60 * 1000; // 4 days
const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours

describe("date utilities", () => {
  const FIXED_DATE = new Date("2024-01-15T12:00:00.000Z");
  const FIXED_TIMESTAMP = FIXED_DATE.getTime();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getNewVerificationCodeExpirationDate", () => {
    it("should return date 8 hours in the future", () => {
      const result = getNewVerificationCodeExpirationDate();
      const expected = new Date(FIXED_TIMESTAMP + VERIFICATION_CODE_LIFESPAN);

      expect(result.getTime()).toBe(expected.getTime());
    });

    it("should use VERIFICATION_CODE_LIFESPAN constant", () => {
      const result = getNewVerificationCodeExpirationDate();
      const diff = result.getTime() - FIXED_TIMESTAMP;

      expect(diff).toBe(VERIFICATION_CODE_LIFESPAN);
      expect(diff).toBe(8 * 60 * 60 * 1000);
    });

    it("should return new Date object each call", () => {
      const result1 = getNewVerificationCodeExpirationDate();
      const result2 = getNewVerificationCodeExpirationDate();

      expect(result1).not.toBe(result2); // Different objects
      expect(result1.getTime()).toBe(result2.getTime()); // Same timestamp
    });
  });

  describe("getVerificationCodeExpirationWindow", () => {
    it("should return date 8 hours in the past", () => {
      const result = getVerificationCodeExpirationWindow();
      const expected = new Date(FIXED_TIMESTAMP - VERIFICATION_CODE_LIFESPAN);

      expect(result.getTime()).toBe(expected.getTime());
    });

    it("should be exactly opposite of getNewVerificationCodeExpirationDate", () => {
      const futureDate = getNewVerificationCodeExpirationDate();
      const pastDate = getVerificationCodeExpirationWindow();

      const futureOffset = futureDate.getTime() - FIXED_TIMESTAMP;
      const pastOffset = FIXED_TIMESTAMP - pastDate.getTime();

      expect(futureOffset).toBe(pastOffset);
      expect(futureOffset).toBe(VERIFICATION_CODE_LIFESPAN);
    });
  });

  describe("getNewAccessTokenExpirationDate", () => {
    it("should return date 15 minutes in the future", () => {
      const result = getNewAccessTokenExpirationDate();
      const expected = new Date(FIXED_TIMESTAMP + ACCESS_TOKEN_LIFESPAN);

      expect(result.getTime()).toBe(expected.getTime());
    });

    it("should use ACCESS_TOKEN_LIFESPAN constant", () => {
      const result = getNewAccessTokenExpirationDate();
      const diff = result.getTime() - FIXED_TIMESTAMP;

      expect(diff).toBe(ACCESS_TOKEN_LIFESPAN);
      expect(diff).toBe(15 * 60 * 1000);
    });

    it("should return new Date object each call", () => {
      const result1 = getNewAccessTokenExpirationDate();
      const result2 = getNewAccessTokenExpirationDate();

      expect(result1).not.toBe(result2);
      expect(result1.getTime()).toBe(result2.getTime());
    });
  });

  describe("getNewRefreshTokenExpirationDate", () => {
    it("should return date 4 days in the future", () => {
      const result = getNewRefreshTokenExpirationDate();
      const expected = new Date(FIXED_TIMESTAMP + SESSION_TOKEN_LIFESPAN);

      expect(result.getTime()).toBe(expected.getTime());
    });

    it("should use SESSION_TOKEN_LIFESPAN constant", () => {
      const result = getNewRefreshTokenExpirationDate();
      const diff = result.getTime() - FIXED_TIMESTAMP;

      expect(diff).toBe(SESSION_TOKEN_LIFESPAN);
      expect(diff).toBe(4 * 24 * 60 * 60 * 1000);
    });

    it("should return new Date object each call", () => {
      const result1 = getNewRefreshTokenExpirationDate();
      const result2 = getNewRefreshTokenExpirationDate();

      expect(result1).not.toBe(result2);
      expect(result1.getTime()).toBe(result2.getTime());
    });
  });

  describe("beforeNow", () => {
    it("should return true for past dates", () => {
      const pastDate = new Date(FIXED_TIMESTAMP - 1000);
      const result = beforeNow(pastDate);

      expect(result).toBe(true);
    });

    it("should return true for current time", () => {
      const currentDate = new Date(FIXED_TIMESTAMP);
      const result = beforeNow(currentDate);

      expect(result).toBe(true);
    });

    it("should return false for future dates", () => {
      const futureDate = new Date(FIXED_TIMESTAMP + 1000);
      const result = beforeNow(futureDate);

      expect(result).toBe(false);
    });

    it("should handle Date objects", () => {
      const dateObject = new Date(FIXED_TIMESTAMP - 5000);
      const result = beforeNow(dateObject);

      expect(result).toBe(true);
    });

    it("should handle very old dates", () => {
      const oldDate = new Date("1970-01-01T00:00:00.000Z");
      const result = beforeNow(oldDate);

      expect(result).toBe(true);
    });

    it("should handle far future dates", () => {
      const futureDate = new Date("2099-12-31T23:59:59.999Z");
      const result = beforeNow(futureDate);

      expect(result).toBe(false);
    });
  });

  describe("afterNow", () => {
    it("should return false for past dates", () => {
      const pastDate = new Date(FIXED_TIMESTAMP - 1000);
      const result = afterNow(pastDate);

      expect(result).toBe(false);
    });

    it("should return false for current time", () => {
      const currentDate = new Date(FIXED_TIMESTAMP);
      const result = afterNow(currentDate);

      expect(result).toBe(false);
    });

    it("should return true for future dates", () => {
      const futureDate = new Date(FIXED_TIMESTAMP + 1000);
      const result = afterNow(futureDate);

      expect(result).toBe(true);
    });

    it("should be inverse of beforeNow", () => {
      const testDates = [
        new Date(FIXED_TIMESTAMP - 1000),
        new Date(FIXED_TIMESTAMP),
        new Date(FIXED_TIMESTAMP + 1000),
      ];

      testDates.forEach((testDate) => {
        expect(afterNow(testDate)).toBe(!beforeNow(testDate));
      });
    });

    it("should handle very old dates", () => {
      const oldDate = new Date("1970-01-01T00:00:00.000Z");
      const result = afterNow(oldDate);

      expect(result).toBe(false);
    });

    it("should handle far future dates", () => {
      const futureDate = new Date("2099-12-31T23:59:59.999Z");
      const result = afterNow(futureDate);

      expect(result).toBe(true);
    });
  });

  describe("oneDayAgo", () => {
    it("should return date exactly 24 hours ago", () => {
      const result = oneDayAgo();
      const expected = new Date(FIXED_TIMESTAMP - ONE_DAY);

      expect(result.getTime()).toBe(expected.getTime());
    });

    it("should return new Date object each call", () => {
      const result1 = oneDayAgo();
      const result2 = oneDayAgo();

      expect(result1).not.toBe(result2);
      expect(result1.getTime()).toBe(result2.getTime());
    });

    it("should calculate 24 hours correctly", () => {
      const result = oneDayAgo();
      const diff = FIXED_TIMESTAMP - result.getTime();

      expect(diff).toBe(24 * 60 * 60 * 1000);
    });
  });

  describe("date (default export)", () => {
    it("should return object with isBeforeNow method", () => {
      const pastDate = new Date(FIXED_TIMESTAMP - 1000);
      const result = date(pastDate);

      expect(result).toHaveProperty("isBeforeNow");
      expect(typeof result.isBeforeNow).toBe("function");
    });

    it("should return object with isAfterNow method", () => {
      const futureDate = new Date(FIXED_TIMESTAMP + 1000);
      const result = date(futureDate);

      expect(result).toHaveProperty("isAfterNow");
      expect(typeof result.isAfterNow).toBe("function");
    });

    it("isBeforeNow should call beforeNow", () => {
      const pastDate = new Date(FIXED_TIMESTAMP - 1000);
      const result = date(pastDate);

      expect(result.isBeforeNow()).toBe(true);
      expect(result.isBeforeNow()).toBe(beforeNow(pastDate));
    });

    it("isAfterNow should call afterNow", () => {
      const futureDate = new Date(FIXED_TIMESTAMP + 1000);
      const result = date(futureDate);

      expect(result.isAfterNow()).toBe(true);
      expect(result.isAfterNow()).toBe(afterNow(futureDate));
    });

    it("should work with past dates", () => {
      const pastDate = new Date(FIXED_TIMESTAMP - 5000);
      const result = date(pastDate);

      expect(result.isBeforeNow()).toBe(true);
      expect(result.isAfterNow()).toBe(false);
    });

    it("should work with future dates", () => {
      const futureDate = new Date(FIXED_TIMESTAMP + 5000);
      const result = date(futureDate);

      expect(result.isBeforeNow()).toBe(false);
      expect(result.isAfterNow()).toBe(true);
    });

    it("should work with current time", () => {
      const currentDate = new Date(FIXED_TIMESTAMP);
      const result = date(currentDate);

      expect(result.isBeforeNow()).toBe(true);
      expect(result.isAfterNow()).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle dates at exact boundary", () => {
      const exactNow = new Date(FIXED_TIMESTAMP);

      expect(beforeNow(exactNow)).toBe(true); // <= comparison
      expect(afterNow(exactNow)).toBe(false); // inverse
    });

    it("should handle millisecond precision", () => {
      const justBefore = new Date(FIXED_TIMESTAMP - 1);
      const justAfter = new Date(FIXED_TIMESTAMP + 1);

      expect(beforeNow(justBefore)).toBe(true);
      expect(beforeNow(justAfter)).toBe(false);
      expect(afterNow(justBefore)).toBe(false);
      expect(afterNow(justAfter)).toBe(true);
    });
  });
});
