import { MAX_PROFILE_API_KEYS } from "../config/constants";
import { Prisma } from "../generated/prisma/client";
import { compareValue, hashValue } from "../util/bcrypt";
import { randomUUID } from "node:crypto";

const hashApiKey = async (apiKey: string | null | undefined) => {
  let v = "";
  if (typeof apiKey === "string") {
    v = await hashValue(apiKey);
  }
  return { value: v };
};

export const apiKeyExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    query: {
      apiKey: {
        async create({ model, operation, args, query }) {
          const valueOptions = await hashApiKey(args.data.value);
          const result = await query({
            ...args,
            data: {
              ...args.data,
              ...(!!valueOptions.value && valueOptions),
            },
          });
          return result;
        },
      },
    },
    model: {
      apiKey: {
        async maxExceeded(profileId: number) {
          const apiKeys = await newClient.apiKey.findMany({
            where: {
              profileId,
            },
            take: MAX_PROFILE_API_KEYS,
          });
          return apiKeys.length == MAX_PROFILE_API_KEYS;
        },
        async checkSlug(slug: string) {
          const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
          return slugRegex.test(slug);
        },
        async checkUrl(val: string) {
          try {
            const url = new URL(val);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch (err) {
            return false;
          }
        },
        async generateKeyValue() {
          return randomUUID();
        },
      },
    },
    result: {
      apiKey: {
        validate: {
          needs: { value: true },
          compute(apiKey) {
            return async (value: string) => {
              console.log(value, apiKey?.value);
              return (
                !!apiKey?.value && (await compareValue(value, apiKey.value))
              );
            };
          },
        },
      },
    },
  });
  return newClient;
});

export default apiKeyExtension;
