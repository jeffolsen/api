import { Prisma } from "../generated/prisma/client";
import {
  ProfileCreateInput,
  ProfileGetWhere,
  ProfileUpdateInput,
} from "../schemas/profile";
import { compareValue } from "../util/bcrypt";

export const profileExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    query: {
      profile: {
        async create({ model, operation, args, query }) {
          args.data = await ProfileCreateInput.parseAsync(args.data);
          const result = await query(args);
          return result;
        },
        async update({ model, operation, args, query }) {
          args.data = await ProfileUpdateInput.parseAsync(args.data);
          const result = await query(args);
          return result;
        },
        async findUnique({ model, operation, args, query }) {
          args.where = ProfileGetWhere.parse(args.where);
          const result = await query(args);
          return result;
        },
      },
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
              return await compareValue(password, profile.password);
            };
          },
        },
      },
    },
  });
  return newClient;
});

export default profileExtension;
