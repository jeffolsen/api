import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  VERIFICATION_CODE_ROUTES,
  COLLECTION_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  getAuthCookie,
  mockAuth,
  mockVerificationCode,
} from "./helpers";
import { OK, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + VERIFICATION_CODE_ROUTES + COLLECTION_ENDPOINT;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/codes/", () => {
  it("should return 401 when not authenticated", async () => {
    prismaMock.verificationCode.findMany.mockResolvedValue([]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 when authenticated", async () => {
    mockAuth(prismaMock);
    prismaMock.verificationCode.findMany.mockResolvedValue([]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return the list of verification codes for the profile", async () => {
    mockAuth(prismaMock);
    prismaMock.verificationCode.findMany.mockResolvedValue([
      mockVerificationCode,
    ]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      codes: JSON.parse(JSON.stringify([mockVerificationCode])),
    });
  });

  it("should not include the value field in any returned code", async () => {
    mockAuth(prismaMock);
    const txFindCodes = prismaMock.verificationCode.findMany.mockResolvedValue(
      [],
    );

    await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(txFindCodes).toHaveBeenCalledWith(
      expect.objectContaining({
        omit: expect.objectContaining({ value: true }),
      }),
    );
  });

  it("should return codes ordered by createdAt descending", async () => {
    mockAuth(prismaMock);
    const txFindCodes = prismaMock.verificationCode.findMany.mockResolvedValue(
      [],
    );

    await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(txFindCodes).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.objectContaining({ createdAt: "desc" }),
      }),
    );
  });

  it("should return an empty array when the profile has no codes", async () => {
    mockAuth(prismaMock);
    prismaMock.verificationCode.findMany.mockResolvedValue([]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      codes: JSON.parse(JSON.stringify([])),
    });
  });
});
