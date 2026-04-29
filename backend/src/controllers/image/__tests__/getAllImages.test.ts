import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Image } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma, { ImageType } from "@db/client";
import { BASE_API_URL, IMAGE_ROUTES } from "@config/routes";
import { OK, UNAUTHORIZED } from "@config/errorCodes";
import { MOCK_USER_AGENT, mockImage, getAuthCookie, mockAuth } from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/images", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(BASE_API_URL + IMAGE_ROUTES);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[mockImage], 1] as unknown as [
      Image[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + IMAGE_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return images in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[mockImage], 1] as unknown as [
      Image[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + IMAGE_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      images: JSON.parse(JSON.stringify([mockImage])),
      totalCount: 1,
    });
  });

  it("should filter images by type", async () => {
    const iconImage = {
      ...mockImage,
      id: 2,
      type: ImageType.ICON,
    };

    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[iconImage], 1] as unknown as [
      Image[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + IMAGE_ROUTES)
      .query({ type: "ICON" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.image.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          type: "ICON",
        }),
      }),
    );

    expect(response.body).toEqual({
      images: JSON.parse(JSON.stringify([iconImage])),
      totalCount: 1,
    });
  });

  it("should support pagination via page and pageSize", async () => {
    const imageTwo = {
      ...mockImage,
      id: 2,
    };
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[imageTwo], 1] as unknown as [
      Image[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + IMAGE_ROUTES)
      .query({ page: 2, pageSize: 1 })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.image.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 1,
        take: 1,
      }),
    );

    expect(response.body).toEqual({
      images: JSON.parse(JSON.stringify([imageTwo])),
      totalCount: 1,
    });
  });
});
