import { MAX_PROFILE_API_KEYS } from "../config/constants";
import { Prisma } from "../generated/prisma/client";
import { ApiKeyCreateWithoutProfileInput } from "../schemas/apikey";
import { compareValue } from "../util/bcrypt";
import { randomUUID } from "node:crypto";

export const apiKeyExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    query: {
      apiKey: {
        async create({ model, operation, args, query }) {
          args.data = await ApiKeyCreateWithoutProfileInput.parseAsync(
            args.data,
          );
          return await query(args);
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
        generateKeyValue() {
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
