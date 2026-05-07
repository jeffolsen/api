import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Session } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  AUTH_ROUTES,
  AUTH_REFRESH_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  mockSession,
  mockSessionWithProfile,
  getRefreshCookie,
} from "./helpers";
import { OK, BAD_REQUEST, NOT_FOUND, FORBIDDEN } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + AUTH_ROUTES + AUTH_REFRESH_ENDPOINT;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/auth/refresh", () => {
  it("should return 200 on successful token refresh", async () => {
    prismaMock.session.findUnique.mockResolvedValue(
      mockSessionWithProfile as unknown as Session,
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("Cookie", getRefreshCookie())
      .send();

    expect(response.statusCode).toBe(OK);
  });

  it("should return a new access token cookie on success", async () => {
    prismaMock.session.findUnique.mockResolvedValue(
      mockSessionWithProfile as unknown as Session,
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("Cookie", getRefreshCookie())
      .send();

    const cookies = response.headers["set-cookie"] as unknown as string[];
    expect(cookies.some((c: string) => c.startsWith("accessToken="))).toBe(
      true,
    );
  });

  it("should return 404 when the refresh token cookie is missing", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send();

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 400 when the refresh token is malformed or invalid", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("Cookie", "refreshToken=not-a-valid-jwt")
      .send();

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 403 when the session has expired", async () => {
    prismaMock.session.findUnique.mockResolvedValue({
      ...mockSessionWithProfile,
      expiredAt: new Date(Date.now() - 1000),
    } as unknown as Session);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("Cookie", getRefreshCookie())
      .send();

    expect(response.statusCode).toBe(FORBIDDEN);
  });

  it("should return 403 when the session has been ended", async () => {
    prismaMock.session.findUnique.mockResolvedValue({
      ...mockSessionWithProfile,
      endedAt: new Date(),
    } as unknown as Session);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("Cookie", getRefreshCookie())
      .send();

    expect(response.statusCode).toBe(FORBIDDEN);
  });

  it("should return 400 when no profile is associated with the session", async () => {
    prismaMock.session.findUnique.mockResolvedValue({
      ...mockSession,
      profile: null,
    } as unknown as Session);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("Cookie", getRefreshCookie())
      .send();

    expect(response.statusCode).toBe(BAD_REQUEST);
  });
});
