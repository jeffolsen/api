import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Profile } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  VERIFICATION_CODE_ROUTES,
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PASSWORD,
  getAuthCookie,
  mockAuth,
  mockProfileWithReceipt,
  mockVerificationCode,
} from "./helpers";
import {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
} from "@/config/errorCodes";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: jest.fn(),
  hashValue: jest.fn((val: string) => Promise.resolve(val)),
}));

import { compareValue } from "@util/bcrypt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT =
  BASE_API_URL +
  VERIFICATION_CODE_ROUTES +
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT;

beforeEach(() => {
  mockReset(prismaMock);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (compareValue as any).mockResolvedValue(true);
});

describe("POST /api/codes/unregister", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 on success", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithReceipt);
    prismaMock.verificationCode.findMany.mockResolvedValue([]);
    prismaMock.verificationCode.create.mockResolvedValue(mockVerificationCode);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the password is incorrect", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithReceipt);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (compareValue as any).mockResolvedValue(false);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not consented to terms", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileWithReceipt,
      profileReceipt: {
        ...mockProfileWithReceipt.profileReceipt,
        consentToTermsAt: null,
      },
    } as unknown as Profile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not consented to privacy policy", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileWithReceipt,
      profileReceipt: {
        ...mockProfileWithReceipt.profileReceipt,
        consentToPrivacyAt: null,
      },
    } as unknown as Profile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not verified age", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileWithReceipt,
      profileReceipt: {
        ...mockProfileWithReceipt.profileReceipt,
        verifiedAgeAt: null,
      },
    } as unknown as Profile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 429 when the daily email limit has been reached", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithReceipt);
    prismaMock.verificationCode.findMany.mockResolvedValue(
      Array(2800).fill(mockVerificationCode),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(TOO_MANY_REQUESTS);
  });

  it("should return 404 when password is missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({});

    expect(response.statusCode).toBe(NOT_FOUND);
  });
});
