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
  VERIFICATION_CODE_SESSION_RESET_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_EMAIL,
  MOCK_PASSWORD,
  mockProfileWithReceipt,
  mockVerificationCode,
} from "./helpers";
import { OK, NOT_FOUND, TOO_MANY_REQUESTS } from "@/config/errorCodes";

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
  VERIFICATION_CODE_SESSION_RESET_ENDPOINT;

beforeEach(() => {
  mockReset(prismaMock);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (compareValue as any).mockResolvedValue(true);
});

describe("POST /api/codes/sessions-reset", () => {
  it("should return 200 on success", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithReceipt);
    prismaMock.verificationCode.findMany.mockResolvedValue([]);
    prismaMock.verificationCode.create.mockResolvedValue(mockVerificationCode);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when no profile matches the provided email", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the password is incorrect", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfileWithReceipt);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (compareValue as any).mockResolvedValue(false);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

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
      .send({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

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
      .send({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

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
      .send({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

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
      .send({ email: MOCK_EMAIL, password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(TOO_MANY_REQUESTS);
  });

  it("should return 404 when email is missing", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ password: MOCK_PASSWORD });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when password is missing", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });
});
