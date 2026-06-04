import Grid from "@/components/common/Grid";
import { UseCuratedListBlockData, UseCuratedListBlockProps } from "../data";
import Block from "@/components/blocks/Block";
import clsx from "clsx";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink from "@/utils/getItemLink";
import VertCard from "@/components/cards/VertCard";
import Heading, { HeadingLevelProvider } from "@/components/common/Heading";
import CustomLink from "@/components/common/Link";
import sortItemALlowList from "@/utils/sortItemAllowList";
import Text from "@/components/common/Text";
import { MoveRight } from "lucide-react";
import dayjs, { mediumDate } from "@/utils/dayjs";
import RichContent from "@/components/common/RichContent";
import type { JSONContent } from "@tiptap/core";

export default function VariantGamma({
  blockData,
  blockProps,
}: {
  blockProps: UseCuratedListBlockProps;
  blockData: UseCuratedListBlockData;
}) {
  const { itemsData, referenceFeedPath } = blockData;
  if (itemsData.isLoading) {
    return null;
  }

  const sortedItems = sortItemALlowList({
    items: itemsData.data?.items ?? [],
    itemSlugs: blockData.itemOrder,
  });

  const theme = blockProps.settings.theme;

  const finalBlockSettings = {
    ...blockProps.settings,
  };

  const finalBlockProps = {
    ...blockProps,
  };

  return (
    <Block
      {...finalBlockProps}
      settings={{ ...finalBlockSettings, width: "md" }}
    >
      <HeadingLevelProvider>
        <Grid
          className={clsx([
            theme === "alpha" && "grid-rows-auto gap-4",
            theme === "beta" && "bg-base-100 shadow-lg",
          ])}
          items={sortedItems.map((item, index) => ({
            id: item.id,
            content: (
              <>
                <GammaCard
                  index={index}
                  item={item}
                  feed={referenceFeedPath}
                  theme={theme}
                />
                {theme === "beta" && index < sortedItems.length - 1 && (
                  <div className="absolute bottom-0 left-6 right-6 border-b border-base-content" />
                )}
              </>
            ),
          }))}
        />
      </HeadingLevelProvider>
    </Block>
  );
}

const GammaCard = ({
  item,
  feed,
  theme,
}: {
  item: TItemWithIncludes;
  feed?: string;
  index: number;
  theme: UseCuratedListBlockProps["settings"]["theme"];
}) => {
  const link = getItemLink(feed, item);
  const date = item.dateRanges?.[0] ?? null;

  const alphaTheme = theme === "alpha";
  const betaTheme = theme === "beta";

  return (
    <VertCard
      className={clsx([
        "card card-compact sm:card-normal w-full flex-none justify-center h-full",
        alphaTheme && "bg-base-100 shadow-xl text-base-content",
        betaTheme && "bg-base-100 text-base-content py-8",
      ])}
      passage={
        <div className={clsx(["flex flex-col gap-5"])}>
          <Heading
            headingSize="md"
            headingStyles="font-bold"
            headingDecorator={alphaTheme ? "right-strike" : "none"}
          >
            {item.name}
          </Heading>
          {date && (
            <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between flex-wrap">
              <Text
                textSize="md"
                className="text-left text-accent uppercase font-semibold prose"
              >
                {date.description}
              </Text>
              {date.startAt && date.endAt && (
                <Text
                  textSize="md"
                  className="md:text-right font-bold bg-secondary text-secondary-content py-1 px-3 flex-none"
                >
                  {dayjs(date.startAt).format(mediumDate)} ---{" "}
                  {dayjs(date.endAt).format(mediumDate)}
                </Text>
              )}
            </div>
          )}
          {(item.richContent?.content as unknown as JSONContent) ? (
            <RichContent
              richContent={item.richContent as Record<string, unknown>}
            />
          ) : (
            item.description && <Text textSize="md">{item.description}</Text>
          )}
          {link && (
            <CustomLink
              as="Link"
              to={link}
              linkColor="accent"
              className={"flex gap-2"}
            >
              Go <MoveRight />
            </CustomLink>
          )}
        </div>
      }
    />
  );
};
