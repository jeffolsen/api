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
import Link from "@/components/common/Link";
import { clsx } from "clsx";
import { smSpacing, xsSpacing } from "@/components/common/helpers/layoutStyles";
import { TImage } from "@/network/image/types";
import Image from "@/components/common/Image";
import ScrollInFade from "@/components/common/ScrollInFade";
import dayjs, { mediumDate } from "@/utils/dayjs";
import RichContent from "@/components/common/RichContent";
import { JSONContent } from "@tiptap/react";
import sortItemALlowList from "@/utils/sortItemAllowList";
import { MoveRight } from "lucide-react";

export default function Component(config: BlockComponentStandardProps) {
  const result = useCuratedListBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  return <CuratedListBlock blockProps={blockProps} blockData={blockData} />;
}

function CuratedListBlock({
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
    <Block name={blockProps.name} settings={{ ...blockProps.settings }}>
      <HeadingLevelProvider>
        <Grid
          className={clsx(["gap-8 sm:gap-10 md:gap-14"])}
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
  const maxImages = 3;
  const link = getItemLink(feed, item);
  const linkLabel = getLinkLabel(link);

  const images = item.images
    .map(({ image }) => image)
    .filter((img) => img.type === "LANDSCAPE" || img.type === "PORTRAIT")
    .slice(0, maxImages);

  if (images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <ScrollInFade
      className={clsx([
        "flex relative overflow-x-clip",
        index % 2 === 0 ? "justify-end" : "justify-start",
      ])}
    >
      <div
        className={clsx([
          "card md:card-side md:h-[30rem] w-full max-w-6xl flex-none justify-center",
          "bg-base-100 shadow-xl",
          index % 2 === 0 ? "text-right" : "text-left md:flex-row-reverse",
        ])}
      >
        <div className="h-full p-6 md:p-12 flex-grow">
          <div
            className={clsx([
              "flex flex-col md:justify-center gap-4 h-full flex-none",
              index % 2 === 0 ? "items-end" : "items-start",
            ])}
          >
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
                className={"flex gap-2 items-center uppercase bold flex-none"}
              >
                {!linkLabel ? "Go there" : `${linkLabel}`} <MoveRight />
              </Link>
            )}
          </div>
        </div>

        <figure
          className={clsx([
            "w-full md:w-1/2 flex flex-none",
            index % 2 === 0 && "flex-row-reverse",
          ])}
        >
          {images.map((img: TImage, i: number) => {
            return (
              <Image
                key={i}
                src={img.url}
                alt=""
                fit="cover"
                className={clsx([
                  "!h-full",
                  images.length === 2 && i === 0 && "!w-2/3",
                  images.length === 2 && i === 1 && "!w-1/3",
                  images.length === 3 && i === 0 && "!w-[57%]",
                  images.length === 3 && i === 1 && "!w-[29%]",
                  images.length === 3 && i === 2 && "!w-[14%]",
                ])}
              />
            );
          })}
        </figure>

        {theme === "beta" && (
          <div
            className={clsx([
              "absolute inset-0 top-24 -z-10 bg-primary/90",
              index % 2 === 0
                ? "right-1/3 md:right-32 -translate-x-20 translate-y-14 md:translate-y-14"
                : "left-1/3 md:left-32 translate-x-20 translate-y-14 md:translate-y-14",
            ])}
          />
        )}
      </div>
    </ScrollInFade>
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
      settings={{ ...blockProps.settings, padded: false }}
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
}: {
  item: TItemWithIncludes;
  feed?: string;
  index: number;
}) => {
  const maxImages = 1;
  const link = getItemLink(feed, item);
  const images = item.images
    .map(({ image }) => image)
    .filter((img) => img.type === "LANDSCAPE" || img.type === "PORTRAIT")
    .slice(0, maxImages);

  if (images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <ScrollInFade
      className={clsx([
        "card mx-auto",
        "w-[32rem] max-w-full md:card-side md:w-full",
        "bg-base-100 shadow-xl",
      ])}
    >
      <figure className="md:w-72 h-72 md:flex-none">
        {images.map((img: TImage) => {
          return <Image src={img.url} alt="" fit="cover" className="!h-full" />;
        })}
      </figure>
      <div className="card-body md:justify-center">
        <Heading headingSize="md" headingStyles="line-clamp-2 md:line-clamp-1">
          {item.name}
        </Heading>
        <Text textSize="md" className="line-clamp-4 md:line-clamp-2">
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
      </div>
    </ScrollInFade>
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
    <Block {...finalBlockProps} settings={finalBlockSettings}>
      <HeadingLevelProvider>
        <Grid
          className={clsx([
            "grid-rows-auto",
            theme === "alpha" && xsSpacing,
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
