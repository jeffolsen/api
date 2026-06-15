import clsx from "clsx";
import { UseTeaserGridBlockData, UseTeaserGridBlockProps } from "../data";
import BlockWrapper from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink from "@/utils/getItemLink";
import getImageByPriority from "@/utils/getImageByPriority";
import VertCard from "@/components/cards/VertCard";
import Image from "@/components/common/Image";
import Heading from "@/components/common/Heading";
import { InsetLink } from "@/components/common/Link";
import Grid from "@/components/common/Grid";

export default function VariantBeta({
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
        className={clsx(["gap-4 md:gap-12"])}
        columns={{ base: "2", sm: "3", lg: "4" }}
        items={(itemsData.data?.items ?? []).map((item, index) => ({
          id: item.id,
          content: (
            <BetaCard
              index={index}
              item={item}
              feed={referenceFeedPath}
              critical={blockProps.settings.critical && index < 4}
            />
          ),
        }))}
      />
    </BlockWrapper>
  );
}

function BetaCard({
  item,
  feed,
  index,
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
    priority: { ICON: 3, PORTRAIT: 1, LANDSCAPE: 2 },
  });

  const reverse = index % 2 === 0;

  return (
    <VertCard
      critical={critical}
      className="bg-base-100 shadow-lg h-full card-compact"
      imagery={
        <div
          className={clsx([
            "w-full from-base-100 to-base-300",
            !reverse ? "bg-gradient-to-t" : "bg-gradient-to-b",
          ])}
        >
          {image && (
            <Image
              url={image?.url}
              alt={item.name}
              fit={image.type === "ICON" ? "contain" : "cover"}
              ar=".66"
              hover="zoom"
            />
          )}
        </div>
      }
      passage={
        <>
          <Heading
            headingSize="sm"
            headingStyles={clsx(["line-clamp-3 uppercase text-center"])}
          >
            {item.name}
          </Heading>
        </>
      }
      overLay={<>{link && <InsetLink to={link} aria-label={item.name} />}</>}
      reverseY={!reverse}
    />
  );
}
