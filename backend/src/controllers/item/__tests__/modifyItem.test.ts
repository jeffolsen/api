import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES } from "@config/routes";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import { MOCK_USER_AGENT, mockItem, getAuthCookie, mockAuth } from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("PATCH /api/items/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).patch(
      `${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`,
    );
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.item.update.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Patched Item" });

    expect(response.statusCode).toBe(OK);
  });

  it("should return the updated item in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.item.update.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Patched Item" });

    expect(response.body).toEqual({
      item: JSON.parse(JSON.stringify(mockItem)),
    });
  });

  it("should return 400 when no properties are sent", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(null as unknown as Item);

    const response = await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Patched Item" });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should only update the fields provided in the request body", async () => {
    const noDescriptionItem = {
      ...mockItem,
      name: "No description",
      description: null,
    };
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(
      noDescriptionItem as unknown as Item,
    );
    const update = prismaMock.item.update.mockResolvedValue(
      mockItem as unknown as Item,
    );

    await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${noDescriptionItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ description: "add a description" });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          name: expect.anything(),
        }),
      }),
    );

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          description: "add a description",
        }),
      }),
    );
  });

  it("should not update the item tags", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    const update = prismaMock.item.update.mockResolvedValue(
      mockItem as unknown as Item,
    );

    await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Patched Item", tagNames: ["nature"] });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          tags: expect.anything(),
        }),
      }),
    );
  });

  it("should not update the item images", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    const update = prismaMock.item.update.mockResolvedValue(
      mockItem as unknown as Item,
    );

    await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Patched Item", imageIds: [5] });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          images: expect.anything(),
        }),
      }),
    );
  });

  it("should not update the item date ranges", async () => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    const update = prismaMock.item.update.mockResolvedValue(
      mockItem as unknown as Item,
    );

    await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({
        name: "Patched Item",
        dateRanges: [
          {
            description: "event description",
            startAt: start,
            endAt: end,
          },
        ],
      });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          dateRanges: expect.anything(),
        }),
      }),
    );
  });

  it("should not update the item slug", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    const update = prismaMock.item.update.mockResolvedValue(
      mockItem as unknown as Item,
    );

    await request(app)
      .patch(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Patched Item" });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          slug: expect.anything(),
        }),
      }),
    );
  });
});
