import Grid from "@/components/common/Grid";
import { UseTeaserGridBlockData, UseTeaserGridBlockProps } from "../data";
import BlockWrapper from "@/components/blocks/Block";
import clsx from "clsx";
import { xsSpacing } from "@/components/common/helpers/layoutStyles";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink from "@/utils/getItemLink";
import getImageByPriority from "@/utils/getImageByPriority";
import VertCard from "@/components/cards/VertCard";
import Image from "@/components/common/Image";
import Heading from "@/components/common/Heading";
import { InsetLink } from "@/components/common/Link";

export default function VariantGamma({
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
    <BlockWrapper
      name={blockProps.name}
      settings={{ ...blockProps.settings, width: "lg" }}
    >
      <Grid
        className={clsx([xsSpacing])}
        columns={{ base: "2", sm: "3", md: "4", lg: "6" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: (
            <GammaCard
              index={index}
              item={item}
              feed={referenceFeedPath}
              critical={blockProps.settings.critical && index < 6}
            />
          ),
        }))}
      />
    </BlockWrapper>
  );
}

function GammaCard({
  item,
  feed,
  critical,
}: {
  index: number;
  item: TItemWithIncludes;
  feed: string | undefined;
  critical?: boolean;
}) {
  const link = getItemLink(feed, item);
  const images = item.images.map(({ image }) => image);

  const image = getImageByPriority({
    images,
    priority: { ICON: 1, PORTRAIT: 2, LANDSCAPE: 3 },
  });

  return (
    <VertCard
      critical={critical}
      className="bg-base-100 shadow-lg h-full card-compact"
      imagery={
        <>
          {image && (
            <Image
              url={image?.url}
              alt={image.alt || item.name}
              fit={image.type === "ICON" ? "contain" : "cover"}
              ar="1"
              hover="zoom"
            />
          )}
        </>
      }
      overLay={
        <>
          {(!image?.url || image.type !== "ICON") && (
            <div className="flex flex-col justify-center h-full w-full p-3 bg-base-100/70">
              <Heading
                headingSize="xs"
                headingStyles={clsx(["line-clamp-2 uppercase text-center"])}
              >
                {item.name}
              </Heading>
            </div>
          )}
          {link && <InsetLink to={link} aria-label={item.name} />}
        </>
      }
    />
  );
}
