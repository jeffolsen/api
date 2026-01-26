import jwt from "jsonwebtoken";

/**
 * Creates a valid access token for testing
 */
export const createValidAccessToken = (
  sessionId: number,
  secret: string,
  expiresAt?: Date,
) => {
  return jwt.sign(
    {
      sessionId,
      expiresAt: expiresAt || new Date(Date.now() + 15 * 60 * 1000),
    },
    secret,
    { expiresIn: "15m" },
  );
};

/**
 * Creates a valid refresh token for testing
 */
export const createValidRefreshToken = (
  sessionId: number,
  secret: string,
  origin?: string,
) => {
  const payload: { sessionId: number; origin?: string } = { sessionId };
  if (origin) {
    payload.origin = origin;
  }
  return jwt.sign(payload, secret, { expiresIn: "4d" });
};

/**
 * Creates an expired token for testing
 */
export const createExpiredToken = (sessionId: number, secret: string) => {
  return jwt.sign({ sessionId }, secret, { expiresIn: "-1h" });
};

/**
 * Creates an invalid token string for testing
 */
export const createInvalidToken = () => {
  return "invalid.jwt.token.string";
};

/**
 * Creates a malformed JWT string for testing
 */
export const createMalformedToken = () => {
  return "not-a-jwt-at-all";
};

/**
 * Creates a token with wrong signature for testing
 */
export const createTokenWithWrongSignature = (
  sessionId: number,
  correctSecret: string,
  wrongSecret: string,
) => {
  return jwt.sign({ sessionId }, wrongSecret, { expiresIn: "15m" });
};
