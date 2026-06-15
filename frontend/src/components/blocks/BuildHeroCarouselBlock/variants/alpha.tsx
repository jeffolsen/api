import { UseHeroCarouselBlockData, UseHeroCarouselBlockProps } from "../data";
import clsx from "clsx";
import Block from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink from "@/utils/getItemLink";
import Image from "@/components/common/Image";
import Heading from "@/components/common/Heading";
import { InsetLink } from "@/components/common/Link";
import sortItemALlowList from "@/utils/sortItemAllowList";
import Text from "@/components/common/Text";
import { MoveRight } from "lucide-react";
import ScrollInFade from "@/components/common/ScrollInFade";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { NextButton, PrevButton } from "..";
import getImageByPriority from "@/utils/getImageByPriority";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function VariantAlpha({
  blockProps,
  blockData,
}: {
  blockProps: UseHeroCarouselBlockProps;
  blockData: UseHeroCarouselBlockData;
}) {
  const { itemsData, referenceFeedPath } = blockData;
  const critical = blockProps.settings.critical;

  if (itemsData.isLoading) {
    return null;
  }

  const sortedItems = sortItemALlowList({
    items: itemsData.data?.items ?? [],
    itemSlugs: blockData.itemOrder,
  });

  const finalBlockSettings = {
    ...blockProps.settings,
    padded: false,
    width: "xl" as UseHeroCarouselBlockProps["settings"]["width"],
    ...(blockProps.settings.location === "header" && {
      width: "xxl" as UseHeroCarouselBlockProps["settings"]["width"],
      themeCss: "py-0",
    }),
  };

  const finalBlockProps = {
    ...blockProps,
    ...((!blockProps.settings.isPrimaryContent ||
      blockProps.settings.location === "header") && { name: undefined }),
  };

  return (
    <Block
      {...finalBlockProps}
      settings={finalBlockSettings}
      className="h-full"
    >
      <ScrollInFade className="h-full" critical={!!critical}>
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          spaceBetween={50}
          slidesPerView={1}
          className="max-h-full h-full w-full max-w-full shadow-xl"
          autoplay={{
            delay: 6000, // Time in ms
            disableOnInteraction: false, // Keep playing after interaction
            pauseOnMouseEnter: true, // Pause on hover
          }}
          loop={true}
        >
          {sortedItems.map((item: TItemWithIncludes) => {
            return (
              <SwiperSlide key={item.id} className="max-h-full h-full w-full">
                <AlphaSlide item={item} feed={referenceFeedPath} />
              </SwiperSlide>
            );
          })}
          <PrevButton />
          <NextButton />
        </Swiper>
      </ScrollInFade>
    </Block>
  );
}

function AlphaSlide({
  item,
  feed,
}: {
  item: TItemWithIncludes;
  feed: string | undefined;
}) {
  const link = getItemLink(feed, item);
  const images = item.images.map(({ image }) => image);
  const image = getImageByPriority({
    images,
    priority: { ICON: 0, PORTRAIT: 3, LANDSCAPE: 2 },
  });

  if (images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full text-neutral-content group">
      <Image
        url={image?.url || ""}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/60" />
      <div className="absolute gap-4 inset-0 flex flex-col items-start justify-center px-6 py-18 md:px-24 lg:px-40 xl:max-w-[75%] text-left">
        <Heading
          headingSize="xxl"
          headingStyles={clsx([
            "px-4 line-clamp-2 md:line-clamp-1 drop-shadow-lg shadow-black",
            "origin-left transition-all duration-1000 scale-100 group-hover:scale-110",
          ])}
        >
          {item.name}
        </Heading>
        <Text
          textSize="xxl"
          className={clsx([
            "mt-4 px-4 line-clamp-2 md:line-clamp-3 drop-shadow-lg shadow-black",
            "origin-top-left transition-all duration-1000 scale-100 group-hover:scale-110",
          ])}
        >
          {item.description}
        </Text>
        <MoveRight
          className={clsx([
            "h-16 w-16 mt-12 mx-4",
            "origin-top-left transition-all duration-1000 scale-x-100 group-hover:scale-x-150",
            "drop-shadow-lg shadow-black",
          ])}
        />
      </div>
      {link && <InsetLink to={link} aria-label={item.name} />}
    </div>
  );
}
