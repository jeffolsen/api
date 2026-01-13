import {
  MAX_DAILY_SYSTEM_EMAILS,
  MAX_PROFILE_CODES,
} from "../config/constants";
import { CodeType, Prisma } from "../generated/prisma/client";
import { VerificationCodeIssueSchema } from "../schemas/verificationCode";
import { compareValue } from "../util/bcrypt";
import {
  getNewVerificationCodeExpirationDate,
  getVerificationCodeExpirationWindow,
  oneDayAgo,
} from "../util/date";

export const verificationCodeExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    model: {
      verificationCode: {
        async issue(data: unknown) {
          const d = await VerificationCodeIssueSchema.parseAsync(data);
          return await newClient.verificationCode.create({
            data: {
              ...d,
              expiresAt: getNewVerificationCodeExpirationDate(),
            },
          });
        },
        async use(id: number) {
          return await newClient.verificationCode.update({
            where: { id },
            data: {
              usedAt: new Date(Date.now()),
            },
          });
        },
        async maxExceeded(profileId: number, codeType: CodeType) {
          if (
            codeType === CodeType.LOGOUT_ALL ||
            codeType === CodeType.DELETE_PROFILE
          )
            return false;
          const verificationCodes = await newClient.verificationCode.findMany({
            where: {
              profileId,
              createdAt: {
                gte: getVerificationCodeExpirationWindow(),
              },
            },
            take: MAX_PROFILE_CODES,
          });
          return verificationCodes.length === MAX_PROFILE_CODES;
        },
        async systemDailyMaxExceeded() {
          const verificationCodes = await newClient.verificationCode.findMany({
            where: {
              createdAt: {
                gte: oneDayAgo(),
              },
            },
            take: MAX_DAILY_SYSTEM_EMAILS,
          });
          return verificationCodes.length == MAX_DAILY_SYSTEM_EMAILS;
        },
      },
    },
    result: {
      verificationCode: {
        validate: {
          needs: { value: true },
          compute(verificationCode) {
            return async (code: string) => {
              return await compareValue(code, verificationCode.value);
            };
          },
        },
      },
    },
  });
  return newClient;
});

export default verificationCodeExtension;
