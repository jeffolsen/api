import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient, { codeType, verificationCode } from "../db/client";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "../config/constants";
import throwError from "../util/throwError";
import { sendVerificationCode } from "../services/auth";

export const getAllVerificationCodes: RequestHandler = catchErrors(
  async (req, res, next) => {
    const codes = await prismaClient.verificationCode.findMany();
    res.status(OK).json(codes);
  }
);

interface RequestVerificationCodeBody {
  type: codeType;
}

export const requestVerificationCode: RequestHandler<
  unknown,
  unknown,
  RequestVerificationCodeBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId } = req;
  const { type: codeType } = req.body;

  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });

  throwError(profile, BAD_REQUEST, "Invalid token");

  sendVerificationCode(profile.email, profileId, codeType);

  res.sendStatus(OK);
});

interface SubmitVerificationCodeBody {
  type: codeType;
  value: string;
}

export const submitVerificationCode: RequestHandler<
  unknown,
  unknown,
  SubmitVerificationCodeBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId } = req;
  const { type, value } = req.body;

  const verificationCode = await prismaClient.verificationCode.findFirst({
    where: { profileId, type, verified: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  throwError(verificationCode, NOT_FOUND, "No pending code found");
  throwError(
    verificationCode.value === value,
    UNAUTHORIZED,
    "Invalid credentials"
  );

  await prismaClient.verificationCode.update({
    where: { id: verificationCode.id },
    data: {
      verified: true,
    },
  });

  res.sendStatus(OK);
});

const verificationCodeApi = {
  getAllVerificationCodes,
};

export default verificationCodeApi;
