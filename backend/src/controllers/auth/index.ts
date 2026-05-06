import { RequestHandler } from "express";
import { initProfileSession, refreshAccessToken } from "@services/auth";
import { setAuthCookies } from "@util/cookie";
import catchErrors from "@util/catchErrors";
import {
  MESSAGE_EMAIL_TAKEN,
  MESSAGE_CREDENTIALS,
} from "@config/errorMessages";
import { OK, CREATED, NOT_FOUND, CONFLICT } from "@config/errorCodes";
import throwError from "@util/throwError";
import prismaClient from "@db/client";
import { loginSchema, RegisterSchema } from "@schemas/auth";
import { ProfileCreateTransform } from "@schemas/profile";
import { Request, Response } from "express";
import { findProfileWithReceipt } from "@/services/profile";

interface RegisterBody {
  email: string;
  password: string;
  confirmPassword: string;
  consentToTerms: boolean;
  consentToPrivacy: boolean;
  assertEighteenYearsOrOlder: boolean;
}

export const register: RequestHandler<unknown, unknown, RegisterBody, unknown> =
  catchErrors(async (req: Request, res: Response) => {
    const {
      email,
      password,
      consentToTerms,
      consentToPrivacy,
      assertEighteenYearsOrOlder,
    } = RegisterSchema.parse({
      ...req.body,
    });

    await prismaClient.$transaction(async (tx) => {
      const emailFound = await tx.profile.findUnique({
        where: { email },
      });
      throwError(!emailFound, CONFLICT, MESSAGE_EMAIL_TAKEN);

      await tx.profile.create({
        data: {
          ...(await ProfileCreateTransform.parseAsync({ email, password })),
          profileReceipt: {
            create: {
              consentToTermsAt: consentToTerms && new Date(),
              consentToPrivacyAt: consentToPrivacy && new Date(),
              verifiedAgeAt: assertEighteenYearsOrOlder && new Date(),
            },
          },
        },
      });
    });

    res.sendStatus(CREATED);
  });

interface LoginWithVerificationCodeBody {
  email: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginWithVerificationCodeBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const code = req.get("X-Verification-Code");
  const { profileId } = req;
  const loggedIn = !!profileId;
  throwError(!loggedIn, CONFLICT, "Already logged in");

  const { email, verificationCode, userAgent } = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
    verificationCode: code || "",
  });

  const profile = await findProfileWithReceipt({ email });

  // if the profile has not met the requirements for registration it can't login

  throwError(
    profile?.profileReceipt?.consentToTermsAt &&
      profile?.profileReceipt?.consentToPrivacyAt &&
      profile?.profileReceipt?.verifiedAgeAt,
    NOT_FOUND,
    MESSAGE_CREDENTIALS,
  );

  const { session, ...tokens } = await initProfileSession({
    profile,
    verificationCode,
    userAgent,
  });

  setAuthCookies({
    res,
    sessionexpiredAt: session.expiredAt,
    ...tokens,
  }).sendStatus(OK);
});

export const refresh: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const userAgent = req.headers["user-agent"];
    throwError(refreshToken, NOT_FOUND, MESSAGE_CREDENTIALS);

    const { session, ...tokens } = await refreshAccessToken({
      refreshToken,
      userAgent,
    });

    setAuthCookies({
      res,
      sessionexpiredAt: session.expiredAt,
      ...tokens,
    }).sendStatus(OK);
  },
);

const authApi = {
  register,
  refresh,
  login,
};
export default authApi;
