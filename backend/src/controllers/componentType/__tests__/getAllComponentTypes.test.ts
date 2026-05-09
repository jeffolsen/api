import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { ComponentType, PrismaClient } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  COMPONENT_TYPE_ROUTES,
  COLLECTION_ENDPOINT,
} from "@config/routes";
import { MOCK_USER_AGENT, getAuthCookie, mockAuth } from "./helpers";
import { OK, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + COMPONENT_TYPE_ROUTES + COLLECTION_ENDPOINT;

const mockComponentType: ComponentType = {
  id: 1,
  name: "hero",
  subjectType: "COLLECTION",
  propertySchema: {},
} as unknown as ComponentType;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/component-types/", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .get(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 with componentTypes on success", async () => {
    mockAuth(prismaMock);
    prismaMock.componentType.findMany.mockResolvedValue([mockComponentType]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("componentTypes");
  });

  it("should filter by subjectType query param", async () => {
    mockAuth(prismaMock);
    prismaMock.componentType.findMany.mockResolvedValue([mockComponentType]);

    const response = await request(app)
      .get(ENDPOINT)
      .query({ subjectType: "COLLECTION" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
    expect(prismaMock.componentType.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          subjectType: { equals: "COLLECTION" },
        }),
      }),
    );
  });
});
