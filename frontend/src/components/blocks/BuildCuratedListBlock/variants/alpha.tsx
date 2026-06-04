import { UseCuratedListBlockData, UseCuratedListBlockProps } from "../data";
import clsx from "clsx";
import Block from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink, { getLinkLabel } from "@/utils/getItemLink";
import ResponsiveCard from "@/components/cards/ResponsiveCard";
import Image from "@/components/common/Image";
import Heading, { HeadingLevelProvider } from "@/components/common/Heading";
import CustomLink, { InsetLink } from "@/components/common/Link";
import Grid from "@/components/common/Grid";
import sortItemALlowList from "@/utils/sortItemAllowList";
import Text from "@/components/common/Text";
import { MoveRight } from "lucide-react";

export default function VariantAlpha({
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

  return (
    <Block
      name={blockProps.name}
      settings={{ ...blockProps.settings, width: "xl", padded: false }}
    >
      <HeadingLevelProvider>
        <Grid
          className={clsx(["gap-14"])}
          items={sortedItems.map((item, index) => ({
            id: item.id,
            content: (
              <AlphaCard
                index={index}
                item={item}
                feed={referenceFeedPath}
                theme={theme}
              />
            ),
          }))}
        />
      </HeadingLevelProvider>
    </Block>
  );
}

const AlphaCard = ({
  item,
  feed,
  index,
  theme,
}: {
  item: TItemWithIncludes;
  feed?: string;
  index: number;
  theme: UseCuratedListBlockProps["settings"]["theme"];
}) => {
  const link = getItemLink(feed, item);
  const linkLabel = getLinkLabel(link);

  const image = item.images
    .map(({ image }) => image)
    .filter((img) => img.type === "LANDSCAPE" || img.type === "PORTRAIT")?.[0];

  const reverse = index % 2 === 0;
  const betaTheme = theme === "beta";
  const gammaTheme = theme === "gamma";
  const alphaTheme = theme === "alpha";

  return (
    <div
      className={clsx([
        "flex",
        reverse ? "justify-end pl-14" : "justify-start pr-14",
      ])}
    >
      <div className={clsx(["max-w-6xl w-full"])}>
        <ResponsiveCard
          className={clsx([
            "bg-base-100 shadow-lg card-compact lg:card-normal",
          ])}
          imagery={
            <>
              {image && (
                <div className="w-screen md:w-[36rem] md:!max-w-[50vw]">
                  <Image
                    url={image?.url}
                    alt=""
                    fit="cover"
                    ar="1"
                    hover="zoom"
                  />
                </div>
              )}
            </>
          }
          passage={
            <div
              className={clsx([
                "flex flex-col md:justify-center h-full flex-none",
              ])}
            >
              <div className={clsx(["flex flex-col gap-4 py-4"])}>
                <Heading headingSize="lg" headingStyles="prose line-clamp-2">
                  {item.name}
                </Heading>
                <Text textSize="lg" className="prose line-clamp-3">
                  {item.description}
                </Text>
                {link && (
                  <CustomLink
                    to={link}
                    linkColor="accent"
                    size="xl"
                    className={
                      "flex gap-2 items-center uppercase bold flex-none"
                    }
                  >
                    {!linkLabel ? "Go there" : `${linkLabel}`} <MoveRight />
                  </CustomLink>
                )}
              </div>
            </div>
          }
          underLay={
            <>
              <div
                className={clsx([
                  "w-full h-full translate-y-14",
                  alphaTheme && "bg-neutral",
                  betaTheme && "bg-primary",
                  gammaTheme && "bg-accent",
                  reverse ? " -translate-x-14" : "translate-x-14",
                ])}
              />
            </>
          }
          overLay={<>{link && <InsetLink to={link} />}</>}
          reverseX={reverse}
        />
      </div>
    </div>
  );
};
