import { Prisma } from "../generated/prisma/client";
import {} from "../schemas/profile";
import { compareValue } from "../util/bcrypt";

export const profileExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
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
