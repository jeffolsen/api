import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, DATE_RANGE_ROUTES, ITEM_ROUTES } from "@config/routes";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  MOCK_ITEM_ID,
  mockDateRange,
  getAuthCookie,
  mockAuth,
  mockAddItemDateRangeTransaction,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_DATE_RANGES_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${DATE_RANGE_ROUTES}`;

const VALID_START = "2024-01-01T00:00:00.000Z";
const VALID_END = "2024-12-31T00:00:00.000Z";

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/items/:itemId/date-ranges", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).post(ITEM_DATE_RANGES_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when startAt is after endAt", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ITEM_DATE_RANGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ startAt: VALID_END, endAt: VALID_START });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ITEM_DATE_RANGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ startAt: VALID_START, endAt: VALID_END });

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    const { txItemFindUnique } = mockAddItemDateRangeTransaction(prismaMock);
    txItemFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ITEM_DATE_RANGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ startAt: VALID_START, endAt: VALID_END });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should call item.update with the correct date range data", async () => {
    mockAuth(prismaMock);
    const { txItemUpdate } = mockAddItemDateRangeTransaction(prismaMock);

    await request(app)
      .post(ITEM_DATE_RANGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({
        startAt: VALID_START,
        endAt: VALID_END,
        description: mockDateRange.description,
      });

    expect(txItemUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          dateRanges: {
            create: {
              startAt: VALID_START,
              endAt: VALID_END,
              description: mockDateRange.description,
            },
          },
        },
      }),
    );
  });
});
