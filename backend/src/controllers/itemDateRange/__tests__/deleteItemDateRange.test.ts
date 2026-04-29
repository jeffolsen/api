import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, DateRange } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, DATE_RANGE_ROUTES, ITEM_ROUTES } from "@config/routes";
import { NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  MOCK_ITEM_ID,
  mockDateRange,
  mockItemWithDateRanges,
  getAuthCookie,
  mockAuth,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_DATE_RANGE_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${DATE_RANGE_ROUTES}/${mockDateRange.id}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("DELETE /api/items/:itemId/date-ranges/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).delete(ITEM_DATE_RANGE_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(
      mockItemWithDateRanges as unknown as Item,
    );
    prismaMock.dateRange.delete.mockResolvedValue(
      mockDateRange as unknown as DateRange,
    );

    const response = await request(app)
      .delete(ITEM_DATE_RANGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(null as unknown as Item);

    const response = await request(app)
      .delete(ITEM_DATE_RANGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the date range does not exist on the item", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue({
      ...mockItemWithDateRanges,
      dateRanges: [],
    } as unknown as Item);

    const response = await request(app)
      .delete(ITEM_DATE_RANGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should delete the correct date range by id", async () => {
    mockAuth(prismaMock);

    prismaMock.item.findFirst.mockResolvedValue({
      ...mockItemWithDateRanges,
      dateRanges: [mockDateRange],
    } as unknown as Item);

    const response = await request(app)
      .delete(ITEM_DATE_RANGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.dateRange.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: mockDateRange.id, itemId: mockItemWithDateRanges.id },
      }),
    );

    expect(response.statusCode).toBe(OK);
  });
});
