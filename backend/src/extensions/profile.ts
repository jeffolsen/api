import { Prisma, Profile } from "../generated/prisma/client";
import { StringFieldUpdateOperationsInput } from "../generated/prisma/models";
import { compareValue, hashValue } from "../util/bcrypt";

const hashPassword = async (
  password: string | StringFieldUpdateOperationsInput | undefined
) => {
  let p = "";
  if (typeof password === "string") {
    p = await hashValue(password);
  }
  return { password: p };
};

export const profileExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    // client: {},
    query: {
      profile: {
        async create({ model, operation, args, query }) {
          const passwordOptions = await hashPassword(args.data.password);

          const result = await query({
            ...args,
            data: {
              ...args.data,
              ...(!!passwordOptions.password && passwordOptions),
            },
          });
          return result;
        },
        async update({ model, operation, args, query }) {
          const passwordOptions = await hashPassword(args.data.password);

          const result = await query({
            ...args,
            data: {
              ...args.data,
              ...(!!passwordOptions.password && passwordOptions),
            },
          });
          return result;
        },
      },
    },
    model: {
      profile: {},
    },
    result: {
      profile: {
        clientSafe: {
          needs: { id: true, email: true, createdAt: true, updatedAt: true },
          compute(profile) {
            return () => {
              return {
                id: profile.id,
                email: profile.email,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
              };
            };
          },
        },
        comparePassword: {
          needs: { password: true },
          compute(profile) {
            return async (password: string) => {
              return await compareValue(profile.password, password);
            };
          },
        },
      },
    },
  });
});

type ClientSafe = () => {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
type ComparePassword = (password: string) => Promise<boolean>;
export type ExtendedProfile = Profile & {
  comparePassword: ComparePassword;
  clientSafe: ClientSafe;
};
export default profileExtension;
