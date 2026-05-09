import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { ComponentType, PrismaClient } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, COMPONENT_TYPE_ROUTES } from "@config/routes";
import { MOCK_USER_AGENT, getAuthCookie, mockAuth } from "./helpers";
import { OK, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const MOCK_ID = 1;
const ENDPOINT = `${BASE_API_URL}${COMPONENT_TYPE_ROUTES}/${MOCK_ID}`;

const mockComponentType: ComponentType = {
  id: MOCK_ID,
  name: "hero",
  subjectType: "COLLECTION",
  propertySchema: {},
} as unknown as ComponentType;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/component-types/:id", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .get(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 with componentType on success", async () => {
    mockAuth(prismaMock);
    prismaMock.componentType.findUnique.mockResolvedValue(mockComponentType);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("componentType");
  });
});
