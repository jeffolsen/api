import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, VerificationCode } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, PROFILE_ROUTES, SELF_ENDPOINT } from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PROFILE_ID,
  getAuthCookie,
  mockAuth,
  mockProfile,
  MOCK_VERIFICATION_CODE,
  mockVerificationCode,
} from "./helpers";
import {
  NO_CONTENT,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
} from "@/config/errorCodes";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: jest.fn(),
  hashValue: jest.fn((val: string) => Promise.resolve(val)),
}));

import { compareValue } from "@util/bcrypt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + PROFILE_ROUTES + SELF_ENDPOINT;

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

const mockDeleteTransaction = () => {
  const receiptUpdateMany = jest
    .fn<(args: unknown) => Promise<{ count: number }>>()
    .mockResolvedValue({ count: 1 });
  const profileDelete = jest
    .fn<(args: unknown) => Promise<typeof mockProfile>>()
    .mockResolvedValue(mockProfile);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementationOnce((callback: any) =>
    callback({
      profileReceipt: { updateMany: receiptUpdateMany },
      profile: { delete: profileDelete },
    }),
  );

  return { receiptUpdateMany, profileDelete };
};

describe("DELETE /api/profiles/me", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .delete(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 204 on success", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction();
    mockDeleteTransaction();

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE);

    expect(response.statusCode).toBe(NO_CONTENT);
  });

  it("should clear auth cookies on success", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction();
    mockDeleteTransaction();

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE);

    const cookies = response.headers["set-cookie"] as unknown as string[];
    expect(cookies.some((c: string) => c.startsWith("accessToken=;"))).toBe(
      true,
    );
    expect(cookies.some((c: string) => c.startsWith("refreshToken=;"))).toBe(
      true,
    );
  });

  it("should return 404 when the profile is not found", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code is invalid", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction(false);

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 400 when the verification code is missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should stamp deletedAt on the profileReceipt", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction();
    const { receiptUpdateMany } = mockDeleteTransaction();

    await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE);

    expect(receiptUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      }),
    );
  });

  it("should delete the profile", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(mockProfile);
    mockVerificationTransaction();
    const { profileDelete } = mockDeleteTransaction();

    await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE);

    expect(profileDelete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: MOCK_PROFILE_ID } }),
    );
  });
});
