import { TItem } from "@/network/item/types";
import Text from "@/components/common/Text";
import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import useHeroCarouselBlockData, {
  UseHeroCarouselBlockData,
  UseHeroCarouselBlockProps,
} from "@/components/blocks/BuildHeroCarouselBlock/data";
import Heading from "@/components/common/Heading";
import getItemLink from "@/utils/getItemLink";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useGetAppItemImages } from "@/network/app";
import Image from "@/components/common/Image";
import { InsetLink } from "@/components/common/Link";
import { CircleArrowLeft, CircleArrowRight, MoveRight } from "lucide-react";
import { clsx } from "clsx";
import ScrollInFade from "@/components/common/ScrollInFade";
import { WrapperProps } from "@/components/common/Wrapper";
import sortItemALlowList from "@/utils/sortItemAllowList";
import getImageByPriority from "@/utils/getImageByPriority";

export default function Component(config: BlockComponentStandardProps) {
  const result = useHeroCarouselBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  return <HeroCarouselBlock blockProps={blockProps} blockData={blockData} />;
}

function HeroCarouselBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseHeroCarouselBlockProps;
  blockData: UseHeroCarouselBlockData;
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
  blockProps,
  blockData,
}: {
  blockProps: UseHeroCarouselBlockProps;
  blockData: UseHeroCarouselBlockData;
}) {
  const { itemsData, referenceFeedPath } = blockData;
  const critical = blockProps.settings;

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
          {sortedItems.map((item: TItem) => {
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

function AlphaSlide({ item, feed }: { item: TItem; feed: string | undefined }) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feed, item);
  const image = getImageByPriority({
    images: getImages?.data?.images || [],
    priority: { ICON: 0, PORTRAIT: 3, LANDSCAPE: 2 },
  });

  if (getImages.isLoading || getImages.data.images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full text-neutral-content group">
      <Image
        src={image?.url || ""}
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

function VariantBeta({
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
          {sortedItems.map((item: TItem) => {
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
  item: TItem;
  feed: string | undefined;
  theme: UseHeroCarouselBlockProps["settings"]["theme"];
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feed, item);
  const image = getImageByPriority({
    images: getImages?.data?.images || [],
    priority: { ICON: 0, PORTRAIT: 2, LANDSCAPE: 3 },
  });

  if (getImages.isLoading || getImages.data.images.length === 0) {
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

          // theme === "alpha" && "border-r-0 border-[48px] border-primary",
          // theme === "beta" && "border-r-0 border-[48px] border-base-content",
        ])}
      >
        <Image
          src={image?.url || ""}
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

function VariantGamma({
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
          {sortedItems.map((item: TItem) => {
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

function GammaSlide({ item, feed }: { item: TItem; feed: string | undefined }) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feed, item);
  const image = getImageByPriority({
    images: getImages?.data?.images || [],
    priority: { ICON: 0, PORTRAIT: 2, LANDSCAPE: 3 },
  });

  if (getImages.isLoading || getImages.data.images.length === 0) {
    return <div className="skeleton w-full h-full" />;
  }

  return (
    <div className="relative w-full h-full text-neutral-content">
      <Image
        src={image?.url || ""}
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

function PrevButton() {
  return (
    <div
      className={clsx([
        "swiper-button-prev",
        "!w-16 !h-16 md:!w-20 md:!h-20",
        "!top-auto bottom-1 lg:!top-1/2",
        "bg-neutral rounded-full group hover:bg-primary transition-colors duration-300",
      ])}
    >
      <CircleArrowLeft
        size={120}
        className="!fill-none !stroke-neutral-content"
      />
    </div>
  );
}
function NextButton() {
  return (
    <div
      className={clsx([
        "swiper-button-next",
        "!w-16 !h-16 md:!w-20 md:!h-20",
        "!top-auto bottom-1 lg:!top-1/2",
        "bg-neutral rounded-full group hover:bg-primary transition-colors duration-300",
      ])}
    >
      <CircleArrowRight
        size={120}
        className="!fill-none !stroke-neutral-content"
      />
    </div>
  );
}
