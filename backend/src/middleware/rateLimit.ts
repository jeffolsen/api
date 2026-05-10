import { rateLimit } from "express-rate-limit";

const defaults = {
  standardHeaders: "draft-7" as const,
  legacyHeaders: false,
};

// Safety ceiling for all routes
export const globalLimiter = rateLimit({
  ...defaults,
  windowMs: 60 * 1000,
  limit: 100,
});

// Strict limit for unauthenticated sensitive endpoints (login, verification codes)
export const authLimiter = rateLimit({
  ...defaults,
  windowMs: 60 * 1000,
  limit: 10,
});

// Limit write operations on resource routes to prevent rapid-fire updates
export const mutationLimiter = rateLimit({
  ...defaults,
  windowMs: 60 * 1000,
  limit: 30,
  skip: (req) => req.method === "GET",
});
