import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, DateRange, Item } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, DATE_RANGE_ROUTES, ITEM_ROUTES } from "@config/routes";
import { NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
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
const ITEM_DATE_RANGE_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${DATE_RANGE_ROUTES}/${mockDateRange.id}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/items/:itemId/date-ranges/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(ITEM_DATE_RANGE_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    prismaMock.dateRange.findUnique.mockResolvedValue(
      mockDateRange as unknown as DateRange,
    );

    const response = await request(app)
      .get(ITEM_DATE_RANGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return the date range in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    prismaMock.dateRange.findUnique.mockResolvedValue(
      mockDateRange as unknown as DateRange,
    );

    const response = await request(app)
      .get(ITEM_DATE_RANGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      dateRange: JSON.parse(JSON.stringify(mockDateRange)),
    });
  });

  it("should return 404 when the date range does not exist", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    prismaMock.dateRange.findUnique.mockResolvedValue(
      null as unknown as DateRange,
    );

    const response = await request(app)
      .get(ITEM_DATE_RANGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the date range exists but belongs to a different item", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    prismaMock.dateRange.findUnique.mockResolvedValue(
      null as unknown as DateRange,
    );

    const response = await request(app)
      .get(ITEM_DATE_RANGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });
});
