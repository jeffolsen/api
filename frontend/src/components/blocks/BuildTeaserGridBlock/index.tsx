import { TFeed } from "../../../network/feed";
import { TItem } from "../../../network/item";
import { TImage } from "../../../network/image";
import Text from "../../common/Text";
import BlockWrapper, { BlockComponentStandardProps } from "../Block";
import useTeaserGridBlockData, {
  UseTeaserGridBlockData,
  UseTeaserGridBlockProps,
} from "./data";
import Grid from "../../common/Grid";
import clsx from "clsx";
import {
  mainSpacing,
  smVerticalPadding,
  xsSpacing,
} from "../../common/helpers/layoutStyles";
import Image from "../../common/Image";
import Heading from "../../common/Heading";
import { InsetLink } from "../../common/Link";
import { useGetAppItemImages } from "../../../network/app";
import getItemLink from "../../../utils/getItemLink";

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
  const feedPath = (referenceFeedData?.data as TFeed)?.path;

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <BlockWrapper
      name={blockProps.name + " - Alpha Variant"}
      settings={{ ...blockProps.settings }}
    >
      <Grid
        className={clsx([mainSpacing, smVerticalPadding])}
        columns={{ md: "2" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: <AlphaCard index={index} item={item} feedPath={feedPath} />,
        }))}
      />
    </BlockWrapper>
  );
}

function AlphaCard({
  item,
  feedPath,
}: {
  index: number;
  item: TItem;
  feedPath: string;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feedPath, item.id);
  const image = getImages?.data?.images?.find(
    (img: TImage) => img.type === "LANDSCAPE",
  );

  if (getImages.isLoading || getImages.data.images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={image?.url || ""}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <Heading
        headingSize="xs"
        headingStyles="text-neutral absolute bottom-6 left-6"
      >
        {item.name}
      </Heading>
      {link && <InsetLink to={link} aria-label={item.name} />}
    </div>
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
  const feedPath = (referenceFeedData?.data as TFeed)?.path;

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <BlockWrapper
      name={blockProps.name + " - Beta Variant"}
      settings={{ ...blockProps.settings }}
    >
      <Grid
        className={clsx([mainSpacing, smVerticalPadding])}
        columns={{ sm: "2", lg: "3" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: <BetaCard index={index} item={item} feedPath={feedPath} />,
        }))}
      />
    </BlockWrapper>
  );
}

function BetaCard({
  item,
  feedPath,
}: {
  index: number;
  item: TItem;
  feedPath: string;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feedPath, item.id);
  const image = getImages?.data?.images?.find(
    (img: TImage) => img.type === "LANDSCAPE",
  );

  if (getImages.isLoading || getImages.data.images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={image?.url || ""}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <Heading
        headingSize="xs"
        headingStyles="text-neutral absolute bottom-6 left-6"
      >
        {item.name}
      </Heading>
      {link && <InsetLink to={link} aria-label={item.name} />}
    </div>
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
  const feedPath = (referenceFeedData?.data as TFeed)?.path;

  if (itemsData.isLoading) {
    return null;
  }

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
          content: <GammaCard index={index} item={item} feedPath={feedPath} />,
        }))}
      />
    </BlockWrapper>
  );
}

function GammaCard({
  item,
  feedPath,
}: {
  index: number;
  item: TItem;
  feedPath: string;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feedPath, item.id);
  const image = getImages?.data?.images?.find(
    (img: TImage) => img.type === "ICON" || img.type === "PORTRAIT",
  );

  if (getImages.isLoading || getImages.data.images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <div className="relative max-w-full max-h-full h-72 w-72">
      <Image
        src={image?.url || ""}
        alt={item.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <Heading
        headingSize="xs"
        headingStyles="text-neutral absolute line-clamp-1 inset-0"
      >
        {item.name}
      </Heading>
      {link && <InsetLink to={link} aria-label={item.name} />}
    </div>
  );
}
