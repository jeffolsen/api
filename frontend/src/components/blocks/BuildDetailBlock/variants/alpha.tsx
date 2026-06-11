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
import "swiper/css/effect-fade";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import ScrollInFade from "@/components/common/ScrollInFade";
import Heading, { HeadingLevelProvider } from "@/components/common/Heading";

export default function VariantAlpha({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  const { itemData } = blockData;

  console.log(itemData);

  return (
    <>
      <DetailHeader blockProps={blockProps} blockData={blockData} />
      <DetailGallery blockProps={blockProps} blockData={blockData} />
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
  return (
    <Block
      {...blockProps}
      name={itemData.name}
      settings={{ width: "lg", textAlign: "text-left", ...blockProps.settings }}
      headingProps={{ headingDecorator: "underline" }}
    >
      {itemData.description && <Text>{itemData.description}</Text>}
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
  return (
    <Block
      {...blockProps}
      name={""}
      settings={{ width: "lg", textAlign: "text-left", ...blockProps.settings }}
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

  // const twentyImages = Array.from({ length: 20 }, () => ({ ...images[0] }));

  console.log("images", images);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  return (
    <Block
      {...blockProps}
      name=""
      settings={{ width: "lg", textAlign: "text-left", ...blockProps.settings }}
      headingProps={{ headingDecorator: "underline" }}
    >
      <ScrollInFade className="w-full">
        <Swiper
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-full h-full shadow-lg"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="max-h-full h-full w-full">
              <div className="h-full w-full flex flex-col md:flex-row bg-base-100 group md:items-center">
                <figure className="h-[30rem] md:w-1/2 from-base-100 to-base-300 bg-gradient-to-b">
                  <Image {...img} ar="none" fit="contain" hover="zoom" />
                </figure>
                <HeadingLevelProvider>
                  <div className="md:w-1/2 h-full flex flex-col gap-8 py-6 px-6 md:pr-12">
                    <Heading>{img.alt}</Heading>
                    <Text>{img.attribution}</Text>
                  </div>
                </HeadingLevelProvider>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </ScrollInFade>
      <ScrollInFade className="h-20 w-full">
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={8}
          slidesPerView={3}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[Navigation, Thumbs]}
          className="w-full h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <Image {...img} ar="none" />
            </SwiperSlide>
          ))}
        </Swiper>
      </ScrollInFade>
    </Block>
  );
}
