import { UseContentHeaderBlockData, UseContentHeaderBlockProps } from "../data";
import clsx from "clsx";
import Block from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink, { getLinkLabel } from "@/utils/getItemLink";
import Heading from "@/components/common/Heading";
import Text from "@/components/common/Text";
import { MoveRight } from "lucide-react";
import ScrollInFade from "@/components/common/ScrollInFade";
import RichContent from "@/components/common/RichContent";
import { JSONContent } from "@tiptap/react";
import { TTag } from "@/network/tag/types";
import CustomLink from "@/components/common/Link";

export default function VariantGamma({
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
      themeCss: "!gap-0",
    }),
  };

  const finalBlockProps = {
    ...blockProps,
  };

  return (
    <Block
      {...finalBlockProps}
      settings={{ ...finalBlockSettings, width: "md" }}
    >
      <GammaCard
        item={item}
        feed={referenceFeedPath}
        theme={theme}
        critical={blockProps.settings.critical}
      />
    </Block>
  );
}

const GammaCard = ({
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
  const tags = item?.tags.map(({ tag }) => tag) ?? [];
  const linkLabel = getLinkLabel(link);

  return (
    <ScrollInFade
      className={clsx([
        "card card-compact sm:card-normal w-full flex-none justify-center h-full text-left",
        theme === "alpha" && "bg-base-100 shadow-xl",
      ])}
      critical={critical}
    >
      <div
        className={clsx([
          "card-body text-base-content",
          theme === "alpha" && "gap-5",
          theme === "beta" && " gap-5",
        ])}
      >
        <div className="flex flex-col">
          <Heading
            headingSize="md"
            headingStyles={clsx([
              "font-bold",
              theme === "beta" && "text-center",
            ])}
            headingDecorator={theme === "alpha" ? "right-strike" : "none"}
          >
            {item.name}
          </Heading>
        </div>

        {item.description && (
          <Text textSize="md" className="italic uppercase font-semibold">
            {item.description}
          </Text>
        )}
        {(item.description ||
          (item.richContent?.content as unknown as JSONContent)) && (
          <hr
            className={clsx([
              "border-t border-base-content border-[1.5px]",
              theme === "beta" && "mt-4 mb-8",
            ])}
          />
        )}
        {(item.richContent?.content as unknown as JSONContent) && (
          <RichContent richContent={item.richContent} />
        )}

        <div
          className={clsx([
            "flex flex-wrap gap-3",
            (theme === "alpha" || theme === "beta") && "justify-start",
          ])}
        >
          {tags.map((tag: TTag) => (
            <div
              key={tag.id}
              className="badge badge-secondary badge-lg text-secondary-content"
            >
              {tag.name}
            </div>
          ))}
        </div>

        {link && (
          <div className="card-actions">
            <CustomLink
              to={link}
              linkColor="accent"
              size="xl"
              className={"flex gap-2 items-center uppercase bold flex-none"}
            >
              {!linkLabel ? "Go there" : `${linkLabel}`} <MoveRight />
            </CustomLink>
          </div>
        )}
      </div>
    </ScrollInFade>
  );
};
