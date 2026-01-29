import { Request, Response, NextFunction } from "express";
import { jest } from "@jest/globals";

/**
 * Creates a mock Express Request object for testing
 */
export const createMockRequest = (overrides?: Partial<Request>): Request => {
  const mockRequest = {
    body: {},
    params: {},
    query: {},
    headers: {},
    cookies: {},
    get: jest.fn(),
    header: jest.fn(),
    ...overrides,
  } as unknown as Request;

  return mockRequest;
};

/**
 * Creates a mock Express Response object for testing
 * with chainable methods (status, json, send, cookie, etc.)
 */
export const createMockResponse = () => {
  const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    sendStatus: jest.fn(),
    redirect: jest.fn(),
    render: jest.fn(),
    set: jest.fn(),
    header: jest.fn(),
  };

  // Make all methods chainable
  mockResponse.status.mockReturnValue(mockResponse);
  mockResponse.json.mockReturnValue(mockResponse);
  mockResponse.send.mockReturnValue(mockResponse);
  mockResponse.cookie.mockReturnValue(mockResponse);
  mockResponse.clearCookie.mockReturnValue(mockResponse);
  mockResponse.sendStatus.mockReturnValue(mockResponse);
  mockResponse.redirect.mockReturnValue(mockResponse);
  mockResponse.render.mockReturnValue(mockResponse);
  mockResponse.set.mockReturnValue(mockResponse);
  mockResponse.header.mockReturnValue(mockResponse);

  return mockResponse as unknown as Response;
};

/**
 * Creates a mock Express NextFunction for testing
 */
export const createMockNext = () => jest.fn() as unknown as NextFunction;
