import Heading from "@/components/common/Heading";
import { UseDetailBlockData, UseDetailBlockProps } from "../data";
import Block from "@/components/blocks/Block";
import getImageByPriority from "@/utils/getImageByPriority";
import Image from "@/components/common/Image";
import Text from "@/components/common/Text";
import RichContent from "@/components/common/RichContent";
import type { JSONContent } from "@tiptap/core";
import { TDateRange } from "@/network/dateRange/types";
import dayjs from "@/utils/dayjs";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

export default function VariantGamma({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  return (
    <>
      <DetailHeader blockProps={blockProps} blockData={blockData} />
      <DetailJournal blockProps={blockProps} blockData={blockData} />
      <DetailBody blockProps={blockProps} blockData={blockData} />
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
  const icon = getImageByPriority({
    images: itemData.images.map((i) => i.image),
    priority: { ICON: 1, LANDSCAPE: 0, PORTRAIT: 0 },
  });

  return (
    <Block
      {...blockProps}
      name=""
      settings={{ width: "lg", textAlign: "text-left", ...blockProps.settings }}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {icon && (
          <div className="w-full sm:w-72 from-base-100 to-base-300 bg-gradient-to-b flex-none">
            <Image {...icon} ar="1" fit="contain" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Heading
            headingSize="lg"
            headingDecorator="underline"
            headingStyles="uppercase font-bold"
          >
            {itemData.name}
          </Heading>
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
      name={""}
      settings={{
        width: "lg",
        textAlign: "text-left",
        ...blockProps.settings,
      }}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect={"fade"}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{
          delay: 6000, // Time in ms
          disableOnInteraction: false, // Keep playing after interaction
          pauseOnMouseEnter: true, // Pause on hover
        }}
        className="w-full max-w-full"
        loop={true}
      >
        {itemData.dateRanges.map((d, i) => (
          <SwiperSlide key={i}>
            <JournalCard dateRange={d} />
          </SwiperSlide>
        ))}
      </Swiper>
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
