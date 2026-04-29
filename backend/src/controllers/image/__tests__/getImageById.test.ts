import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Image } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, IMAGE_ROUTES } from "@config/routes";
import { NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import { MOCK_USER_AGENT, mockImage, getAuthCookie, mockAuth } from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/images/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(
      `${BASE_API_URL}${IMAGE_ROUTES}/${mockImage.id}`,
    );
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.image.findUnique.mockResolvedValue(
      mockImage as unknown as Image,
    );

    const response = await request(app)
      .get(`${BASE_API_URL}${IMAGE_ROUTES}/${mockImage.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return the image in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.image.findUnique.mockResolvedValue(
      mockImage as unknown as Image,
    );

    const response = await request(app)
      .get(`${BASE_API_URL}${IMAGE_ROUTES}/${mockImage.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      image: JSON.parse(JSON.stringify(mockImage)),
    });
  });

  it("should return 404 when the image does not exist", async () => {
    mockAuth(prismaMock);
    prismaMock.image.findUnique.mockResolvedValue(null as unknown as Image);

    const response = await request(app)
      .get(`${BASE_API_URL}${IMAGE_ROUTES}/${mockImage.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });
});
