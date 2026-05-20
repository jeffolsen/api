import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type {
  PrismaClient,
  Profile,
  Session,
  VerificationCode,
} from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, AUTH_ROUTES, AUTH_LOGIN_ENDPOINT } from "@config/routes";
import { NOT_FOUND, OK, TOO_MANY_REQUESTS } from "@/config/errorCodes";
import { CodeType } from "@/db/client";
import { MAX_PROFILE_SESSIONS } from "@config/constants";
import {
  MOCK_USER_AGENT,
  MOCK_EMAIL,
  MOCK_VERIFICATION_CODE,
  MOCK_PROFILE_ID,
  mockSession,
  mockProfileWithReceipt,
  mockProfileReceipt,
} from "./helpers";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: () => Promise.resolve(true),
  hashValue: (val: string) => Promise.resolve(val),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + AUTH_ROUTES + AUTH_LOGIN_ENDPOINT;

const VALID_BODY = {
  email: MOCK_EMAIL,
  verificationCode: MOCK_VERIFICATION_CODE,
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/auth/login", () => {
  it("should return 200 on successful login", async () => {
    const mockCode: VerificationCode = {
      id: 1,
      profileId: MOCK_PROFILE_ID,
      type: CodeType.LOGIN,
      value: "$2b$10$hashedcode",
      userAgent: MOCK_USER_AGENT,
      usedAt: null,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithReceipt as unknown as Profile,
    );
    prismaMock.session.findMany.mockResolvedValue([]);

    // processVerificationCode transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(mockCode),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockCode, usedAt: new Date() }),
        },
        profileReceipt: { update: jest.fn() },
        session: {
          create: jest
            .fn<(args: unknown) => Promise<Session>>()
            .mockResolvedValue(mockSession as unknown as Session),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(OK);
  });

  it("should set access token and refresh token cookies on success", async () => {
    const mockCode: VerificationCode = {
      id: 1,
      profileId: MOCK_PROFILE_ID,
      type: CodeType.LOGIN,
      value: "$2b$10$hashedcode",
      userAgent: MOCK_USER_AGENT,
      usedAt: null,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithReceipt as unknown as Profile,
    );
    prismaMock.session.findMany.mockResolvedValue([]);

    // processVerificationCode transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(mockCode),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockCode, usedAt: new Date() }),
        },
        profileReceipt: { update: jest.fn() },
        session: {
          create: jest
            .fn<(args: unknown) => Promise<Session>>()
            .mockResolvedValue(mockSession as unknown as Session),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    const cookies = response.headers["set-cookie"];

    expect(cookies).toBeDefined();
    expect(cookies.length).toBe(2);
    expect(cookies).toContainEqual(expect.stringMatching(/^accessToken=/));
    expect(cookies).toContainEqual(expect.stringMatching(/^refreshToken=/));
  });

  it("should return 404 when no profile matches the provided email", async () => {
    const WRONG_EMAIL = "wrong@email.com";

    prismaMock.profile.findUnique.mockResolvedValue(null as unknown as Profile);

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: WRONG_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not consented to terms", async () => {
    const mockProfileWithoutTerms = {
      ...mockProfileWithReceipt,
      profileReceipt: { ...mockProfileReceipt, consentToTermsAt: undefined },
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithoutTerms as unknown as Profile,
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not consented to privacy policy", async () => {
    const mockProfileWithoutPrivacy = {
      ...mockProfileWithReceipt,
      profileReceipt: { ...mockProfileReceipt, consentToPrivacyAt: undefined },
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithoutPrivacy as unknown as Profile,
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the profile has not verified age", async () => {
    const mockProfileWithoutAge = {
      ...mockProfileWithReceipt,
      profileReceipt: { ...mockProfileReceipt, verifiedAgeAt: undefined },
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithoutAge as unknown as Profile,
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code is invalid", async () => {
    const WRONG_CODE = "098765";
    const mockCode: VerificationCode = {
      id: 1,
      profileId: MOCK_PROFILE_ID,
      type: CodeType.LOGIN,
      value: "$2b$10$hashedcode",
      userAgent: MOCK_USER_AGENT,
      usedAt: null,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithReceipt as unknown as Profile,
    );
    prismaMock.session.findMany.mockResolvedValue([]);

    // processVerificationCode transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(null),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockCode, usedAt: new Date() }),
        },
        profileReceipt: { update: jest.fn() },
        session: {
          create: jest
            .fn<(args: unknown) => Promise<Session>>()
            .mockResolvedValue(mockSession as unknown as Session),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", WRONG_CODE)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code has expired", async () => {
    const mockCode: VerificationCode = {
      id: 1,
      profileId: MOCK_PROFILE_ID,
      type: CodeType.LOGIN,
      value: "$2b$10$hashedcode",
      userAgent: MOCK_USER_AGENT,
      usedAt: null,
      expiredAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithReceipt as unknown as Profile,
    );
    prismaMock.session.findMany.mockResolvedValue([]);

    // processVerificationCode transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(null),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockCode, usedAt: new Date() }),
        },
        profileReceipt: { update: jest.fn() },
        session: {
          create: jest
            .fn<(args: unknown) => Promise<Session>>()
            .mockResolvedValue(mockSession as unknown as Session),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code was issued for a different user agent", async () => {
    const WRONG_AGENT = "wrong-agent";
    const mockCode: VerificationCode = {
      id: 1,
      profileId: MOCK_PROFILE_ID,
      type: CodeType.LOGIN,
      value: "$2b$10$hashedcode",
      userAgent: MOCK_USER_AGENT,
      usedAt: null,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithReceipt as unknown as Profile,
    );
    prismaMock.session.findMany.mockResolvedValue([]);

    // processVerificationCode transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(null),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockCode, usedAt: new Date() }),
        },
        profileReceipt: { update: jest.fn() },
        session: {
          create: jest
            .fn<(args: unknown) => Promise<Session>>()
            .mockResolvedValue(mockSession as unknown as Session),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", WRONG_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 429 when the session limit has been reached", async () => {
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithReceipt as unknown as Profile,
    );
    prismaMock.session.findMany.mockResolvedValue(
      Array(MAX_PROFILE_SESSIONS).fill(mockSession as unknown as Session),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(response.statusCode).toBe(TOO_MANY_REQUESTS);
  });

  it("should set verifiedEmailAt on the profileReceipt on first login", async () => {
    const mockCode: VerificationCode = {
      id: 1,
      profileId: MOCK_PROFILE_ID,
      type: CodeType.LOGIN,
      value: "$2b$10$hashedcode",
      userAgent: MOCK_USER_AGENT,
      usedAt: null,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // mockProfileWithReceipt has verifiedEmailAt: null — simulates first login
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileWithReceipt as unknown as Profile,
    );
    prismaMock.session.findMany.mockResolvedValue([]);

    const txReceiptUpdate = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(mockCode),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockCode, usedAt: new Date() }),
        },
        profileReceipt: { update: txReceiptUpdate },
        session: {
          create: jest
            .fn<(args: unknown) => Promise<Session>>()
            .mockResolvedValue(mockSession as unknown as Session),
        },
      }),
    );

    await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(txReceiptUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ verifiedEmailAt: expect.any(Date) }),
      }),
    );
  });

  it("should not update verifiedEmailAt when it is already set", async () => {
    const mockCode: VerificationCode = {
      id: 1,
      profileId: MOCK_PROFILE_ID,
      type: CodeType.LOGIN,
      value: "$2b$10$hashedcode",
      userAgent: MOCK_USER_AGENT,
      usedAt: null,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockProfileAlreadyVerified = {
      ...mockProfileWithReceipt,
      profileReceipt: { ...mockProfileReceipt, verifiedEmailAt: new Date() },
    };

    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileAlreadyVerified as unknown as Profile,
    );
    prismaMock.session.findMany.mockResolvedValue([]);

    const txReceiptUpdate = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        verificationCode: {
          findFirst: jest
            .fn<(args: unknown) => Promise<VerificationCode | null>>()
            .mockResolvedValue(mockCode),
          update: jest
            .fn<(args: unknown) => Promise<VerificationCode>>()
            .mockResolvedValue({ ...mockCode, usedAt: new Date() }),
        },
        profileReceipt: { update: txReceiptUpdate },
        session: {
          create: jest
            .fn<(args: unknown) => Promise<Session>>()
            .mockResolvedValue(mockSession as unknown as Session),
        },
      }),
    );

    await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({ email: MOCK_EMAIL });

    expect(txReceiptUpdate).not.toHaveBeenCalled();
  });
});
