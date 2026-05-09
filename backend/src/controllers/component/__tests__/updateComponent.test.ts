import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type {
  Component,
  ComponentType,
  PrismaClient,
} from "@/generated/prisma/client";
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
import { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const MOCK_COMPONENT_ID = 1;
const MOCK_FEED_ID = 1;
const MOCK_TYPE_ID = 1;
const ENDPOINT = `${BASE_API_URL}${COMPONENT_ROUTES}/${MOCK_COMPONENT_ID}`;

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

const mockComponentWithFeed = {
  ...mockComponent,
  feed: {
    components: [mockComponent],
  },
};

const VALID_BODY = { name: "hero-updated", order: 1 };

const mockUpdateTransaction = () => {
  const componentUpdate = jest
    .fn<(args: unknown) => Promise<Component>>()
    .mockResolvedValue(mockComponent);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementationOnce((callback: any) =>
    callback({
      component: {
        update: componentUpdate,
      },
    }),
  );

  return { componentUpdate };
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("PUT /api/components/:id", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .put(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when required fields are missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 404 when the component is not found", async () => {
    mockAuth(prismaMock);
    prismaMock.component.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 200 with component on success", async () => {
    mockAuth(prismaMock);
    prismaMock.component.findUnique.mockResolvedValue(
      mockComponentWithFeed as unknown as Component,
    );
    prismaMock.componentType.findUnique.mockResolvedValue(mockComponentType);
    mockUpdateTransaction();

    const response = await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("component");
  });

  it("should update the component with the provided data", async () => {
    mockAuth(prismaMock);
    prismaMock.component.findUnique.mockResolvedValue(
      mockComponentWithFeed as unknown as Component,
    );
    prismaMock.componentType.findUnique.mockResolvedValue(mockComponentType);
    const { componentUpdate } = mockUpdateTransaction();

    await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(componentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: "hero-updated" }),
      }),
    );
  });

  it("should reorder components between the old and new position when moving a component", async () => {
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
    prismaMock.component.findUnique.mockResolvedValue({
      ...mockComponent,
      feed: { components: [mockComponent, comp2, comp3] },
    } as unknown as Component);
    prismaMock.componentType.findUnique.mockResolvedValue(mockComponentType);
    const { componentUpdate } = mockUpdateTransaction();

    await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "hero-1", order: 3 });

    // Moving comp1 from order=1 to order=3 shifts comp2 and comp3 down by 1
    expect(componentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 2 }, data: { order: 1 } }),
    );
    expect(componentUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 3 }, data: { order: 2 } }),
    );
  });
});
