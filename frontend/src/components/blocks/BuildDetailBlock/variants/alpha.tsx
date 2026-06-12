import { UseDetailBlockData, UseDetailBlockProps } from "../data";
import Block from "@/components/blocks/Block";
import Text from "@/components/common/Text";
import Image from "@/components/common/Image";
import type { JSONContent } from "@tiptap/core";
import RichContent from "@/components/common/RichContent";
import { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import ScrollInFade from "@/components/common/ScrollInFade";
import Heading, { HeadingLevelProvider } from "@/components/common/Heading";
import Grid from "@/components/common/Grid";
import clsx from "clsx";
import { TDateRange } from "@/network/dateRange/types";
import dayjs from "@/utils/dayjs";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function VariantAlpha({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  return (
    <>
      <DetailGallery blockProps={blockProps} blockData={blockData} />
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
  return (
    <Block
      {...blockProps}
      name={itemData.name}
      settings={{ width: "lg", textAlign: "text-left", ...blockProps.settings }}
      headingProps={{ headingDecorator: "underline" }}
    >
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
        themeCss: "bg-base-100 text-base-content shadow-xl",
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

function DetailGallery({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  const { itemData } = blockData;
  const images = itemData.images
    .map((i) => i.image)
    .filter((i) => i.type !== "ICON");

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  console.log("thumbsSwiper", thumbsSwiper);

  return (
    <Block
      {...blockProps}
      name=""
      settings={{
        width: "lg",
        padded: false,
        ...blockProps.settings,
      }}
    >
      <ScrollInFade className="w-full h-full flex gap-2 items-stretch">
        {/* <PrevButton /> */}
        <Swiper
          spaceBetween={10}
          loop={true}
          navigation={true}
          thumbs={{
            swiper: thumbsSwiper,
            slideThumbActiveClass: "saturate-100",
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-full h-full shadow-lg"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="max-h-full !h-auto w-full">
              <div className="h-full w-full flex flex-col md:flex-row bg-base-100 group md:items-center">
                <figure className="h-[30rem] md:w-1/2 from-base-100 to-base-300 bg-gradient-to-b">
                  <Image {...img} ar="none" fit="contain" hover="zoom" />
                </figure>
                <HeadingLevelProvider>
                  <div className="md:w-1/2 flex flex-col gap-8 py-6 px-6 md:pr-12 flex-1">
                    <Heading>{img.alt}</Heading>
                    <Text>{img.attribution}</Text>
                  </div>
                </HeadingLevelProvider>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <NextButton /> */}
      </ScrollInFade>
      <ScrollInFade className="h-20 w-full">
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={8}
          slidesPerView={3}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="flex-grow h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide
              key={i}
              className={clsx([
                "cursor-pointer saturate-0 hover:saturate-100 transition-all duration-700",
              ])}
            >
              <Image {...img} ar="none" />
            </SwiperSlide>
          ))}
        </Swiper>
      </ScrollInFade>
    </Block>
  );
}

export function PrevButton() {
  return (
    <div
      className={clsx([
        "swiper-button-prev !relative !inset-0 !self-stretch",
        "!w-16 !m-0 !h-full",
        "bg-neutral group hover:bg-primary transition-colors duration-300",
      ])}
    >
      <ArrowLeft size={120} className="!fill-none !stroke-neutral-content" />
    </div>
  );
}
export function NextButton() {
  return (
    <div
      className={clsx([
        "swiper-button-next !relative !inset-0",
        "!w-16 !m-0 !h-full",
        "bg-neutral group hover:bg-primary transition-colors duration-300",
      ])}
    >
      <ArrowRight size={120} className="!fill-none !stroke-neutral-content" />
    </div>
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
