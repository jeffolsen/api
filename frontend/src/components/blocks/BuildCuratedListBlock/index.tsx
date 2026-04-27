import { TFeed } from "@/network/feed";
import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import useCuratedListBlockData, {
  UseCuratedListBlockData,
  UseCuratedListBlockProps,
} from "@/components/blocks/BuildCuratedListBlock/data";
import Text from "@/components/common/Text";
import Heading from "@/components/common/Heading";
import Grid from "@/components/common/Grid";
import getItemLink from "@/utils/getItemLink";
import { TItem } from "@/network/item";
import Link from "@/components/common/Link";
import { clsx } from "clsx";
import {
  mainSpacing,
  smSpacing,
  smVerticalPadding,
  xsVerticalPadding,
} from "@/components/common/helpers/layoutStyles";
import { useGetAppItemImages } from "@/network/app";
import { TImage } from "@/network/image";
import Image from "@/components/common/Image";
import ScrollInFade from "@/components/common/ScrollInFade";

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
  const { itemsData, referenceFeedData } = blockData;
  const feedPath = (referenceFeedData?.data as TFeed)?.path;

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block
      name={blockProps.name + " - Alpha Variant"}
      settings={{ ...blockProps.settings }}
    >
      <Grid
        className={clsx([mainSpacing, smVerticalPadding])}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: <AlphaCard index={index} item={item} feedPath={feedPath} />,
        }))}
      />
    </Block>
  );
}

const AlphaCard = ({
  item,
  feedPath,
  index,
}: {
  item: TItem;
  feedPath?: string;
  index: number;
}) => {
  const maxImages = 3;
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feedPath, item.id);
  const images = getImages?.data?.images
    ?.filter(
      (img: TImage) => img.type === "LANDSCAPE" || img.type === "PORTRAIT",
    )
    .slice(0, maxImages);

  if (getImages.isLoading || getImages.data.images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <ScrollInFade
      className={clsx([
        "flex",
        index % 2 === 0 ? "justify-end" : "justify-start",
      ])}
    >
      <div
        className={clsx([
          "card md:card-side h-[30rem] w-full max-w-4xl flex-none justify-center",
          "bg-base-100 shadow-xl",
          index % 2 === 0 ? "md:flex-row-reverse text-right" : "text-left",
        ])}
      >
        <figure
          className={clsx([
            "w-full md:w-1/2 flex flex-none",
            index % 2 === 0 && "flex-row-reverse",
          ])}
        >
          {images.map((img: TImage, i: number) => {
            return (
              <Image
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
        <div className="card-body md:justify-center">
          <Heading headingSize="md">{item.name}</Heading>
          <Text textSize="md" className="line-clamp-2">
            {item.description}
          </Text>
          {link && (
            <Link as="Link" to={link}>
              Goto Item
            </Link>
          )}
        </div>
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
  const { itemsData, referenceFeedData } = blockData;
  const feedPath = (referenceFeedData?.data as TFeed)?.path;

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block
      name={blockProps.name + " - Beta Variant"}
      settings={{ ...blockProps.settings, padded: false }}
    >
      <Grid
        className={clsx([mainSpacing, smVerticalPadding])}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: <BetaCard index={index} item={item} feedPath={feedPath} />,
        }))}
      />
    </Block>
  );
}

const BetaCard = ({
  item,
  feedPath,
}: {
  item: TItem;
  feedPath?: string;
  index: number;
}) => {
  const maxImages = 1;
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feedPath, item.id);
  const images = getImages?.data?.images
    ?.filter(
      (img: TImage) => img.type === "LANDSCAPE" || img.type === "PORTRAIT",
    )
    .slice(0, maxImages);

  if (getImages.isLoading || getImages.data.images.length === 0) {
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
          <Link as="Link" to={link}>
            Goto Item
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
  const { itemsData, referenceFeedData } = blockData;
  const feedPath = (referenceFeedData?.data as TFeed)?.path;
  console.log("feedPath", feedPath);

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block
      name={blockProps.name + " - Alpha Variant"}
      settings={{ ...blockProps.settings }}
    >
      <Grid
        className={clsx([smSpacing, xsVerticalPadding, "auto-rows-auto"])}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: <GammaCard index={index} item={item} feedPath={feedPath} />,
        }))}
      />
    </Block>
  );
}

const GammaCard = ({
  item,
  feedPath,
}: {
  item: TItem;
  feedPath?: string;
  index: number;
}) => {
  const link = getItemLink(feedPath, item.id);

  return (
    <ScrollInFade
      className={clsx([
        "card w-full flex-none justify-center h-full",
        "bg-base-100 shadow-xl",
      ])}
    >
      <div className="card-body">
        <Heading headingSize="sm">{item.name}</Heading>
        <Text textSize="sm" className="line-clamp-2">
          {item.description}
        </Text>
        {link && (
          <Link as="Link" to={link}>
            Goto Item
          </Link>
        )}
      </div>
    </ScrollInFade>
  );
};
