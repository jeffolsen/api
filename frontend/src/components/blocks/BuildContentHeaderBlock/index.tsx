import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import useContentHeaderBlockData, {
  UseContentHeaderBlockData,
  UseContentHeaderBlockProps,
} from "@/components/blocks/BuildContentHeaderBlock/data";
import Text from "@/components/common/Text";
import Heading from "@/components/common/Heading";
import getItemLink, { getLinkLabel } from "@/utils/getItemLink";
import { TItem } from "@/network/item";
import Link from "@/components/common/Link";
import { clsx } from "clsx";
import ScrollInFade from "@/components/common/ScrollInFade";
import RichContent from "@/components/common/RichContent";
import { TTag } from "@/network/tag";
import { useGetAppItemTags } from "@/network/app";
import { JSONContent } from "@tiptap/react";
import Button from "@/components/common/Button";
import { MoveRight } from "lucide-react";

export default function Component(config: BlockComponentStandardProps) {
  const result = useContentHeaderBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  return <ContentHeaderBlock blockProps={blockProps} blockData={blockData} />;
}

function ContentHeaderBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseContentHeaderBlockProps;
  blockData: UseContentHeaderBlockData;
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
    <Block {...finalBlockProps} settings={finalBlockSettings}>
      <AlphaCard item={item} feed={referenceFeedPath} theme={theme} />
    </Block>
  );
}

const AlphaCard = ({
  item,
  feed,
  theme,
}: {
  item: TItem;
  feed?: string;
  theme: UseContentHeaderBlockProps["settings"]["theme"];
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

function VariantBeta({
  blockData,
  blockProps,
}: {
  blockProps: UseContentHeaderBlockProps;
  blockData: UseContentHeaderBlockData;
}) {
  const { itemsData } = blockData;
  if (itemsData.isLoading) {
    return null;
  }
  return (
    <Block
      name={blockProps.name}
      settings={{ ...blockProps.settings, padded: false }}
    >
      VariantBeta
    </Block>
  );
}

function VariantGamma({
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
    <Block {...finalBlockProps} settings={finalBlockSettings}>
      <GammaCard item={item} feed={referenceFeedPath} theme={theme} />
    </Block>
  );
}

const GammaCard = ({
  item,
  feed,
  theme,
}: {
  item: TItem;
  feed?: string;
  theme: UseContentHeaderBlockProps["settings"]["theme"];
}) => {
  const link = getItemLink(feed, item);
  const getTags = useGetAppItemTags(item.id);

  if (getTags.isLoading) return null;

  const tags = getTags?.data?.tags;

  return (
    <ScrollInFade
      className={clsx([
        "card card-compact sm:card-normal w-full flex-none justify-center h-full text-left",
        theme === "alpha" && "bg-base-100 shadow-xl",
      ])}
    >
      <div
        className={clsx([
          "card-body  text-base-content",
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
        {item.description &&
          (item.richContent?.content as unknown as JSONContent) && (
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
            theme === "alpha" && "justify-start",
            theme === "beta" && "justify-center",
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
          <Link as="Link" to={link}>
            Go <MoveRight />
          </Link>
        )}
      </div>
    </ScrollInFade>
  );
};
