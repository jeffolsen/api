import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Session } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  SESSION_ROUTES,
  COLLECTION_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  getAuthCookie,
  mockAuth,
  mockSession,
} from "./helpers";
import { OK, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + SESSION_ROUTES + COLLECTION_ENDPOINT;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/sessions/", () => {
  it("should return 401 when not authenticated", async () => {
    prismaMock.session.findMany.mockResolvedValue([]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 when authenticated", async () => {
    mockAuth(prismaMock);
    prismaMock.session.findMany.mockResolvedValue([]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return the list of active sessions for the profile", async () => {
    mockAuth(prismaMock);
    prismaMock.session.findMany.mockResolvedValue([
      mockSession,
    ] as unknown as Session[]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      sessions: JSON.parse(JSON.stringify([mockSession])),
    });
  });

  it("should not include expired sessions", async () => {
    mockAuth(prismaMock);
    prismaMock.session.findMany.mockResolvedValue([
      mockSession,
    ] as unknown as Session[]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      sessions: JSON.parse(JSON.stringify([mockSession])),
    });
  });

  it("should not include ended sessions", async () => {
    mockAuth(prismaMock);
    const txGetSessions = prismaMock.session.findMany.mockResolvedValue([
      mockSession,
    ] as unknown as Session[]);

    await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(txGetSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          endedAt: null,
        }),
      }),
    );
  });

  it("should not include the scope field in any returned session", async () => {
    mockAuth(prismaMock);
    const txGetSessions = prismaMock.session.findMany.mockResolvedValue([
      mockSession,
    ] as unknown as Session[]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(txGetSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        omit: expect.objectContaining({
          scope: true,
        }),
      }),
    );
  });

  it("should return sessions ordered by createdAt descending", async () => {
    mockAuth(prismaMock);
    const txGetSessions = prismaMock.session.findMany.mockResolvedValue([
      mockSession,
    ] as unknown as Session[]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(txGetSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: expect.objectContaining({
          createdAt: "desc",
        }),
      }),
    );
  });

  it("should return an empty array when the profile has no active sessions", async () => {
    mockAuth(prismaMock);
    prismaMock.session.findMany.mockResolvedValue([] as unknown as Session[]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      sessions: JSON.parse(JSON.stringify([])),
    });
  });
});
