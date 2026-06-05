import clsx from "clsx";
import { UseHeroCarouselBlockData, UseHeroCarouselBlockProps } from "../data";
import Block from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink from "@/utils/getItemLink";
import Image from "@/components/common/Image";
import Heading from "@/components/common/Heading";
import { InsetLink } from "@/components/common/Link";
import sortItemALlowList from "@/utils/sortItemAllowList";
import ScrollInFade from "@/components/common/ScrollInFade";
import { NextButton, PrevButton } from "..";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import getImageByPriority from "@/utils/getImageByPriority";
import { WrapperProps } from "@/components/common/Wrapper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function VariantGamma({
  blockData,
  blockProps,
}: {
  blockData: UseHeroCarouselBlockData;
  blockProps: UseHeroCarouselBlockProps;
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
    padded: "tablet" as WrapperProps["padded"],
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
      <ScrollInFade className="h-full w-full" critical={!!critical}>
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 3,
            },
          }}
          className={clsx([
            "max-h-full w-full shadow-xl",
            blockProps.settings.location === "header"
              ? "!h-full max-w-none"
              : "h-96 max-w-screen-2xl",
          ])}
          autoplay={{
            delay: 4000, // Time in ms
            disableOnInteraction: false, // Keep playing after interaction
            pauseOnMouseEnter: true, // Pause on hover
          }}
          loop={true}
        >
          {sortedItems.map((item: TItemWithIncludes) => {
            return (
              <SwiperSlide
                key={item.id}
                className="max-h-full h-full w-full shadow-xl"
              >
                <GammaSlide item={item} feed={referenceFeedPath} />
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

function GammaSlide({
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
    priority: { ICON: 0, PORTRAIT: 2, LANDSCAPE: 3 },
  });

  if (images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full text-neutral-content">
      <Image
        url={image?.url || ""}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="flex flex-col justify-center items-center absolute inset-0 p-16">
        <Heading headingSize="md" headingStyles="text-neutral-content">
          {item.name}
        </Heading>
      </div>
      {link && <InsetLink to={link} aria-label={item.name} />}
    </div>
  );
}
