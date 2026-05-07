import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Session } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  SESSION_ROUTES,
  SESSION_LOGOUT_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  getAuthCookie,
  mockAuth,
  mockSession,
} from "./helpers";
import { OK, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + SESSION_ROUTES + SESSION_LOGOUT_ENDPOINT;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/sessions/logout", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 on success", async () => {
    mockAuth(prismaMock);

    prismaMock.session.update.mockResolvedValue({
      ...mockSession,
      endedAt: new Date(),
    } as Session);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should clear auth cookies on success", async () => {
    mockAuth(prismaMock);

    prismaMock.session.update.mockResolvedValue({
      ...mockSession,
      endedAt: new Date(),
    } as Session);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    const cookies = response.headers["set-cookie"] as unknown as string[];
    expect(cookies.some((c: string) => c.startsWith("accessToken=;"))).toBe(
      true,
    );
    expect(cookies.some((c: string) => c.startsWith("refreshToken=;"))).toBe(
      true,
    );
  });

  it("should mark the current session as ended", async () => {
    mockAuth(prismaMock);

    const sessionUpdate = prismaMock.session.update.mockResolvedValue({
      ...mockSession,
      endedAt: new Date(),
    } as Session);

    await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(sessionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          endedAt: expect.any(Date),
        }),
      }),
    );
  });
});
