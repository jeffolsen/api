import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient from "../db/client";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
  OK,
} from "../config/constants";
import { processVerificationCode } from "../services/auth";
import throwError from "../util/throwError";

export const getProfileVerificationCodes: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId, sessionId } = req;
    const codes = await prismaClient.verificationCode.findMany({
      where: { profileId },
      omit: { value: true, sessionId: true },
    });
    res.status(OK).json(codes);
  },
);

interface SubmitVerificationCodeLoginBody {
  value: string;
}

export const submitVerificationCodeForLogin: RequestHandler<
  unknown,
  unknown,
  SubmitVerificationCodeLoginBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId, sessionId } = req;
  const { value } = req.body;

  throwError(value, BAD_REQUEST, "code is required");

  await processVerificationCode({
    profileId,
    sessionId,
    type: "LOGIN",
    value,
  });

  const session = await prismaClient.session.rescope(sessionId);
  throwError(session, INTERNAL_SERVER_ERROR, "something went wrong");

  res.sendStatus(OK);
});

interface SubmitVerificationCodePasswordResetBody {
  value: string;
  password: string;
  confirmPassword: string;
}

export const submitVerificationCodeForPasswordReset: RequestHandler<
  unknown,
  unknown,
  SubmitVerificationCodePasswordResetBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId, sessionId } = req;
  const { value, password, confirmPassword } = req.body;

  throwError(
    value && password && confirmPassword,
    BAD_REQUEST,
    "code and password twice are required",
  );

  await processVerificationCode({
    profileId,
    sessionId,
    type: "PASSWORD_RESET",
    value,
  });

  throwError(
    await prismaClient.profile.findUnique({
      where: { id: profileId },
    }),
    INTERNAL_SERVER_ERROR,
    "something went wrong",
  );

  await prismaClient.profile.update({
    where: { id: profileId },
    data: {
      password,
    },
  });

  res.sendStatus(OK);
});

interface SubmitVerificationCodeForLogoutAllBody {
  value: string;
}

export const submitVerificationCodeForLogoutAll: RequestHandler<
  unknown,
  unknown,
  SubmitVerificationCodeForLogoutAllBody,
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
  throwError(sessions?.count, NOT_FOUND, "No sessions found");

  res.sendStatus(OK);
});

interface SubmitVerificationCodeForDeleteProfileBody {
  value: string;
}

export const submitVerificationCodeForDeleteProfile: RequestHandler<
  unknown,
  unknown,
  SubmitVerificationCodeForDeleteProfileBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId, sessionId } = req;
  const { value } = req.body;
  throwError(value, BAD_REQUEST, "code is required");

  await processVerificationCode({
    profileId,
    sessionId,
    type: "DELETE_PROFILE",
    value,
  });

  await prismaClient.profile.delete({
    where: { id: profileId },
  });

  res.sendStatus(NO_CONTENT);
});

export const submitVerificationCodeForApiKey: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId, sessionId } = req;
    const { slug, value } = req.body;
    throwError(slug && value, BAD_REQUEST, "slug and code is required");

    throwError(
      !(await prismaClient.apiKey.maxExceeded(profileId)),
      CONFLICT,
      "Max number of apikeys reached",
    );

    throwError(
      await prismaClient.apiKey.checkSlug(slug),
      BAD_REQUEST,
      "Slug format not allowed",
    );

    const slugNotFound = !(await prismaClient.apiKey.findUnique({
      where: { slug },
    }));
    throwError(slugNotFound, CONFLICT, "Slug already taken");

    await processVerificationCode({
      profileId,
      sessionId,
      type: "DELETE_PROFILE",
      value,
    });
    const apiKeyValue = await prismaClient.apiKey.generateKeyValue();

    await prismaClient.apiKey.create({
      data: { profileId, value: apiKeyValue, slug },
    });

    res.status(CREATED).json({ apiKey: apiKeyValue });
  },
);

const verificationCodeApi = {
  getProfileVerificationCodes,
  submitVerificationCodeForLogin,
  submitVerificationCodeForPasswordReset,
  submitVerificationCodeForLogoutAll,
  submitVerificationCodeForDeleteProfile,
};

export default verificationCodeApi;
