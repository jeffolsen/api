import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type {
  Prisma,
  PrismaClient,
  Profile,
  VerificationCode,
} from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  PROFILE_ROUTES,
  PROFILE_PASSWORD_RESET_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_EMAIL,
  MOCK_PASSWORD,
  mockProfile,
  MOCK_VERIFICATION_CODE,
  mockVerificationCode,
} from "./helpers";
import { OK, NOT_FOUND, BAD_REQUEST } from "@/config/errorCodes";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: jest.fn(),
  hashValue: jest.fn((val: string) => Promise.resolve(val)),
}));

import { compareValue } from "@util/bcrypt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT =
  BASE_API_URL + PROFILE_ROUTES + PROFILE_PASSWORD_RESET_ENDPOINT;

const VALID_BODY = {
  email: MOCK_EMAIL,
  password: MOCK_PASSWORD,
  confirmPassword: MOCK_PASSWORD,
};

beforeEach(() => {
  mockReset(prismaMock);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (compareValue as any).mockResolvedValue(true);
});

describe("POST /api/profiles/password-reset", () => {
  it("should return 200 on success", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfile),
          update: jest
            .fn<(args: unknown) => Promise<Profile>>()
            .mockResolvedValue(mockProfile),
        },
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(mockVerificationCode),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockVerificationCode, usedAt: new Date() }),
        },
        session: {
          deleteMany: jest
            .fn<(args: unknown) => Promise<Prisma.BatchPayload>>()
            .mockResolvedValue({ count: 1 } as unknown as Prisma.BatchPayload),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when no profile matches the provided email", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          update: jest
            .fn<(args: unknown) => Promise<Profile>>()
            .mockResolvedValue(mockProfile),
        },
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(mockVerificationCode),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockVerificationCode, usedAt: new Date() }),
        },
        session: {
          deleteMany: jest
            .fn<(args: unknown) => Promise<Prisma.BatchPayload>>()
            .mockResolvedValue({ count: 1 } as unknown as Prisma.BatchPayload),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code is invalid", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfile),
          update: jest
            .fn<(args: unknown) => Promise<Profile>>()
            .mockResolvedValue(mockProfile),
        },
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(null),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockVerificationCode, usedAt: new Date() }),
        },
        session: {
          deleteMany: jest
            .fn<(args: unknown) => Promise<Prisma.BatchPayload>>()
            .mockResolvedValue({ count: 1 } as unknown as Prisma.BatchPayload),
        },
      }),
    );

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
      .send({ password: MOCK_PASSWORD, confirmPassword: MOCK_PASSWORD });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when the verification code is missing", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when passwords do not match", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ ...VALID_BODY, confirmPassword: "doesntMatch@1234" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when the new password does not meet requirements", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ ...VALID_BODY, password: "weak", confirmPassword: "weak" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should delete all sessions after a successful password reset", async () => {
    const txDeletemanySessions = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfile),
          update: jest
            .fn<(args: unknown) => Promise<Profile>>()
            .mockResolvedValue(mockProfile),
        },
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(mockVerificationCode),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockVerificationCode, usedAt: new Date() }),
        },
        session: {
          deleteMany: txDeletemanySessions,
        },
      }),
    );

    await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(txDeletemanySessions).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ profileId: mockProfile.id }),
      }),
    );
  });
});
