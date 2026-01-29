/* eslint-disable  @typescript-eslint/no-explicit-any */
import { describe, expect, it, jest } from "@jest/globals";
import catchErrors from "../catchErrors";
import { RequestHandler } from "express";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
} from "./helpers/express-mocks";

describe("catchErrors", () => {
  describe("successful handler execution", () => {
    it("should call wrapped handler with req, res, next", async () => {
      const mockHandler = jest.fn() as unknown as RequestHandler;
      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(mockHandler).toHaveBeenCalledWith(req, res, next);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("should not call next when handler succeeds", async () => {
      const mockHandler = jest.fn() as unknown as RequestHandler;
      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).not.toHaveBeenCalled();
    });

    it("should await async handler completion", async () => {
      let completed = false;
      const mockHandler = jest.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        completed = true;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(completed).toBe(true);
      expect(next).not.toHaveBeenCalled();
    });

    it("should allow handler to send response", async () => {
      const mockHandler = jest.fn().mockImplementation((_req, res) => {
        (res as ReturnType<typeof createMockResponse>).json({ success: true });
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should call next with error when handler throws", async () => {
      const testError = new Error("Test error");
      const mockHandler = jest.fn().mockImplementation(() => {
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should call next with error when async handler rejects", async () => {
      const testError = new Error("Async error");
      const mockHandler = jest.fn().mockImplementation(async () => {
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should not swallow errors", async () => {
      const testError = new Error("Important error");
      const mockHandler = jest.fn().mockImplementation(() => {
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
      expect((next as any).mock.calls[0][0]).toBe(testError);
    });

    it("should handle synchronous errors", async () => {
      const testError = new Error("Sync error");
      const mockHandler = jest.fn().mockImplementation(() => {
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
    });

    it("should handle asynchronous errors", async () => {
      const testError = new Error("Async error");
      const mockHandler = jest.fn().mockImplementation(async () => {
        await Promise.resolve();
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
    });

    it("should handle errors after await", async () => {
      const testError = new Error("Error after await");
      const mockHandler = jest.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
    });

    it("should handle non-Error objects thrown", async () => {
      const testError = { message: "Not an Error instance" };
      const mockHandler = jest.fn().mockImplementation(() => {
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
    });

    it("should handle string errors", async () => {
      const testError = "String error";
      const mockHandler = jest.fn().mockImplementation(() => {
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
    });
  });

  describe("middleware signature", () => {
    it("should return a RequestHandler", () => {
      const mockHandler = jest.fn() as unknown as RequestHandler;
      const wrappedHandler = catchErrors(mockHandler);

      expect(typeof wrappedHandler).toBe("function");
      expect(wrappedHandler.length).toBe(3); // req, res, next
    });

    it("should preserve handler context", async () => {
      let contextValue = "";
      const mockHandler = jest.fn().mockImplementation(function (this: {
        value: string;
      }) {
        contextValue = this?.value || "no context";
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(mockHandler).toHaveBeenCalled();
    });

    it("should work with handlers that use request properties", async () => {
      const mockHandler = jest.fn().mockImplementation((req, res) => {
        const userId = (req as ReturnType<typeof createMockRequest>).body
          .userId;
        (res as ReturnType<typeof createMockResponse>).json({ userId });
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest({ body: { userId: 123 } });
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ userId: 123 });
    });
  });

  describe("edge cases", () => {
    it("should handle handler that throws immediately", async () => {
      const testError = new Error("Immediate error");
      const mockHandler = jest.fn().mockImplementation(() => {
        throw testError;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(testError);
    });

    it("should handle multiple sequential errors", async () => {
      const testError1 = new Error("Error 1");
      const testError2 = new Error("Error 2");
      const mockHandler1 = jest.fn().mockImplementation(() => {
        throw testError1;
      }) as unknown as RequestHandler;
      const mockHandler2 = jest.fn().mockImplementation(() => {
        throw testError2;
      }) as unknown as RequestHandler;

      const wrappedHandler1 = catchErrors(mockHandler1);
      const wrappedHandler2 = catchErrors(mockHandler2);
      const req = createMockRequest();
      const res = createMockResponse();
      const next1 = createMockNext();
      const next2 = createMockNext();

      await wrappedHandler1(req, res, next1);
      await wrappedHandler2(req, res, next2);

      expect(next1).toHaveBeenCalledWith(testError1);
      expect(next2).toHaveBeenCalledWith(testError2);
    });

    it("should handle empty/undefined errors", async () => {
      const mockHandler = jest.fn().mockImplementation(() => {
        throw undefined;
      }) as unknown as RequestHandler;

      const wrappedHandler = catchErrors(mockHandler);
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await wrappedHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(undefined);
    });
  });
});
