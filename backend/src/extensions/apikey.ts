import { MAX_PROFILE_API_KEYS, SLUG_REGEX } from "../config/constants";
import { Prisma } from "../generated/prisma/client";
import { compareValue, hashValue } from "../util/bcrypt";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export const ApiKeyCreateWithoutProfileInput = z.object({
  slug: z.string("Invalid slug").max(100).regex(SLUG_REGEX),
  origin: z.url({ protocol: /^https$/, message: "Invalid origin" }).optional(),
  value: z
    .uuid()
    .pipe(z.transform(async (val) => await hashValue(val)))
    .optional(),
  profileId: z.number("Invalid profile id"),
}) satisfies z.Schema<Prisma.ApiKeyCreateWithoutProfileInput>;

export const apiKeyExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    query: {
      apiKey: {
        async create({ model, operation, args, query }) {
          args.data = await ApiKeyCreateWithoutProfileInput.parseAsync(
            args.data,
          );
          const result = await query(args);
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
