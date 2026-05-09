import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Component, Feed, PrismaClient } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, COMPONENT_ROUTES } from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PROFILE_ID,
  getAuthCookie,
  mockAuth,
} from "./helpers";
import { NO_CONTENT, NOT_FOUND, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const MOCK_COMPONENT_ID = 1;
const MOCK_FEED_ID = 1;
const MOCK_TYPE_ID = 1;
const ENDPOINT = `${BASE_API_URL}${COMPONENT_ROUTES}/${MOCK_COMPONENT_ID}`;

const mockComponent: Component = {
  id: MOCK_COMPONENT_ID,
  feedId: MOCK_FEED_ID,
  typeId: MOCK_TYPE_ID,
  typeName: "hero",
  name: "hero-1",
  order: 1,
  propertyValues: {},
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Component;

const mockFeedWithComponents = {
  id: MOCK_FEED_ID,
  path: "home",
  subjectType: "COLLECTION",
  profileId: MOCK_PROFILE_ID,
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  components: [mockComponent],
} as unknown as Feed & { components: Component[] };

beforeEach(() => {
  mockReset(prismaMock);
});

describe("DELETE /api/components/:id", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .delete(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 404 when the component is not found", async () => {
    mockAuth(prismaMock);
    prismaMock.component.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 204 on success", async () => {
    mockAuth(prismaMock);
    prismaMock.component.findUnique.mockResolvedValue(mockComponent);
    prismaMock.feed.findUnique.mockResolvedValue(
      mockFeedWithComponents as unknown as Feed,
    );
    prismaMock.$transaction.mockResolvedValue([mockComponent] as never);

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NO_CONTENT);
  });

  it("should decrement the order of components after the deleted component", async () => {
    const comp2 = {
      ...mockComponent,
      id: 2,
      order: 2,
      name: "hero-2",
    } as unknown as Component;
    const comp3 = {
      ...mockComponent,
      id: 3,
      order: 3,
      name: "hero-3",
    } as unknown as Component;

    mockAuth(prismaMock);
    prismaMock.component.findUnique.mockResolvedValue(mockComponent);
    prismaMock.feed.findUnique.mockResolvedValue({
      ...mockFeedWithComponents,
      components: [mockComponent, comp2, comp3],
    } as unknown as Feed);
    prismaMock.$transaction.mockResolvedValue([mockComponent] as never);

    await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    // Deleting comp1 at order=1 shifts comp2 and comp3 down by 1
    expect(prismaMock.component.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 2 }, data: { order: 1 } }),
    );
    expect(prismaMock.component.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 3 }, data: { order: 2 } }),
    );
  });
});
