import { MAX_PROFILE_APIKEYS } from "../config/constants";
import { Prisma } from "../generated/prisma/client";
import { hashValue } from "../util/bcrypt";

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
            take: MAX_PROFILE_APIKEYS,
          });
          return apiKeys.length == MAX_PROFILE_APIKEYS;
        },
        async checkSlug(slug: string) {
          return true;
        },
        async generateKeyValue() {
          // uuid
          return "xxx";
        },
      },
    },
    result: {},
  });
  return newClient;
});

export default apiKeyExtension;
