import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient from "../db/client";
import { BAD_REQUEST, OK } from "../config/constants";
import {
  validateVerificationCode,
  verifiedUpdatePassword,
  verifiedUpdateScope,
} from "../services/verify";
import throwError from "../util/throwError";

export const getProfileVerificationCodes: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req;
    const codes = await prismaClient.verificationCode.findMany({
      where: { profileId },
      omit: { value: true, sessionId: true },
    });
    res.status(OK).json(codes);
  }
);

interface SubmitVerificationCodPasswordBody {
  value: string;
  password: string;
  confirmPassword: string;
}

export const submitVerificationCodeForPassword: RequestHandler<
  unknown,
  unknown,
  SubmitVerificationCodPasswordBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId, sessionId } = req;
  const { value, password, confirmPassword } = req.body;

  throwError(
    value && password && confirmPassword,
    BAD_REQUEST,
    "code and password twice are required"
  );

  await validateVerificationCode({
    profileId,
    sessionId,
    type: "PASSWORD_RESET",
    value,
  });

  await verifiedUpdatePassword({ profileId, password });

  res.sendStatus(OK);
});
interface SubmitVerificationCodeEmailBody {
  value: string;
}

export const submitVerificationCodeForEmail: RequestHandler<
  unknown,
  unknown,
  SubmitVerificationCodeEmailBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId, sessionId } = req;
  const { value } = req.body;

  throwError(value, BAD_REQUEST, "code is required");

  await validateVerificationCode({
    profileId,
    sessionId,
    type: "EMAIL_VERIFICATION",
    value,
  });

  await verifiedUpdateScope({ sessionId });

  res.sendStatus(OK);
});

const verificationCodeApi = {
  getProfileVerificationCodes,
  submitVerificationCodeForEmail,
  submitVerificationCodeForPassword,
};

export default verificationCodeApi;
