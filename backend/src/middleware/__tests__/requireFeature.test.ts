import { jest, describe, it, expect } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

jest.mock("@config/env", () => ({ default: { FEATURE_API_KEYS: false } }));

import requireFeature from "@middleware/requireFeature";
import { SERVICE_UNAVAILABLE } from "@config/errorCodes";

const mockReq = {} as Request;
const mockNext = jest.fn() as unknown as NextFunction;

const mockRes = () => {
  const res = {} as Response;
  res.sendStatus = jest.fn(() => res);
  return res;
};

describe("requireFeature", () => {
  it("should return 503 when the feature is disabled", () => {
    const res = mockRes();

    requireFeature("FEATURE_API_KEYS")(mockReq, res, mockNext);

    expect(res.sendStatus).toHaveBeenCalledWith(SERVICE_UNAVAILABLE);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
