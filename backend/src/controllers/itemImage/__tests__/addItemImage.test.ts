import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Image } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES, IMAGE_ROUTES } from "@config/routes";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  MOCK_ITEM_ID,
  MOCK_IMAGE_ID,
  mockImage,
  mockItemImage,
  mockItem,
  getAuthCookie,
  mockAuth,
  mockAddItemImageTransaction,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_IMAGES_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${IMAGE_ROUTES}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/items/:itemId/images", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).post(ITEM_IMAGES_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when neither id nor url is provided", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ITEM_IMAGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return status 200 when adding an image by id", async () => {
    mockAuth(prismaMock);
    mockAddItemImageTransaction(prismaMock);

    const response = await request(app)
      .post(ITEM_IMAGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ id: String(MOCK_IMAGE_ID) });

    expect(response.statusCode).toBe(OK);
  });

  it("should return status 200 when adding an image by url", async () => {
    mockAuth(prismaMock);
    mockAddItemImageTransaction(prismaMock);

    const response = await request(app)
      .post(ITEM_IMAGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ url: mockImage.url });

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    const { txItemFindUnique } = mockAddItemImageTransaction(prismaMock);
    txItemFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ITEM_IMAGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ url: mockImage.url });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the image does not exist", async () => {
    mockAuth(prismaMock);
    const { txImageFindUnique } = mockAddItemImageTransaction(prismaMock);
    txImageFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ITEM_IMAGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ url: mockImage.url });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 400 when the image is already on the item", async () => {
    mockAuth(prismaMock);
    const { txItemFindUnique } = mockAddItemImageTransaction(prismaMock);
    txItemFindUnique.mockResolvedValue({
      ...mockItem,
      images: [mockItemImage],
    } as unknown as Item);

    const response = await request(app)
      .post(ITEM_IMAGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ id: String(MOCK_IMAGE_ID) });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should call item.update with the correct imageId", async () => {
    mockAuth(prismaMock);
    const { txItemUpdate } = mockAddItemImageTransaction(prismaMock);

    await request(app)
      .post(ITEM_IMAGES_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ id: String(MOCK_IMAGE_ID) });

    expect(txItemUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { images: { create: { imageId: MOCK_IMAGE_ID } } },
      }),
    );
  });
});
