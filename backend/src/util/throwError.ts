import createHttpError from "http-errors";
import assert from "node:assert";

type ThrowErrorParams = (
  condition: unknown,
  code: number,
  message: string,
) => asserts condition;

const throwError: ThrowErrorParams = (condition, code, message) =>
  assert(condition, createHttpError(code, message));

export default throwError;
