import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Tag } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, TAG_ROUTES } from "@config/routes";
import { OK, UNAUTHORIZED } from "@config/errorCodes";
import { MOCK_USER_AGENT, mockTag, getAuthCookie, mockAuth } from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/tags", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(BASE_API_URL + TAG_ROUTES);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.tag.findMany.mockResolvedValue([mockTag as unknown as Tag]);

    const response = await request(app)
      .get(BASE_API_URL + TAG_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return tags in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.tag.findMany.mockResolvedValue([mockTag as unknown as Tag]);

    const response = await request(app)
      .get(BASE_API_URL + TAG_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      tags: JSON.parse(JSON.stringify([mockTag])),
    });
  });

  it("should return tags ordered by name descending", async () => {
    mockAuth(prismaMock);
    prismaMock.tag.findMany.mockResolvedValue([mockTag as unknown as Tag]);

    await request(app)
      .get(BASE_API_URL + TAG_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.tag.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { name: "desc" },
      }),
    );
  });

  it("should return only the name field for each tag", async () => {
    mockAuth(prismaMock);
    prismaMock.tag.findMany.mockResolvedValue([mockTag as unknown as Tag]);

    await request(app)
      .get(BASE_API_URL + TAG_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.tag.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: { name: true },
      }),
    );
  });
});
