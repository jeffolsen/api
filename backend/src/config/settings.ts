import { SignOptions } from "jsonwebtoken";

export const ACCESS_TOKEN_OPTIONS = {
  expiresIn: "10m",
  audience: "profile",
} as SignOptions;

export const REFRESH_TOKEN_OPTIONS = {
  expiresIn: "1d",
  audience: "profile",
} as SignOptions;
