import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import useCuratedListBlockData, {
  UseCuratedListBlockData,
  UseCuratedListBlockProps,
} from "@/components/blocks/BuildCuratedListBlock/data";
import Text from "@/components/common/Text";
import Heading, { HeadingLevelProvider } from "@/components/common/Heading";
import Grid from "@/components/common/Grid";
import getItemLink, { getLinkLabel } from "@/utils/getItemLink";
import { TItemWithIncludes } from "@/network/item/types";
import Link, { InsetLink } from "@/components/common/Link";
import { clsx } from "clsx";
import { smSpacing } from "@/components/common/helpers/layoutStyles";
import Image from "@/components/common/Image";
import ScrollInFade from "@/components/common/ScrollInFade";
import dayjs, { mediumDate } from "@/utils/dayjs";
import RichContent from "@/components/common/RichContent";
import { JSONContent } from "@tiptap/react";
import sortItemALlowList from "@/utils/sortItemAllowList";
import { MoveRight } from "lucide-react";
import HorizCard from "@/components/cards/HorizCard";
import ResponsiveCard from "@/components/cards/ResponsiveCard";

export default function Component(config: BlockComponentStandardProps) {
  const result = useCuratedListBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  return <CuratedListBlock blockProps={blockProps} blockData={blockData} />;
}

export function CuratedListBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseCuratedListBlockProps;
  blockData: UseCuratedListBlockData;
}) {
  const { settings } = blockProps;
  const { variant } = settings;

  if (variant === "alpha") {
    return <VariantAlpha blockData={blockData} blockProps={blockProps} />;
  }

  if (variant === "beta") {
    return <VariantBeta blockData={blockData} blockProps={blockProps} />;
  }

  if (variant === "gamma") {
    return <VariantGamma blockData={blockData} blockProps={blockProps} />;
  }

  return (
    <Block {...blockProps}>
      <Text textSize="md">Not implemented</Text>
    </Block>
  );
}

function VariantAlpha({
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
                  <Link
                    to={link}
                    linkColor="accent"
                    size="xl"
                    className={
                      "flex gap-2 items-center uppercase bold flex-none"
                    }
                  >
                    {!linkLabel ? "Go there" : `${linkLabel}`} <MoveRight />
                  </Link>
                )}
              </div>
            </div>
          }
          underLay={
            <>
              {(betaTheme || gammaTheme) && (
                <div
                  className={clsx([
                    "w-full h-full translate-y-14",
                    betaTheme && "bg-primary",
                    gammaTheme && "bg-accent",
                    reverse ? " -translate-x-14" : "translate-x-14",
                  ])}
                />
              )}
            </>
          }
          overLay={<>{link && <InsetLink to={link} />}</>}
          reverseX={reverse}
        />
      </div>
    </div>
  );
};

function VariantBeta({
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
  return (
    <Block
      name={blockProps.name}
      settings={{ ...blockProps.settings, padded: false, width: "md" }}
    >
      <HeadingLevelProvider>
        <Grid
          className={clsx([smSpacing])}
          items={(itemsData.data?.items ?? []).map((item, index) => ({
            id: item.id,
            content: (
              <BetaCard index={index} item={item} feed={referenceFeedPath} />
            ),
          }))}
        />
      </HeadingLevelProvider>
    </Block>
  );
}

const BetaCard = ({
  item,
  feed,
  index,
}: {
  item: TItemWithIncludes;
  feed?: string;
  index: number;
}) => {
  const link = getItemLink(feed, item);
  const image = item.images
    .map(({ image }) => image)
    .filter((img) => img.type === "LANDSCAPE" || img.type === "PORTRAIT")?.[0];

  return (
    <HorizCard
      className={"bg-base-100 shadow-lg card-compact md:card-normal"}
      imagery={
        <>
          {image && (
            <div className="w-36 md:w-48">
              <Image url={image?.url} alt="" fit="cover" ar="1" />
            </div>
          )}
        </>
      }
      passage={
        <>
          <Heading
            headingSize="md"
            headingStyles="line-clamp-1 md:line-clamp-2"
          >
            {item.name}
          </Heading>
          <Text textSize="md" className="line-clamp-2 md:line-clamp-3">
            {item.description}
          </Text>
          {link && (
            <Link
              as="Link"
              to={link}
              linkColor="accent"
              size="xl"
              className={"flex gap-2"}
            >
              Go <MoveRight />
            </Link>
          )}
        </>
      }
      reverseX={index % 2 === 0}
    />
  );
};

function VariantGamma({
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
            "grid-rows-auto gap-4",
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
                  <div className="absolute bottom-0 left-12 right-12 border-b border-base-content" />
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

  return (
    <ScrollInFade
      className={clsx([
        "card card-compact sm:card-normal w-full flex-none justify-center h-full",
        theme === "alpha" && "bg-base-100 shadow-xl text-base-content",
        theme === "beta" && "bg-base-100 text-base-content py-8",
      ])}
    >
      <div className={clsx(["card-body gap-5"])}>
        <div className="flex flex-col gap-3">
          <Heading
            headingSize="md"
            headingStyles="font-bold"
            headingDecorator={theme === "alpha" ? "right-strike" : "none"}
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
        </div>
        {(item.richContent?.content as unknown as JSONContent) ? (
          <RichContent
            richContent={item.richContent as Record<string, unknown>}
          />
        ) : (
          item.description && <Text textSize="md">{item.description}</Text>
        )}
        {link && (
          <Link as="Link" to={link} linkColor="accent" className={"flex gap-2"}>
            Go <MoveRight />
          </Link>
        )}
      </div>
    </ScrollInFade>
  );
};
