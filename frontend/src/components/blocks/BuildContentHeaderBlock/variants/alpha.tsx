import { UseContentHeaderBlockData, UseContentHeaderBlockProps } from "../data";
import clsx from "clsx";
import Block from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink, { getLinkLabel } from "@/utils/getItemLink";
import Heading from "@/components/common/Heading";
import Text from "@/components/common/Text";
import { MoveRight } from "lucide-react";
import ScrollInFade from "@/components/common/ScrollInFade";
import Button from "@/components/common/Button";

export default function VariantAlpha({
  blockData,
  blockProps,
}: {
  blockProps: UseContentHeaderBlockProps;
  blockData: UseContentHeaderBlockData;
}) {
  const { itemsData, referenceFeedPath } = blockData;
  const item = itemsData?.data?.items?.[0];

  if (itemsData.isLoading || !item) {
    return null;
  }

  const theme = blockProps.settings.theme;
  const finalBlockSettings = {
    ...blockProps.settings,
    ...(theme === "beta" && {
      themeCss: "bg-base-100 text-base-content",
    }),
  };

  const finalBlockProps = {
    ...blockProps,
  };

  return (
    <Block
      {...finalBlockProps}
      settings={{ ...finalBlockSettings, width: "xl" }}
    >
      <AlphaCard
        item={item}
        feed={referenceFeedPath}
        theme={theme}
        critical={blockProps.settings.critical}
      />
    </Block>
  );
}

const AlphaCard = ({
  item,
  feed,
  theme,
  critical,
}: {
  item: TItemWithIncludes;
  theme: UseContentHeaderBlockProps["settings"]["theme"];
  feed?: string;
  critical?: boolean;
}) => {
  const link = getItemLink(feed, item);
  const linkLabel = getLinkLabel(link);

  return (
    <ScrollInFade
      className={clsx([
        "card card-compact sm:card-normal w-full flex-none justify-center h-full py-2",
        theme === "alpha" && "bg-base-100 shadow-xl text-base-content",
        theme === "beta" && "bg-transparent text-base-content font-extrabold",
        // theme === "alpha" && "bg-base-100 shadow-xl",
      ])}
      critical={critical}
    >
      <div className="card-body gap-8  text-center items-center">
        <Heading
          headingSize="md"
          headingStyles={clsx([
            "font-bold uppercase  w-full",
            theme === "alpha" && "text-accent",
            theme === "beta" && "text-primary w-full",
          ])}
          headingDecorator={theme === "alpha" ? "strike" : "none"}
        >
          {item.name}
        </Heading>

        {item.description && (
          <Text textSize="lg" className="whitespace-pre-line prose">
            {item.description}
          </Text>
        )}
        {link && (
          <Button
            as="Link"
            to={link}
            color={theme === "alpha" ? "primary" : "accent"}
            size="lg"
          >
            Go {!!linkLabel && `to ${linkLabel}`} <MoveRight />
          </Button>
        )}
      </div>
    </ScrollInFade>
  );
};
