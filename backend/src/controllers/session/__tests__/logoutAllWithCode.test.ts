import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, VerificationCode } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  SESSION_ROUTES,
  SESSION_RESET_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_EMAIL,
  MOCK_VERIFICATION_CODE,
  mockProfile,
  mockVerificationCode,
} from "./helpers";
import { OK, NOT_FOUND, BAD_REQUEST } from "@/config/errorCodes";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: jest.fn(),
  hashValue: jest.fn(),
}));

import { compareValue } from "@util/bcrypt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + SESSION_ROUTES + SESSION_RESET_ENDPOINT;

const VALID_BODY = { email: MOCK_EMAIL };

beforeEach(() => {
  mockReset(prismaMock);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (compareValue as any).mockResolvedValue(true);
});

const mockVerificationTransaction = (codeFound = true) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementationOnce((callback: any) =>
    callback({
      verificationCode: {
        findFirst: jest
          .fn<(args: unknown) => Promise<VerificationCode | null>>()
          .mockResolvedValue(codeFound ? mockVerificationCode : null),
        update: jest
          .fn<(args: unknown) => Promise<VerificationCode>>()
          .mockResolvedValue({ ...mockVerificationCode, usedAt: new Date() }),
      },
    }),
  );
};

describe("POST /api/sessions/reset", () => {
  it("should return 200 on success", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction();
    prismaMock.session.updateMany.mockResolvedValue({ count: 1 });

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when no profile matches the provided email", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code is invalid", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (compareValue as any).mockResolvedValueOnce(false);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code has expired", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction(false);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code was issued for a different user agent", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction(false);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", "different-agent")
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has no active sessions", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction();
    prismaMock.session.updateMany.mockResolvedValue({ count: 0 });

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 400 when email is missing", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when verification code is missing", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should clear auth cookies on success", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction();
    prismaMock.session.updateMany.mockResolvedValue({ count: 1 });

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    const cookies = response.headers["set-cookie"] as unknown as string[];
    expect(cookies.some((c: string) => c.startsWith("accessToken=;"))).toBe(
      true,
    );
    expect(cookies.some((c: string) => c.startsWith("refreshToken=;"))).toBe(
      true,
    );
  });

  it("should end all sessions for the profile", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction();
    prismaMock.session.updateMany.mockResolvedValue({ count: 1 });

    await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(prismaMock.session.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          endedAt: expect.any(Date),
        }),
      }),
    );
  });
});
