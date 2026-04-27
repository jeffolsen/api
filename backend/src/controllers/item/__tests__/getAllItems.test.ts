import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type {
  PrismaClient,
  Session,
  Item,
} from "../../../generated/prisma/client";
import request from "supertest";
import app from "../../../server";
import prisma from "../../../db/client";
import { signAccessToken } from "../../../util/jwt";
import { BASE_API_URL, ITEM_ROUTES } from "../../../config/routes";
import { OK, UNAUTHORIZED } from "../../../config/errorCodes";

jest.mock("../../../db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const MOCK_SESSION_ID = 1;
const MOCK_PROFILE_ID = 1;
const MOCK_USER_AGENT = "test-agent";

const mockSession = {
  id: MOCK_SESSION_ID,
  profileId: MOCK_PROFILE_ID,
  scope: "profile:session",
  userAgent: MOCK_USER_AGENT,
  expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  endedAt: null,
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/items", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(BASE_API_URL + ITEM_ROUTES);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    const accessToken = signAccessToken(MOCK_SESSION_ID);

    prismaMock.session.findUnique.mockResolvedValue(
      mockSession as unknown as Session,
    );
    prismaMock.$transaction.mockResolvedValue([[], 0] as unknown as [
      Item[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", `accessToken=${accessToken}`)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });
});
