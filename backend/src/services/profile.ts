import prismaClient from "@/db/client";
import { ProfileGetPayload } from "@/generated/prisma/models";

export const findProfileWithReceipt = (
  where: { id: number } | { email: string },
) =>
  prismaClient.profile.findUnique({ where, include: { profileReceipt: true } });

export const hasLegalRequirements = (
  profile: ProfileGetPayload<{ include: { profileReceipt: true } }>,
) =>
  profile?.profileReceipt?.consentToTermsAt &&
  profile?.profileReceipt?.consentToPrivacyAt &&
  profile?.profileReceipt?.verifiedAgeAt;

export const hasConfirmedEmail = (
  profile: ProfileGetPayload<{ include: { profileReceipt: true } }>,
) => profile?.profileReceipt?.verifiedEmailAt;
