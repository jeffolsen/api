import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient from "../db/client";
import { OK } from "../config/constants";

export const getAllVerificationCodes: RequestHandler = catchErrors(
  async (req, res, next) => {
    const codes = await prismaClient.verificationCode.findMany();
    res.status(OK).json(codes);
  }
);

const verificationCodeApi = {
  getAllVerificationCodes,
};

export default verificationCodeApi;
