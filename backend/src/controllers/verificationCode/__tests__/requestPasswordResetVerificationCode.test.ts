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
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_EMAIL,
  mockProfileWithReceipt,
  mockVerificationCode,
} from "./helpers";
import { OK, NOT_FOUND, TOO_MANY_REQUESTS } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT =
  BASE_API_URL +
  VERIFICATION_CODE_ROUTES +
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/codes/password-reset", () => {
  it("should return 200 on success", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithReceipt);
    prismaMock.verificationCode.findMany.mockResolvedValue([]);
    prismaMock.verificationCode.create.mockResolvedValue(mockVerificationCode);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when no profile matches the provided email", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not consented to terms", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileWithReceipt,
      profileReceipt: {
        ...mockProfileWithReceipt.profileReceipt,
        consentToTermsAt: null,
      },
    } as unknown as Profile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not consented to privacy policy", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileWithReceipt,
      profileReceipt: {
        ...mockProfileWithReceipt.profileReceipt,
        consentToPrivacyAt: null,
      },
    } as unknown as Profile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not verified age", async () => {
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileWithReceipt,
      profileReceipt: {
        ...mockProfileWithReceipt.profileReceipt,
        verifiedAgeAt: null,
      },
    } as unknown as Profile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 429 when the daily email limit has been reached", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithReceipt);
    prismaMock.verificationCode.findMany.mockResolvedValue(
      Array(2800).fill(mockVerificationCode),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(TOO_MANY_REQUESTS);
  });

  it("should return 429 when the per-profile code limit has been reached", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithReceipt);
    prismaMock.verificationCode.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(Array(30).fill(mockVerificationCode));

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(TOO_MANY_REQUESTS);
  });

  it("should return 404 when email is missing", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({});

    expect(response.statusCode).toBe(NOT_FOUND);
  });
});
