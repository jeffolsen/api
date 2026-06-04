import { UseTeaserGridBlockData, UseTeaserGridBlockProps } from "../data";
import clsx from "clsx";
import BlockWrapper from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink from "@/utils/getItemLink";
import getImageByPriority from "@/utils/getImageByPriority";
import ResponsiveCard from "@/components/cards/ResponsiveCard";
import Image from "@/components/common/Image";
import Heading from "@/components/common/Heading";
import { InsetLink } from "@/components/common/Link";
import Grid from "@/components/common/Grid";

export default function VariantAlpha({
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
      settings={{ ...blockProps.settings, width: "xl" }}
    >
      <Grid
        className={clsx(["gap-4 md:gap-12"])}
        columns={{ base: "1", sm: "2", lg: "3", xl: "2" }}
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

  return (
    <ResponsiveCard
      className="bg-base-100 shadow-lg h-full card-compact md:card-normal"
      imagery={
        <div className="w-full xl:w-72 from-base-100 to-base-300 bg-gradient-to-b">
          {image && (
            <Image
              url={image.url}
              alt={item.name}
              fit={image.type === "ICON" ? "contain" : "cover"}
              ar="1.5"
              hover="zoom"
            />
          )}
        </div>
      }
      passage={
        <div className="flex flex-col gap-4">
          <Heading
            headingSize="sm"
            headingStyles={clsx([
              "line-clamp-3 uppercase text-center xl:text-left",
            ])}
          >
            {item.name}
          </Heading>
        </div>
      }
      overLay={<>{link && <InsetLink to={link} aria-label={item.name} />}</>}
      changeAt="xl"
    />
  );
}
