import prismaClient from "@/db/client";

export const findProfileWithReceipt = (
  where: { id: number } | { email: string },
) =>
  prismaClient.profile.findUnique({ where, include: { profileReceipt: true } });
