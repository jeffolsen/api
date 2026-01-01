import {
  INVALID_CODE_TYPE,
  INVALID_CODE_VALUE,
  INVALID_PROFILE_ID,
  INVALID_CODE_USED_AT_FORMAT,
  MAX_DAILY_SYSTEM_EMAILS,
  MAX_PROFILE_CODES,
  NUMERIC_CODE_REGEX,
} from "../config/constants";
import { CodeType, Prisma } from "../generated/prisma/client";
import { compareValue, hashValue } from "../util/bcrypt";
import {
  getNewVerificationCodeExpirationDate,
  getVerificationCodeExpirationWindow,
  oneDayAgo,
} from "../util/date";
import { z } from "zod";

export const VerificationCodeInput = z.object({
  type: z.enum(CodeType, INVALID_CODE_TYPE).optional(),
  value: z
    .string(INVALID_CODE_VALUE)
    .regex(NUMERIC_CODE_REGEX, INVALID_CODE_VALUE)
    .pipe(z.transform(async (val) => await hashValue(val))),
  usedAt: z.date(INVALID_CODE_USED_AT_FORMAT).nullish(),
  profileId: z.number().nullish(),
  sessionId: z.number().nullish(),
}) satisfies z.Schema<Prisma.VerificationCodeCreateInput>;

export const VerificationCodeFindWhere = z.looseObject(
  (
    z.object({
      type: z.enum(CodeType, INVALID_CODE_TYPE).optional(),
      profileId: z.number(INVALID_PROFILE_ID).optional(),
    }) satisfies z.Schema<Prisma.VerificationCodeScalarWhereInput>
  ).shape,
);

export const VerificationCodeCreateInput = VerificationCodeInput.pick({
  type: true,
  value: true,
  profileId: true,
  sessionId: true,
});

export const VerificationCodeUpdateInput = VerificationCodeInput.pick({
  usedAt: true,
});

export const verificationCodeExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    query: {
      verificationCode: {
        async create({ model, operation, args, query }) {
          args.data = await VerificationCodeCreateInput.parseAsync(args.data);
          args.data.expiresAt = getNewVerificationCodeExpirationDate();
          const result = await query(args);
          return result;
        },
        async update({ model, operation, args, query }) {
          args.data = await VerificationCodeUpdateInput.parseAsync(args.data);
          const result = await query(args);
          return result;
        },
        async findFirst({ model, operation, args, query }) {
          args.where = VerificationCodeFindWhere.parse(args.where);
          const result = await query(args);
          return result;
        },
        async findMany({ model, operation, args, query }) {
          args.where = VerificationCodeFindWhere.parse(args.where);
          const result = await query(args);
          return result;
        },
      },
    },
    model: {
      verificationCode: {
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
