import { UseDetailBlockData, UseDetailBlockProps } from "../data";
import Block from "@/components/blocks/Block";
import getImageByPriority from "@/utils/getImageByPriority";
import Image from "@/components/common/Image";
import Text from "@/components/common/Text";
import RichContent from "@/components/common/RichContent";
import type { JSONContent } from "@tiptap/core";
import { TDateRange } from "@/network/dateRange/types";
import dayjs from "@/utils/dayjs";
import Grid from "@/components/common/Grid";
import clsx from "clsx";

export default function VariantBeta({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  return (
    <>
      <DetailHeader blockProps={blockProps} blockData={blockData} />
      <DetailBody blockProps={blockProps} blockData={blockData} />
      <DetailJournal blockProps={blockProps} blockData={blockData} />
    </>
  );
}

function DetailHeader({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  const { itemData } = blockData;
  const image = getImageByPriority({
    images: itemData.images.map((i) => i.image),
    priority: { ICON: 3, LANDSCAPE: 1, PORTRAIT: 2 },
  });

  return (
    <Block
      {...blockProps}
      name={itemData.name}
      settings={{ width: "lg", textAlign: "text-left", ...blockProps.settings }}
      headingProps={{ headingDecorator: "underline" }}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {image && (
          <div className="w-full sm:w-72 lg:w-96 from-base-100 to-base-300 bg-gradient-to-b flex-none">
            <Image
              {...image}
              ar="1.5"
              fit={image.type === "ICON" ? "contain" : "cover"}
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          {itemData.description && <Text>{itemData.description}</Text>}
          {itemData.tags.length > 0 && (
            <div className="flex gap-3">
              {itemData.tags.map((t) => (
                <div
                  className="badge badge-secondary badge-lg text-secondary-content"
                  key={t.tagId}
                >
                  {t.tag.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Block>
  );
}

function DetailBody({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  const { itemData } = blockData;
  if (!itemData.richContent?.content) return null;
  return (
    <Block
      {...blockProps}
      name={""}
      settings={{
        width: "md",
        textAlign: "text-left",
        ...blockProps.settings,
      }}
      headingProps={{ headingDecorator: "underline" }}
    >
      {(itemData.richContent?.content as unknown as JSONContent) && (
        <RichContent
          richContent={itemData.richContent as Record<string, unknown>}
        />
      )}
    </Block>
  );
}

function DetailJournal({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  const { itemData } = blockData;

  if (!itemData.dateRanges.length) return null;

  return (
    <Block
      {...blockProps}
      name={"Journal"}
      settings={{
        width: "lg",
        textAlign: "text-left",
        ...blockProps.settings,
      }}
    >
      {/* {(itemData.dateRanges.map((d) => )
      )} */}
      <Grid
        className={clsx(["grid-rows-auto gap-4"])}
        items={itemData.dateRanges.map((d) => ({
          id: d.id,
          content: <JournalCard dateRange={d} />,
        }))}
      />
    </Block>
  );
}

function JournalCard({ dateRange }: { dateRange: TDateRange }) {
  const start = dayjs(dateRange.startAt);
  const end = dayjs(dateRange.endAt);

  return (
    <div className="card md:card-side bg-base-100 shadow-lg">
      <div className="flex flex-none">
        <div className="stat w-28">
          <div className="stat-title">{start.format("MMMM")}</div>
          <div className="stat-value">{start.format("Do")}</div>
          <div className="stat-desc">{start.format("YYYY")}</div>
        </div>
        <div className="stat w-28">
          <div className="stat-title">{end.format("MMMM")}</div>
          <div className="stat-value">{end.format("Do")}</div>
          <div className="stat-desc">{end.format("YYYY")}</div>
        </div>
      </div>
      <div className="card-body">
        <Text>{dateRange.description}</Text>
      </div>
    </div>
  );
}
