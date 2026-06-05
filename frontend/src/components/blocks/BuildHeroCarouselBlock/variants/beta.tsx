import clsx from "clsx";
import { UseHeroCarouselBlockData, UseHeroCarouselBlockProps } from "../data";
import Block from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import getItemLink from "@/utils/getItemLink";
import Image from "@/components/common/Image";
import Heading from "@/components/common/Heading";
import { InsetLink } from "@/components/common/Link";
import Text from "@/components/common/Text";
import { MoveRight } from "lucide-react";
import sortItemALlowList from "@/utils/sortItemAllowList";
import ScrollInFade from "@/components/common/ScrollInFade";
import { NextButton, PrevButton } from "..";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import getImageByPriority from "@/utils/getImageByPriority";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function VariantBeta({
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

  const theme = blockProps.settings.theme;

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
      className={clsx(["h-full"])}
    >
      <ScrollInFade
        className={clsx(["h-full w-full relative overflow-x-clip"])}
        critical={!!critical}
      >
        <PrevButton />
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          spaceBetween={50}
          slidesPerView={1}
          className={clsx([
            "max-h-full w-full shadow-xl",
            blockProps.settings.location === "header"
              ? "!h-full lg:max-w-[calc(100%-12rem)]"
              : "h-[50rem] md:h-[30rem] max-w-screen-xl",
          ])}
          autoplay={{
            delay: 12000, // Time in ms
            disableOnInteraction: false, // Keep playing after interaction
            pauseOnMouseEnter: true, // Pause on hover
          }}
          loop={true}
        >
          {sortedItems.map((item: TItemWithIncludes) => {
            return (
              <SwiperSlide
                key={item.id}
                className={clsx(["max-h-full h-full w-full shadow-md"])}
              >
                <BetaSlide item={item} feed={referenceFeedPath} theme={theme} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <NextButton />
      </ScrollInFade>
    </Block>
  );
}

function BetaSlide({
  item,
  feed,
  theme,
}: {
  item: TItemWithIncludes;
  feed: string | undefined;
  theme: UseHeroCarouselBlockProps["settings"]["theme"];
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
    <div
      className={clsx([
        "relative w-full h-full flex flex-col md:flex-row group",
      ])}
    >
      <figure
        className={clsx([
          "flex-1 relative overflow-clip",
          theme === "alpha" &&
            "border-0 border-l-[48px] md:border-l-0 border-primary",
          theme === "beta" &&
            "border-0 border-l-[48px] md:border-l-0 border-accent",

          // theme === "alpha" && "border-r-0 border-[48px] border-primary",
          // theme === "beta" && "border-r-0 border-[48px] border-base-content",
        ])}
      >
        <Image
          url={image?.url || ""}
          alt={item.name}
          className={clsx([
            "absolute inset-0 w-full h-full object-cover",
            "transition-all duration-1000 scale-100 group-hover:scale-110",
          ])}
        />
        <div className="absolute inset-0 bg-black/30" />
      </figure>
      <div
        className={clsx([
          "flex-1 flex flex-col gap-8 items-start justify-center p-6 text-left",
          "bg-base-100 text-base-content",
          theme === "alpha" && "border-l-0 border-[48px] border-primary",
          theme === "beta" && "border-l-0 border-[48px] border-accent",
        ])}
      >
        <Heading
          headingSize="xxl"
          headingStyles="line-clamp-2 shadow-black drop-shadow-sm"
        >
          {item.name}
        </Heading>
        {item.description && (
          <Text
            textSize="xl"
            className="line-clamp-2 shadow-black drop-shadow-sm"
          >
            {item.description}
          </Text>
        )}
        <MoveRight
          className={clsx([
            "h-12 w-12",
            "origin-left transition-all duration-1000 scale-x-100 group-hover:scale-x-150",
          ])}
        />

        {link && <InsetLink to={link} aria-label={item.name} />}
      </div>
    </div>
  );
}
