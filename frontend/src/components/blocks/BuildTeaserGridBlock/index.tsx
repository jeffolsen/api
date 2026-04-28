import { TFeed } from "@/network/feed";
import { TItem } from "@/network/item";
import Text from "@/components/common/Text";
import BlockWrapper, {
  BlockComponentStandardProps,
} from "@/components/blocks/Block";
import useTeaserGridBlockData, {
  UseTeaserGridBlockData,
  UseTeaserGridBlockProps,
} from "@/components/blocks/BuildTeaserGridBlock/data";
import Grid from "@/components/common/Grid";
import clsx from "clsx";
import {
  smSpacing,
  smVerticalPadding,
  xsSpacing,
} from "@/components/common/helpers/layoutStyles";
import Image from "@/components/common/Image";
import Heading from "@/components/common/Heading";
import { InsetLink } from "@/components/common/Link";
import { useGetAppItemImages } from "@/network/app";
import getItemLink from "@/utils/getItemLink";
import getImageByPriority from "@/utils/getImageByPriority";
import ScrollInFade from "@/components/common/ScrollInFade";

export default function Component(config: BlockComponentStandardProps) {
  const result = useTeaserGridBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  return <TeaserGridBlock blockProps={blockProps} blockData={blockData} />;
}

function TeaserGridBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseTeaserGridBlockProps;
  blockData: UseTeaserGridBlockData;
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
    <BlockWrapper {...blockProps}>
      <Text textSize="md">Not implemented</Text>
    </BlockWrapper>
  );
}

function VariantAlpha({
  blockData,
  blockProps,
}: {
  blockData: UseTeaserGridBlockData;
  blockProps: UseTeaserGridBlockProps;
}) {
  const { itemsData, referenceFeedData } = blockData;
  if (itemsData.isLoading || referenceFeedData?.isLoading) {
    return null;
  }
  const feed = referenceFeedData?.data?.feed;

  return (
    <BlockWrapper
      name={blockProps.name + " - Alpha Variant"}
      settings={{ ...blockProps.settings }}
    >
      <Grid
        className={clsx([smSpacing, smVerticalPadding])}
        columns={{ lg: "2" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: <AlphaCard index={index} item={item} feed={feed} />,
        }))}
      />
    </BlockWrapper>
  );
}

function AlphaCard({
  item,
  feed,
}: {
  index: number;
  item: TItem;
  feed: TFeed | undefined;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feed, item.id);

  if (getImages.isLoading) {
    return <div className="skeleton w-full h-full" />;
  }

  const image = getImageByPriority({
    images: getImages?.data?.images || [],
    priority: { ICON: 3, PORTRAIT: 1, LANDSCAPE: 2 },
  });

  const logo = getImageByPriority({
    images: getImages?.data?.images || [],
    priority: { ICON: 1, PORTRAIT: 0, LANDSCAPE: 0 },
  });

  return (
    <ScrollInFade
      className={clsx([
        "card sm:card-side card-compact md:card-normal group w-full relative",
        "bg-base-100 shadow-xl items-stretch overflow-hidden",
      ])}
    >
      {logo && (
        <div
          style={{
            backgroundImage: `url(${logo.url})`,
            backgroundRepeat: "no-repeat",
            backgroundPositionY: "50%",
            backgroundPositionX: "50%",
          }}
          className={clsx([
            "absolute inset-0 w-full h-full bg-contain scale-130 translate-x-1/2 translate-y-1/3",
            "grayscale brightness-0 contrast-0 opacity-15",
          ])}
        />
      )}
      <figure
        className={clsx([
          "relative md:flex-none w-full sm:w-2/5 before:content-[''] before:mt-[70%] sm:before:mt-[170%] before:w-full",
          "overflow-hidden z-10",
        ])}
      >
        {image ? (
          <Image
            src={image?.url || ""}
            alt={item.name}
            fit={image.type === "ICON" ? "contain" : "cover"}
            className={clsx([
              "absolute inset-0 w-full h-full",
              "transition-all duration-1000 scale-100 group-hover:scale-110",
              image.type === "ICON" ? "p-6" : "",
            ])}
          />
        ) : (
          <div
            className={clsx([
              "absolute inset-0 flex justify-center items-center p-3",
              image
                ? "bg-gradient-to-t from-transparent via-black/80"
                : "bg-base-300",
            ])}
          >
            <Text
              textSize="sm"
              className={clsx([
                "line-clamp-2 text-center uppercase",
                "transition-all duration-1000 scale-100 group-hover:scale-110",
                image
                  ? "drop-shadow-lg shadow-black text-primary-content"
                  : "text-base-content",
              ])}
            >
              {item.name}
            </Text>
          </div>
        )}
        {link && <InsetLink to={link} aria-label={item.name} />}
      </figure>
      <div className="card-body z-10">
        <Heading
          headingSize="xs"
          headingStyles={clsx([
            "line-clamp-2 uppercase",
            "transition-all duration-1000 scale-100 group-hover:scale-110",
          ])}
        >
          {item.name}
        </Heading>
      </div>
    </ScrollInFade>
  );
}

function VariantBeta({
  blockData,
  blockProps,
}: {
  blockData: UseTeaserGridBlockData;
  blockProps: UseTeaserGridBlockProps;
}) {
  const { itemsData, referenceFeedData } = blockData;
  if (itemsData.isLoading || referenceFeedData?.isLoading) {
    return null;
  }
  const feed = referenceFeedData?.data?.feed;

  return (
    <BlockWrapper
      name={blockProps.name + " - Beta Variant"}
      settings={{ ...blockProps.settings }}
    >
      <Grid
        className={clsx([smSpacing, smVerticalPadding])}
        columns={{ sm: "2", lg: "3" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: <BetaCard index={index} item={item} feed={feed} />,
        }))}
      />
    </BlockWrapper>
  );
}

function BetaCard({
  item,
  feed,
}: {
  index: number;
  item: TItem;
  feed: TFeed | undefined;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feed, item.id);

  if (getImages.isLoading) {
    return <div className="skeleton w-full h-full" />;
  }

  const image = getImageByPriority({
    images: getImages?.data?.images || [],
    priority: { ICON: 3, PORTRAIT: 1, LANDSCAPE: 2 },
  });

  return (
    <ScrollInFade
      className={clsx([
        "relative card card-compact md:card-normal group w-full h-full",
        "bg-base-100 shadow-xl items-stretch",
      ])}
    >
      <figure
        className={clsx([
          "relative flex-none w-full before:content-[''] before:mt-[50%] before:w-full",
          "overflow-hidden",
        ])}
      >
        {image ? (
          <Image
            src={image?.url || ""}
            alt={item.name}
            fit={image.type === "ICON" ? "contain" : "cover"}
            className={clsx([
              "absolute inset-0 w-full h-full",
              "transition-all duration-1000 scale-100 group-hover:scale-110",
              image.type === "ICON" ? "p-6" : "",
            ])}
          />
        ) : (
          <div
            className={clsx([
              "absolute inset-0 flex justify-center items-center p-3 bg-base-300",
            ])}
          >
            <Text
              textSize="sm"
              className={clsx([
                "line-clamp-2 text-center uppercase",
                "transition-all duration-1000 scale-100 group-hover:scale-110",
                "text-base-content",
              ])}
            >
              {item.name}
            </Text>
          </div>
        )}
      </figure>
      <div className="card-body text-left gap-8">
        <Heading
          headingSize="sm"
          headingStyles={clsx([
            "line-clamp-2 uppercase",
            "transition-all duration-1000 scale-100 group-hover:scale-110",
          ])}
        >
          {item.name}
        </Heading>
        <Text
          textSize="sm"
          className={clsx([
            "line-clamp-3 uppercase",
            "transition-all duration-1000 scale-100 group-hover:scale-110",
          ])}
        >
          {item.description}
        </Text>
      </div>
      {link && <InsetLink to={link} aria-label={item.name} />}
    </ScrollInFade>
  );
}

function VariantGamma({
  blockData,
  blockProps,
}: {
  blockData: UseTeaserGridBlockData;
  blockProps: UseTeaserGridBlockProps;
}) {
  const { itemsData, referenceFeedData } = blockData;
  if (itemsData.isLoading || referenceFeedData?.isLoading) {
    return null;
  }
  const feed = referenceFeedData?.data?.feed;

  return (
    <BlockWrapper
      name={blockProps.name + " - Gamma Variant"}
      settings={{ ...blockProps.settings }}
    >
      <Grid
        className={clsx([xsSpacing, smVerticalPadding])}
        columns={{ sm: "2", md: "3", lg: "4", xl: "5" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: <GammaCard index={index} item={item} feed={feed} />,
        }))}
      />
    </BlockWrapper>
  );
}

function GammaCard({
  item,
  feed,
}: {
  index: number;
  item: TItem;
  feed: TFeed | undefined;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feed, item.id);

  if (getImages.isLoading) {
    return <div className="skeleton w-full h-full" />;
  }

  const image = getImageByPriority({
    images: getImages?.data?.images || [],
    priority: { ICON: 1, PORTRAIT: 2, LANDSCAPE: 3 },
  });

  return (
    <ScrollInFade
      className={clsx([
        "relative w-full pb-[100%]",
        "bg-base-100 shadow-xl",
        "group overflow-hidden",
      ])}
    >
      {image && (
        <Image
          src={image?.url || ""}
          alt={item.name}
          fit={image.type === "ICON" ? "contain" : "cover"}
          className={clsx([
            "absolute inset-0 w-full h-full",
            "transition-all duration-1000 scale-100 group-hover:scale-110",
            image.type === "ICON" ? "p-6" : "opacity-50",
          ])}
        />
      )}
      {image?.type !== "ICON" && (
        <div
          className={clsx([
            "absolute inset-0 flex justify-center items-center p-3",
            image ? "bg-gradient-to-t from-transparent via-black/80" : "",
          ])}
        >
          <Heading
            headingSize="xs"
            headingStyles={clsx([
              "line-clamp-2 text-center uppercase",
              "transition-all duration-1000 scale-100 group-hover:scale-110",
              image
                ? "drop-shadow-lg shadow-black text-primary-content"
                : "text-base-content",
            ])}
          >
            {item.name}
          </Heading>
        </div>
      )}
      {link && <InsetLink to={link} aria-label={item.name} />}
    </ScrollInFade>
  );
}
