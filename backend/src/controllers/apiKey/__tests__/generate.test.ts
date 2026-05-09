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
  API_KEY_GENERATE_ENDPOINT,
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
import {
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
} from "@/config/errorCodes";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: jest.fn(),
  hashValue: jest.fn((val: string) => Promise.resolve(val)),
}));
import { compareValue } from "@util/bcrypt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + API_KEY_ROUTES + API_KEY_GENERATE_ENDPOINT;

const MOCK_SLUG = "my-api-key";
const MOCK_ORIGIN = "https://example.com";

const VALID_BODY = {
  apiSlug: MOCK_SLUG,
  origin: MOCK_ORIGIN,
};

const mockApiKey: ApiKey = {
  id: 1,
  slug: MOCK_SLUG,
  value: "$2b$10$hashedvalue",
  origin: MOCK_ORIGIN,
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
  apiKeys: [],
};

const mockGenerateTransaction = ({
  slugTaken = false,
  codeFound = true,
} = {}) => {
  const apiKeyCreate = jest
    .fn<(args: unknown) => Promise<ApiKey>>()
    .mockResolvedValue(mockApiKey);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementationOnce((callback: any) =>
    callback({
      apiKey: {
        findUnique: jest
          .fn<(args: unknown) => Promise<ApiKey | null>>()
          .mockResolvedValue(slugTaken ? mockApiKey : null),
        create: apiKeyCreate,
      },
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

  return { apiKeyCreate };
};

beforeEach(() => {
  mockReset(prismaMock);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (compareValue as any).mockResolvedValue(true);
});

describe("POST /api/keys/generate", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when required fields are missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when verification code is missing", async () => {
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

  it("should return 403 when the API key limit is reached", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue({
      ...mockProfileForApiKey,
      apiKeys: [mockApiKey, mockApiKey],
    } as never);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(FORBIDDEN);
  });

  it("should return 409 when the slug is already taken", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileForApiKey as never,
    );
    mockGenerateTransaction({ slugTaken: true });

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(CONFLICT);
  });

  it("should return 404 when the verification code is invalid", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileForApiKey as never,
    );
    mockGenerateTransaction({ codeFound: false });

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 201 on success", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileForApiKey as never,
    );
    mockGenerateTransaction();

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(CREATED);
  });

  it("should return the raw API key value on success", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileForApiKey as never,
    );
    mockGenerateTransaction();

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(response.body).toHaveProperty("apiKey");
    expect(typeof response.body.apiKey).toBe("string");
  });

  it("should create the API key in the database", async () => {
    mockAuth(prismaMock);
    prismaMock.profile.findUnique.mockResolvedValue(
      mockProfileForApiKey as never,
    );
    const { apiKeyCreate } = mockGenerateTransaction();

    await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .set("X-Verification-Code", MOCK_VERIFICATION_CODE)
      .send(VALID_BODY);

    expect(apiKeyCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: MOCK_SLUG,
          profileId: MOCK_PROFILE_ID,
        }),
      }),
    );
  });
});
