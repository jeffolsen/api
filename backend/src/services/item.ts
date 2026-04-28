import prismaClient from "@/db/client";
import throwError from "@/util/throwError";
import { BAD_REQUEST, NOT_FOUND } from "@/config/errorCodes";
import { MESSAGE_ITEM_NOT_FOUND } from "@/config/errorMessages";

export const validateOverridLink = async ({
  overrideLink,
  profileId,
}: {
  overrideLink: string | undefined;
  profileId: number;
}) => {
  const needsALink = !!overrideLink;
  const feed =
    needsALink &&
    (await prismaClient.feed.findFirst({
      where: {
        profileId,
        path: overrideLink,
      },
    }));
  const foundALink = overrideLink && feed;
  throwError(!needsALink || foundALink, BAD_REQUEST, "Link not allowed");
};

export const validateItemExists = async ({
  itemId,
  profileId,
}: {
  itemId: number | string;
  profileId: number;
}) => {
  const item = await prismaClient.item.findFirst({
    where: { id: Number(itemId), authorId: profileId },
  });
  throwError(item, NOT_FOUND, MESSAGE_ITEM_NOT_FOUND);
};
