import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, DateRange, Item } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, DATE_RANGE_ROUTES, ITEM_ROUTES } from "@config/routes";
import { OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  MOCK_ITEM_ID,
  mockDateRange,
  getAuthCookie,
  mockAuth,
} from "./helpers";
import { mockItem } from "@/controllers/item/__tests__/helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_DATE_RANGES_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${DATE_RANGE_ROUTES}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/items/:itemId/date-ranges", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(ITEM_DATE_RANGES_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);

    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    prismaMock.dateRange.findMany.mockResolvedValue([
      mockDateRange as unknown as DateRange,
    ]);

    const response = await request(app)
      .get(ITEM_DATE_RANGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return date ranges in the response body", async () => {
    mockAuth(prismaMock);

    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    prismaMock.dateRange.findMany.mockResolvedValue([
      mockDateRange as unknown as DateRange,
    ]);

    const response = await request(app)
      .get(ITEM_DATE_RANGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      dateRanges: JSON.parse(JSON.stringify([mockDateRange])),
    });
  });

  it("should filter date ranges by itemId", async () => {
    mockAuth(prismaMock);

    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    prismaMock.dateRange.findMany.mockResolvedValue([
      mockDateRange as unknown as DateRange,
    ]);

    await request(app)
      .get(ITEM_DATE_RANGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.dateRange.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { itemId: MOCK_ITEM_ID },
      }),
    );
  });
});
