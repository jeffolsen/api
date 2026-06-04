import clsx from "clsx";
import { UseCuratedListBlockData, UseCuratedListBlockProps } from "../data";
import Block from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink from "@/utils/getItemLink";
import Image from "@/components/common/Image";
import Heading, { HeadingLevelProvider } from "@/components/common/Heading";
import CustomLink from "@/components/common/Link";
import Grid from "@/components/common/Grid";
import { smSpacing } from "@/components/common/helpers/layoutStyles";
import HorizCard from "@/components/cards/HorizCard";
import Text from "@/components/common/Text";
import { MoveRight } from "lucide-react";

export default function VariantBeta({
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
            <CustomLink
              as="Link"
              to={link}
              linkColor="accent"
              size="xl"
              className={"flex gap-2"}
            >
              Go <MoveRight />
            </CustomLink>
          )}
        </>
      }
      reverseX={index % 2 === 0}
    />
  );
};
