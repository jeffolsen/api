import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Profile } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  AUTH_ROUTES,
  AUTH_REGISTER_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_EMAIL,
  MOCK_PASSWORD,
  mockProfileWithReceipt,
  mockProfile,
} from "./helpers";
import { BAD_REQUEST, CONFLICT, CREATED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + AUTH_ROUTES + AUTH_REGISTER_ENDPOINT;

const VALID_BODY = {
  email: MOCK_EMAIL,
  password: MOCK_PASSWORD,
  confirmPassword: MOCK_PASSWORD,
  consentToTerms: true,
  consentToPrivacy: true,
  assertEighteenYearsOrOlder: true,
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/auth/register", () => {
  it("should return 201 on successful registration", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfileWithReceipt),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(CREATED);
  });

  it("should return 409 when email is already registered", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfile),
          create: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfileWithReceipt),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(CONFLICT);
  });

  it("should return 400 when consentToTerms is not true", async () => {
    const invalidBody = {
      ...VALID_BODY,
      consentToTerms: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfileWithReceipt),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(invalidBody);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when consentToPrivacy is not true", async () => {
    const invalidBody = {
      ...VALID_BODY,
      consentToPrivacy: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfileWithReceipt),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(invalidBody);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when assertEighteenYearsOrOlder is not true", async () => {
    const invalidBody = {
      ...VALID_BODY,
      assertEighteenYearsOrOlder: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfileWithReceipt),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(invalidBody);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when password and confirmPassword do not match", async () => {
    const invalidBody = {
      ...VALID_BODY,
      confirmPassword: "doesntMatch@1234",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfileWithReceipt),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(invalidBody);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when email is invalid", async () => {
    const invalidBody = {
      ...VALID_BODY,
      email: "notanemail",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfileWithReceipt),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(invalidBody);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when password does not meet requirements", async () => {
    const invalidBody = {
      ...VALID_BODY,
      password: "bad password",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(mockProfileWithReceipt),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(invalidBody);

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should create the profile with a hashed password", async () => {
    const txProfileCreate = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: txProfileCreate,
        },
      }),
    );

    await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(txProfileCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: expect.stringMatching(/^\$2b\$/),
        }),
      }),
    );
  });

  it("should create the profileReceipt with consent timestamps", async () => {
    const txProfileCreate = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prismaMock.$transaction.mockImplementationOnce((callback: any) =>
      callback({
        profile: {
          findUnique: jest
            .fn<(args: unknown) => Promise<Profile | null>>()
            .mockResolvedValue(null),
          create: txProfileCreate,
        },
      }),
    );

    await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(txProfileCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          profileReceipt: {
            create: {
              consentToTermsAt: expect.any(Date),
              consentToPrivacyAt: expect.any(Date),
              verifiedAgeAt: expect.any(Date),
            },
          },
        }),
      }),
    );
  });
});
