import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES } from "@config/routes";
import { NO_CONTENT, NOT_FOUND, UNAUTHORIZED } from "@config/errorCodes";
import { MOCK_USER_AGENT, mockItem, getAuthCookie, mockAuth } from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("DELETE /api/items/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).delete(
      `${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`,
    );
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 204 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.item.delete.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .delete(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NO_CONTENT);
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(null as unknown as Item);

    const response = await request(app)
      .delete(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });
});
