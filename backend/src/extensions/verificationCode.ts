import {
  MAX_DAILY_SYSTEM_EMAILS,
  MAX_PROFILE_CODES,
} from "../config/constants";
import { Prisma } from "../generated/prisma/client";
import { StringFieldUpdateOperationsInput } from "../generated/prisma/models";
import { compareValue, hashValue } from "../util/bcrypt";
import {
  getNewVerificationCodeExpirationDate,
  getVerificationCodeExpirationWindow,
  oneDayAgo,
} from "../util/date";

const hashCode = async (
  code: string | StringFieldUpdateOperationsInput | undefined,
) => {
  let v = "";
  if (typeof code === "string") {
    v = await hashValue(code);
  }
  return { value: v };
};

export const verificationCodeExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    // client: {},
    query: {
      verificationCode: {
        async create({ model, operation, args, query }) {
          const valueOptions = await hashCode(args.data.value);

          const result = await query({
            ...args,
            data: {
              ...args.data,
              ...(!!valueOptions.value && valueOptions),
              expiresAt: getNewVerificationCodeExpirationDate(),
            },
          });
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
        async maxExceeded(profileId: number) {
          const verificationCodes = await newClient.verificationCode.findMany({
            where: {
              profileId,
              createdAt: {
                gte: getVerificationCodeExpirationWindow(),
              },
            },
            take: MAX_PROFILE_CODES,
          });
          return verificationCodes.length == MAX_PROFILE_CODES;
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
              console.log("validate", code, verificationCode.value);
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
