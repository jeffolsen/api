import { rateLimit } from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

const defaults = {
  standardHeaders: "draft-7" as const,
  legacyHeaders: false,
  skip: () => isTest,
};

// Safety ceiling for all routes
export const globalLimiter = rateLimit({
  ...defaults,
  windowMs: 60 * 1000,
  limit: 120,
});

// Strict limit for unauthenticated sensitive endpoints (login, verification codes)
export const authLimiter = rateLimit({
  ...defaults,
  windowMs: 60 * 1000,
  limit: 15,
});

// Limit write operations on resource routes to prevent rapid-fire updates
export const mutationLimiter = rateLimit({
  ...defaults,
  windowMs: 60 * 1000,
  limit: 40,
  skip: (req) => req.method === "GET",
});
