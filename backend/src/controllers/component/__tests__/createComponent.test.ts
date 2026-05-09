import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type {
  Component,
  ComponentType,
  Feed,
  PrismaClient,
} from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  COMPONENT_ROUTES,
  COLLECTION_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PROFILE_ID,
  getAuthCookie,
  mockAuth,
} from "./helpers";
import { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = `${BASE_API_URL}${COMPONENT_ROUTES}${COLLECTION_ENDPOINT}`;

const MOCK_COMPONENT_ID = 1;
const MOCK_FEED_ID = 1;
const MOCK_TYPE_ID = 1;

const mockComponentType = {
  id: MOCK_TYPE_ID,
  name: "hero",
  subjectType: "COLLECTION",
  propertySchema: {},
} as unknown as ComponentType;

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

const mockFeed = {
  id: MOCK_FEED_ID,
  path: "home",
  subjectType: "COLLECTION",
  profileId: MOCK_PROFILE_ID,
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  components: [],
} as unknown as Feed & { components: Component[] };

const VALID_BODY = {
  feedId: MOCK_FEED_ID,
  typeId: MOCK_TYPE_ID,
  name: "hero-1",
  order: 1,
};

const mockCreateTransaction = () => {
  const componentCreate = jest
    .fn<(args: unknown) => Promise<Component>>()
    .mockResolvedValue(mockComponent);
  const componentUpdate = jest
    .fn<(args: unknown) => Promise<Component>>()
    .mockResolvedValue(mockComponent);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementationOnce((callback: any) =>
    callback({
      component: {
        create: componentCreate,
        update: componentUpdate,
      },
    }),
  );

  return { componentCreate, componentUpdate };
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/components/", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when required fields are missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ feedId: MOCK_FEED_ID });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 404 when the component type is not found", async () => {
    mockAuth(prismaMock);
    prismaMock.componentType.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the feed is not found", async () => {
    mockAuth(prismaMock);
    prismaMock.componentType.findUnique.mockResolvedValue(mockComponentType);
    prismaMock.feed.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 200 with component on success", async () => {
    mockAuth(prismaMock);
    prismaMock.componentType.findUnique.mockResolvedValue(mockComponentType);
    prismaMock.feed.findUnique.mockResolvedValue(mockFeed);
    mockCreateTransaction();

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("component");
  });

  it("should create the component with the provided data", async () => {
    mockAuth(prismaMock);
    prismaMock.componentType.findUnique.mockResolvedValue(mockComponentType);
    prismaMock.feed.findUnique.mockResolvedValue(mockFeed);
    const { componentCreate } = mockCreateTransaction();

    await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(componentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: "hero-1", feedId: MOCK_FEED_ID }),
      }),
    );
  });

  it("should increment the order of components at or after the inserted position", async () => {
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
    prismaMock.componentType.findUnique.mockResolvedValue(mockComponentType);
    prismaMock.feed.findUnique.mockResolvedValue({
      ...mockFeed,
      components: [mockComponent, comp2, comp3],
    } as unknown as Feed);
    const { componentUpdate } = mockCreateTransaction();

    await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ ...VALID_BODY, order: 2 });

    expect(componentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 2 }, data: { order: 3 } }),
    );
    expect(componentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 3 }, data: { order: 4 } }),
    );
  });
});
