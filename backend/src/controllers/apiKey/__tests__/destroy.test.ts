import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type {
  PrismaClient,
  ApiKey,
  VerificationCode,
} from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  API_KEY_ROUTES,
  API_KEY_DESTROY_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PROFILE_ID,
  getAuthCookie,
  mockAuth,
  mockProfileWithReceipt,
  MOCK_VERIFICATION_CODE,
  mockVerificationCode,
} from "./helpers";
import { OK, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: jest.fn(),
  hashValue: jest.fn((val: string) => Promise.resolve(val)),
}));

import { compareValue } from "@util/bcrypt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + API_KEY_ROUTES + API_KEY_DESTROY_ENDPOINT;

const MOCK_SLUG = "my-api-key";

const VALID_BODY = {
  apiSlug: MOCK_SLUG,
};

const mockApiKey: ApiKey = {
  id: 1,
  slug: MOCK_SLUG,
  value: "$2b$10$hashedvalue",
  origin: "https://example.com",
  profileId: MOCK_PROFILE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProfileForApiKey = {
  ...mockProfileWithReceipt,
  profileReceipt: {
    ...mockProfileWithReceipt.profileReceipt,
    verifiedEmailAt: new Date(),
  },
  apiKeys: [mockApiKey],
};

const mockDestroyTransaction = ({ codeFound = true } = {}) => {
  const apiKeyDelete = jest
    .fn<(args: unknown) => Promise<ApiKey>>()
    .mockResolvedValue(mockApiKey);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementationOnce((callback: any) =>
    callback({
      apiKey: { delete: apiKeyDelete },
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

  return { apiKeyDelete };
};

beforeEach(() => {
  mockReset(prismaMock);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (compareValue as any).mockResolvedValue(true);
});

describe("POST /api/keys/destroy", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when apiSlug is missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when the verification code is missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 404 when profile is not found", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when profile has not confirmed email", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileWithReceipt,
      apiKeys: [mockApiKey],
    } as never);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the slug does not match any API key", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileForApiKey,
      apiKeys: [],
    } as never);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the verification code is invalid", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileForApiKey as never,
    );
    mockDestroyTransaction({ codeFound: false });

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 200 on success", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileForApiKey as never,
    );
    mockDestroyTransaction();

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(OK);
  });

  it("should delete the API key", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileForApiKey as never,
    );
    const { apiKeyDelete } = mockDestroyTransaction();

    await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(apiKeyDelete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: mockApiKey.id } }),
    );
  });
});
