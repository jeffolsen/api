import { OK } from "@config/errorCodes";
import { RequestHandler } from "express";
import catchErrors from "@util/catchErrors";
import prismaClient from "@db/client";
import { sendVerificationCode } from "@services/auth";
import { requestVerificationCodeSchema } from "@schemas/verificationCode";
import {
  requestDeleteProfileCode,
  requestManageApiKeyCode,
  requestLoginCode,
  requestSessionResetCode,
  requestPasswordResetCode,
} from "@services/verificationCode";
import { Request, Response } from "express";

const parseBody = (req: Request) =>
  requestVerificationCodeSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

export const getProfileVerificationCodes: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const codes = await prismaClient.verificationCode.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      omit: { value: true },
    });
    res.status(OK).json({ codes });
  },
);

export const requestDeleteProfileVerificationCode: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { password, userAgent } = parseBody(req);
    const { profile, codeType } = await requestDeleteProfileCode(
      profileId,
      password,
    );
    await sendVerificationCode({ profile, codeType, userAgent });
    res.sendStatus(OK);
  },
);

export const requestManageApiKeyVerificationCode: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;
    const { password, userAgent } = parseBody(req);
    const { profile, codeType } = await requestManageApiKeyCode(
      profileId,
      password,
    );
    await sendVerificationCode({ profile, codeType, userAgent });
    res.sendStatus(OK);
  },
);

export const requestLoginVerificationCode: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { email, password, userAgent } = parseBody(req);
    const { profile, codeType } = await requestLoginCode(email, password);
    await sendVerificationCode({ profile, codeType, userAgent });
    res.sendStatus(OK);
  },
);

export const requestSessionResetVerificationCode: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { email, password, userAgent } = parseBody(req);
    const { profile, codeType } = await requestSessionResetCode(
      email,
      password,
    );
    await sendVerificationCode({ profile, codeType, userAgent });
    res.sendStatus(OK);
  },
);

export const requestPasswordResetVerificationCode: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { email, userAgent } = parseBody(req);
    const { profile, codeType } = await requestPasswordResetCode(email);
    await sendVerificationCode({ profile, codeType, userAgent });
    res.sendStatus(OK);
  },
);

const verificationCodeApi = {
  getProfileVerificationCodes,
  requestDeleteProfileVerificationCode,
  requestManageApiKeyVerificationCode,
  requestLoginVerificationCode,
  requestSessionResetVerificationCode,
  requestPasswordResetVerificationCode,
};

export default verificationCodeApi;
