import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type {
  Prisma,
  PrismaClient,
  Profile,
  Session,
} from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  PROFILE_ROUTES,
  PROFILE_PASSWORD_CHANGE_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PASSWORD,
  MOCK_PROFILE_ID,
  MOCK_SESSION_ID,
  getAuthCookie,
  mockAuth,
  mockProfile,
} from "./helpers";
import { OK, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");
jest.mock("@util/bcrypt", () => ({
  compareValue: jest.fn(),
  hashValue: jest.fn((val: string) => Promise.resolve(val)),
}));

import { compareValue } from "@util/bcrypt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT =
  BASE_API_URL + PROFILE_ROUTES + PROFILE_PASSWORD_CHANGE_ENDPOINT;

const NEW_PASSWORD = "NewPassword1!";

const VALID_BODY = {
  password: MOCK_PASSWORD,
  newPassword: NEW_PASSWORD,
  confirmNewPassword: NEW_PASSWORD,
};

beforeEach(() => {
  mockReset(prismaMock);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (compareValue as any).mockResolvedValue(true);
});

describe("POST /api/profiles/password-change", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 on success", async () => {
    mockAuth(prismaMock);
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
        session: {
          deleteMany: jest
            .fn<(args: unknown) => Promise<Prisma.BatchPayload>>()
            .mockResolvedValue({ count: 1 } as unknown as Prisma.BatchPayload),
        },
      }),
    );

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the current password is incorrect", async () => {
    mockAuth(prismaMock);
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
        session: {
          deleteMany: jest
            .fn<(args: unknown) => Promise<Prisma.BatchPayload>>()
            .mockResolvedValue({ count: 1 } as unknown as Prisma.BatchPayload),
        },
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (compareValue as any).mockResolvedValueOnce(false);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 400 when password fields are missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when new passwords do not match", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ ...VALID_BODY, confirmNewPassword: "doesntMatch@1234" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when the new password does not meet requirements", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ ...VALID_BODY, newPassword: "weak", confirmNewPassword: "weak" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should delete all other sessions but keep the current one", async () => {
    mockAuth(prismaMock);

    const txDeleteManySession = jest.fn();
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
        session: {
          deleteMany: txDeleteManySession,
        },
      }),
    );

    await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(txDeleteManySession).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          profileId: MOCK_PROFILE_ID,
          id: { not: MOCK_SESSION_ID },
        }),
      }),
    );
  });
});
