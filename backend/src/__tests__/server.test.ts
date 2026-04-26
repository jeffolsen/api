import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../server";
import { BASE_API_URL, HEALTH_ENDPOINT } from "../config/routes";
import { MESSAGE_HEALTHY } from "../config/errorMessages";

describe("GET /api/health", () => {
  it("should return status 200 and a JSON message", async () => {
    const response = await request(app).get(BASE_API_URL + HEALTH_ENDPOINT);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: MESSAGE_HEALTHY });
  });
});
