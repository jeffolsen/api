import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient from "../db/client";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../config/constants";
import { processVerificationCode } from "../services/auth";
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

  await processVerificationCode({
    profileId,
    sessionId,
    type: "EMAIL_VERIFICATION",
    value,
  });

  const session = await prismaClient.session.rescope(sessionId);
  throwError(session, INTERNAL_SERVER_ERROR, "something went wrong");

  res.sendStatus(OK);
});

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

  await processVerificationCode({
    profileId,
    sessionId,
    type: "PASSWORD_RESET",
    value,
  });

  const profile = await prismaClient.profile.update({
    where: { id: profileId },
    data: {
      password,
    },
  });
  throwError(profile, INTERNAL_SERVER_ERROR, "something went wrong");

  res.sendStatus(OK);
});

interface SubmitVerificationCodeForLogoutBody {
  value: string;
}

export const submitVerificationCodeForLogout: RequestHandler<
  unknown,
  unknown,
  SubmitVerificationCodeForLogoutBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId, sessionId } = req;
  const { value } = req.body;

  throwError(value, BAD_REQUEST, "code is required");

  await processVerificationCode({
    profileId,
    sessionId,
    type: "LOGOUT_ALL",
    value,
  });

  const sessions = await prismaClient.session.logOutAll(profileId);
  throwError(sessions.count, NOT_FOUND, "No sessions found");

  res.sendStatus(OK);
});

const verificationCodeApi = {
  getProfileVerificationCodes,
  submitVerificationCodeForEmail,
  submitVerificationCodeForPassword,
};

export default verificationCodeApi;
