import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  SESSION_ROUTES,
  SESSION_LOGOUT_ALL_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PASSWORD,
  getAuthCookie,
  mockAuth,
  mockProfile,
} from "./helpers";
import { OK, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST } from "@/config/errorCodes";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: jest.fn(),
  hashValue: jest.fn(),
}));

import { compareValue } from "@util/bcrypt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + SESSION_ROUTES + SESSION_LOGOUT_ALL_ENDPOINT;

beforeEach(() => {
  mockReset(prismaMock);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (compareValue as any).mockResolvedValue(true);
});

describe("POST /api/sessions/logout-all", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 on success", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the password is incorrect", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (compareValue as any).mockResolvedValueOnce(false);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 400 when password is missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should clear auth cookies on success", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    const cookies = response.headers["set-cookie"] as unknown as string[];
    expect(cookies.some((c: string) => c.startsWith("accessToken=;"))).toBe(
      true,
    );
    expect(cookies.some((c: string) => c.startsWith("refreshToken=;"))).toBe(
      true,
    );
  });

  it("should end all sessions for the profile", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);

    await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(prismaMock.session.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          endedAt: expect.any(Date),
        }),
      }),
    );
  });
});
