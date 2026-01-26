import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals";
import jwt from "jsonwebtoken";

// Mock date module
jest.mock("../date", () => ({
  getNewAccessTokenExpirationDate: jest.fn(),
}));

// Import modules after mocks
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  TokenPayload,
} from "../jwt";
import {
  createExpiredToken,
  createInvalidToken,
  createMalformedToken,
  createTokenWithWrongSignature,
} from "./helpers/jwt-helpers";
import * as dateModule from "../date";
import env from "../../config/env";

const mockGetNewAccessTokenExpirationDate = dateModule.getNewAccessTokenExpirationDate as jest.MockedFunction<typeof dateModule.getNewAccessTokenExpirationDate>;

describe("JWT utilities", () => {
  const TEST_SESSION_ID = 12345;
  const FIXED_DATE = new Date("2024-01-15T12:00:00.000Z");
  const ACCESS_TOKEN_EXPIRY = new Date("2024-01-15T12:15:00.000Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_DATE);
    mockGetNewAccessTokenExpirationDate.mockReturnValue(ACCESS_TOKEN_EXPIRY);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("signAccessToken", () => {
    it("should return a JWT string", () => {
      const token = signAccessToken(TEST_SESSION_ID);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("should include sessionId in payload", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const decoded = jwt.decode(token) as TokenPayload;

      expect(decoded).toHaveProperty("sessionId");
      expect(decoded.sessionId).toBe(TEST_SESSION_ID);
    });

    it("should include expiresAt in payload", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const decoded = jwt.decode(token) as TokenPayload;

      expect(decoded).toHaveProperty("expiresAt");
    });

    it("should use JWT_SECRET for signing", () => {
      const token = signAccessToken(TEST_SESSION_ID);

      // Token should be verifiable with the secret
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      expect(decoded.sessionId).toBe(TEST_SESSION_ID);
    });

    it("should generate different tokens for different sessionIds", () => {
      const token1 = signAccessToken(1);
      const token2 = signAccessToken(2);

      expect(token1).not.toBe(token2);

      const decoded1 = jwt.decode(token1) as TokenPayload;
      const decoded2 = jwt.decode(token2) as TokenPayload;

      expect(decoded1.sessionId).toBe(1);
      expect(decoded2.sessionId).toBe(2);
    });

    it("should include iat (issued at) claim", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty("iat");
      expect(typeof decoded.iat).toBe("number");
    });

    it("should include exp (expiration) claim", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty("exp");
      expect(typeof decoded.exp).toBe("number");
    });
  });

  describe("signRefreshToken", () => {
    it("should return a JWT string", () => {
      const token = signRefreshToken(TEST_SESSION_ID);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should include sessionId in payload", () => {
      const token = signRefreshToken(TEST_SESSION_ID);
      const decoded = jwt.decode(token) as TokenPayload;

      expect(decoded).toHaveProperty("sessionId");
      expect(decoded.sessionId).toBe(TEST_SESSION_ID);
    });

    it("should include origin when provided", () => {
      const origin = "https://example.com";
      const token = signRefreshToken(TEST_SESSION_ID, origin);
      const decoded = jwt.decode(token) as TokenPayload;

      expect(decoded).toHaveProperty("origin");
      expect(decoded.origin).toBe(origin);
    });

    it("should not include origin when not provided", () => {
      const token = signRefreshToken(TEST_SESSION_ID);
      const decoded = jwt.decode(token) as TokenPayload;

      expect(decoded).not.toHaveProperty("origin");
    });

    it("should use JWT_REFRESH_SECRET for signing", () => {
      const token = signRefreshToken(TEST_SESSION_ID);

      // Token should be verifiable with the refresh secret
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
      expect(decoded.sessionId).toBe(TEST_SESSION_ID);
    });

    it("should generate different tokens for different sessionIds", () => {
      const token1 = signRefreshToken(1);
      const token2 = signRefreshToken(2);

      expect(token1).not.toBe(token2);
    });

    it("should handle special characters in origin", () => {
      const origin = "https://example.com:3000/path?query=value&foo=bar";
      const token = signRefreshToken(TEST_SESSION_ID, origin);
      const decoded = jwt.decode(token) as TokenPayload;

      expect(decoded.origin).toBe(origin);
    });
  });

  describe("verifyAccessToken", () => {
    it("should return payload for valid token", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const result = verifyAccessToken(token);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("sessionId", TEST_SESSION_ID);
    });

    it("should return null for invalid token", () => {
      const token = createInvalidToken();
      const result = verifyAccessToken(token);

      expect(result).toBeNull();
    });

    it("should return null for expired token", () => {
      const token = createExpiredToken(TEST_SESSION_ID, env.JWT_SECRET);
      const result = verifyAccessToken(token);

      expect(result).toBeNull();
    });

    it("should return null for token signed with wrong secret", () => {
      const token = createTokenWithWrongSignature(
        TEST_SESSION_ID,
        env.JWT_SECRET,
        "wrong-secret",
      );
      const result = verifyAccessToken(token);

      expect(result).toBeNull();
    });

    it("should return null for malformed token", () => {
      const token = createMalformedToken();
      const result = verifyAccessToken(token);

      expect(result).toBeNull();
    });

    it("should extract sessionId from payload", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const result = verifyAccessToken(token);

      expect(result?.sessionId).toBe(TEST_SESSION_ID);
    });

    it("should return null for empty string", () => {
      const result = verifyAccessToken("");

      expect(result).toBeNull();
    });

    it("should handle very large sessionId values", () => {
      const largeSessionId = 9007199254740991; // Max safe integer
      const token = signAccessToken(largeSessionId);
      const result = verifyAccessToken(token);

      expect(result?.sessionId).toBe(largeSessionId);
    });
  });

  describe("verifyRefreshToken", () => {
    it("should return payload for valid token", () => {
      const token = signRefreshToken(TEST_SESSION_ID);
      const result = verifyRefreshToken(token);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("sessionId", TEST_SESSION_ID);
    });

    it("should return null for invalid token", () => {
      const token = createInvalidToken();
      const result = verifyRefreshToken(token);

      expect(result).toBeNull();
    });

    it("should extract sessionId from payload", () => {
      const token = signRefreshToken(TEST_SESSION_ID);
      const result = verifyRefreshToken(token);

      expect(result?.sessionId).toBe(TEST_SESSION_ID);
    });

    it("should extract origin from payload when present", () => {
      const origin = "https://example.com";
      const token = signRefreshToken(TEST_SESSION_ID, origin);
      const result = verifyRefreshToken(token);

      expect(result).toHaveProperty("origin", origin);
    });

    it("should use JWT_REFRESH_SECRET for verification", () => {
      const token = signRefreshToken(TEST_SESSION_ID);
      const result = verifyRefreshToken(token);

      expect(result).not.toBeNull();
    });

    it("should return null for expired token", () => {
      const token = createExpiredToken(TEST_SESSION_ID, env.JWT_REFRESH_SECRET);
      const result = verifyRefreshToken(token);

      expect(result).toBeNull();
    });

    it("should return null for token signed with wrong secret", () => {
      const token = createTokenWithWrongSignature(
        TEST_SESSION_ID,
        env.JWT_REFRESH_SECRET,
        "wrong-secret",
      );
      const result = verifyRefreshToken(token);

      expect(result).toBeNull();
    });

    it("should return null for empty string", () => {
      const result = verifyRefreshToken("");

      expect(result).toBeNull();
    });
  });

  describe("sign/verify round trip", () => {
    it("should verify token that was just signed (access)", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const result = verifyAccessToken(token);

      expect(result).not.toBeNull();
      expect(result?.sessionId).toBe(TEST_SESSION_ID);
    });

    it("should verify token that was just signed (refresh)", () => {
      const token = signRefreshToken(TEST_SESSION_ID);
      const result = verifyRefreshToken(token);

      expect(result).not.toBeNull();
      expect(result?.sessionId).toBe(TEST_SESSION_ID);
    });

    it("should verify refresh token with origin", () => {
      const origin = "https://example.com";
      const token = signRefreshToken(TEST_SESSION_ID, origin);
      const result = verifyRefreshToken(token);

      expect(result).not.toBeNull();
      expect(result?.sessionId).toBe(TEST_SESSION_ID);
      expect(result?.origin).toBe(origin);
    });

    it("should fail cross-verification (access vs refresh secret)", () => {
      const accessToken = signAccessToken(TEST_SESSION_ID);
      const result = verifyRefreshToken(accessToken);

      expect(result).toBeNull();
    });

    it("should fail cross-verification (refresh vs access secret)", () => {
      const refreshToken = signRefreshToken(TEST_SESSION_ID);
      const result = verifyAccessToken(refreshToken);

      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle sessionId of 0", () => {
      const token = signAccessToken(0);
      const result = verifyAccessToken(token);

      expect(result?.sessionId).toBe(0);
    });

    it("should handle negative sessionId", () => {
      const token = signAccessToken(-1);
      const result = verifyAccessToken(token);

      expect(result?.sessionId).toBe(-1);
    });

    it("should handle empty origin string", () => {
      const token = signRefreshToken(TEST_SESSION_ID, "");
      const decoded = jwt.decode(token) as TokenPayload;

      // Empty string is falsy, so origin should not be included
      expect(decoded).not.toHaveProperty("origin");
    });

    it("should not throw on null token", () => {
      expect(() => {
        verifyAccessToken(null as any);
      }).not.toThrow();
    });

    it("should not throw on undefined token", () => {
      expect(() => {
        verifyAccessToken(undefined as any);
      }).not.toThrow();
    });

    it("should handle token with extra claims", () => {
      const token = jwt.sign(
        { sessionId: TEST_SESSION_ID, extraClaim: "extra" },
        env.JWT_SECRET,
        { expiresIn: "15m" },
      );
      const result = verifyAccessToken(token);

      expect(result).not.toBeNull();
      expect(result?.sessionId).toBe(TEST_SESSION_ID);
    });
  });

  describe("token structure", () => {
    it("should create tokens with header, payload, and signature", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const parts = token.split(".");

      expect(parts).toHaveLength(3);
      expect(parts[0]).toBeTruthy(); // header
      expect(parts[1]).toBeTruthy(); // payload
      expect(parts[2]).toBeTruthy(); // signature
    });

    it("should use standard JWT algorithm", () => {
      const token = signAccessToken(TEST_SESSION_ID);
      const decoded = jwt.decode(token, { complete: true }) as any;

      expect(decoded.header).toHaveProperty("alg");
      expect(decoded.header).toHaveProperty("typ", "JWT");
    });
  });
});
