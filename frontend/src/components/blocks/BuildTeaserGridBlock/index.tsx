import { TItemWithIncludes } from "@/network/item/types";
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
import { smSpacing, xsSpacing } from "@/components/common/helpers/layoutStyles";
import Image from "@/components/common/Image";
import Heading from "@/components/common/Heading";
import { InsetLink } from "@/components/common/Link";

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
  const { itemsData, referenceFeedPath } = blockData;
  if (itemsData.isLoading) {
    return null;
  }

  return (
    <BlockWrapper name={blockProps.name} settings={{ ...blockProps.settings }}>
      <Grid
        className={clsx([smSpacing])}
        columns={{ lg: "2" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: (
            <AlphaCard index={index} item={item} feed={referenceFeedPath} />
          ),
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
  item: TItemWithIncludes;
  feed: string | undefined;
}) {
  const link = getItemLink(feed, item);
  const images = item.images.map(({ image }) => image);

  const image = getImageByPriority({
    images,
    priority: { ICON: 3, PORTRAIT: 1, LANDSCAPE: 2 },
  });

  const logo = getImageByPriority({
    images,
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
          "relative md:flex-none w-full sm:w-2/5 before:content-[''] before:mt-[80%] sm:before:mt-[80%] before:w-full",
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
              textSize="md"
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
  const { itemsData, referenceFeedPath } = blockData;
  if (itemsData.isLoading) {
    return null;
  }

  return (
    <BlockWrapper name={blockProps.name} settings={{ ...blockProps.settings }}>
      <Grid
        className={clsx(["gap-0 sm:gap-4 md:gap-12"])}
        columns={{ base: "2", sm: "3", lg: "4" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: (
            <BetaCard index={index} item={item} feed={referenceFeedPath} />
          ),
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
  item: TItemWithIncludes;
  feed: string | undefined;
}) {
  const link = getItemLink(feed, item);
  const images = item.images.map(({ image }) => image);

  const image = getImageByPriority({
    images,
    priority: { ICON: 3, PORTRAIT: 1, LANDSCAPE: 2 },
  });

  return (
    <ScrollInFade
      className={clsx([
        "relative card card-compact group w-full h-full",
        "bg-base-100 shadow-xl items-stretch",
      ])}
    >
      <figure
        className={clsx([
          "relative flex-none w-full before:content-[''] before:mt-[133%] before:w-full",
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
              "absolute inset-0 flex justify-center items-center bg-neutral",
            ])}
            style={{ containerType: "inline-size" }}
          >
            <span
              className={clsx([
                "line-clamp-5 text-justify uppercase break-all font-black",
                "transition-all duration-1000 scale-110 group-hover:scale-125",
                "text-[15cqi]",
                "text-secondary mx-6 !leading-snug !tracking-tighter",
              ])}
            >
              {item.name}
            </span>
          </div>
        )}
      </figure>
      <div className="card-body text-left gap-4">
        <Heading
          headingSize="sm"
          headingStyles={clsx([
            "line-clamp-1 uppercase",
            "transition-all duration-1000 scale-100 group-hover:scale-110",
          ])}
        >
          {item.name}
        </Heading>
        <Text
          textSize="sm"
          className={clsx([
            "line-clamp-2 uppercase",
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
  const { itemsData, referenceFeedPath } = blockData;
  if (itemsData.isLoading) {
    return null;
  }

  return (
    <BlockWrapper name={blockProps.name} settings={{ ...blockProps.settings }}>
      <Grid
        className={clsx([xsSpacing])}
        columns={{ base: "2", sm: "3", md: "4", lg: "6" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: (
            <GammaCard index={index} item={item} feed={referenceFeedPath} />
          ),
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
  item: TItemWithIncludes;
  feed: string | undefined;
}) {
  const link = getItemLink(feed, item);
  const images = item.images.map(({ image }) => image);

  const image = getImageByPriority({
    images,
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
