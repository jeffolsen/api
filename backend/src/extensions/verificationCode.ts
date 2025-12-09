import { MAX_PROFILE_CODES } from "../config/constants";
import { Prisma, VerificationCode } from "../generated/prisma/client";
import { StringFieldUpdateOperationsInput } from "../generated/prisma/models";
import { compareValue, hashValue } from "../util/bcrypt";
import {
  getNewVerificationCodeExpirationDate,
  twentyFourHoursAgo,
} from "../util/date";

const hashCode = async (
  code: string | StringFieldUpdateOperationsInput | undefined
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
              used: true,
            },
          });
        },
        async dailyMaxExceeded(profileId: number) {
          const verificationCodes = await newClient.verificationCode.findMany({
            where: {
              profileId,
              createdAt: {
                gte: twentyFourHoursAgo(),
              },
            },
          });
          return verificationCodes.length >= MAX_PROFILE_CODES;
        },
      },
    },
    result: {
      verificationCode: {
        validate: {
          needs: { value: true },
          compute(verificationCode) {
            return async (code: string) => {
              return await compareValue(verificationCode.value, code);
            };
          },
        },
      },
    },
  });
  return newClient;
});

type Validate = (password: string) => Promise<boolean>;
export type ExtendedVerificationCode = VerificationCode & {
  validate: Validate;
};
export default verificationCodeExtension;
