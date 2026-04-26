import { TItem } from "../../../network/item";
import { TFeed } from "../../../network/feed";
import { TImage } from "../../../network/image";
import Text from "../../common/Text";
import Block, { BlockComponentStandardProps } from "../Block";
import useHeroCarouselBlockData, {
  UseHeroCarouselBlockData,
  UseHeroCarouselBlockProps,
} from "./data";
import Heading from "../../common/Heading";
import getItemLink from "../../../utils/getItemLink";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useGetAppItemImages } from "../../../network/app";
import Image from "../../common/Image";
import { InsetLink } from "../../common/Link";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { clsx } from "clsx";
import ScrollInFade from "../../common/ScrollInFade";

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
  const { itemsData, referenceFeedData } = blockData;
  const feedPath = (referenceFeedData?.data as TFeed)?.path;
  const critical = blockProps.settings;

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block
      {...blockProps}
      settings={{ ...blockProps.settings, padded: false }}
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
          className="max-h-full h-full w-full max-w-screen-2xl shadow-xl"
          autoplay={{
            delay: 4000, // Time in ms
            disableOnInteraction: false, // Keep playing after interaction
            pauseOnMouseEnter: true, // Pause on hover
          }}
          loop={true}
        >
          {(itemsData.data?.items ?? []).map((item: TItem) => {
            return (
              <SwiperSlide key={item.id} className="max-h-full h-full w-full">
                <AlphaSlide item={item} feedPath={feedPath} />
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
  feedPath,
}: {
  item: TItem;
  feedPath: string | undefined;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feedPath, item.id);
  const image = getImages?.data?.images?.find(
    (img: TImage) => img.type === "LANDSCAPE",
  );

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
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/60" />
      <div className="absolute inset-0 flex flex-col items-start justify-center p-6 md:pl-24 pb-18 md:max-w-[70%] text-left">
        <Heading
          headingSize="xxl"
          headingStyles="px-4 line-clamp-2 md:line-clamp-1 drop-shadow-lg shadow-black"
        >
          {item.name}
        </Heading>
        <Text
          textSize="xxl"
          className="mt-4 px-4 line-clamp-2 md:line-clamp-3 drop-shadow-lg shadow-black"
        >
          {item.description}
        </Text>
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
  const { itemsData, referenceFeedData } = blockData;
  const feedPath = (referenceFeedData?.data as TFeed)?.path;
  const critical = blockProps.settings.critical;

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block {...blockProps} settings={{ ...blockProps.settings, padded: false }}>
      <ScrollInFade className="h-full w-full" critical={!!critical}>
        <PrevButton />
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          spaceBetween={50}
          slidesPerView={1}
          className="max-h-full h-[30rem] w-full max-w-screen-xl shadow-xl"
          autoplay={{
            delay: 12000, // Time in ms
            disableOnInteraction: false, // Keep playing after interaction
            pauseOnMouseEnter: true, // Pause on hover
          }}
          loop={true}
        >
          {(itemsData.data?.items ?? []).map((item: TItem) => {
            return (
              <SwiperSlide key={item.id} className="max-h-full h-full w-full">
                <BetaSlide item={item} feedPath={feedPath} />
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
  feedPath,
}: {
  item: TItem;
  feedPath: string | undefined;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feedPath, item.id);
  const image = getImages?.data?.images?.find(
    (img: TImage) => img.type === "LANDSCAPE",
  );

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
      <div className="absolute inset-0 flex flex-col items-start justify-center p-6 px-24 pb-18 text-left">
        <Heading headingSize="xl" headingStyles="text-neutral-content">
          {item.name}
        </Heading>
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
  const { itemsData, referenceFeedData } = blockData;
  const feedPath = (referenceFeedData?.data as TFeed)?.path;
  const critical = blockProps.settings.critical;

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block
      {...blockProps}
      settings={{ ...blockProps.settings, padded: "tablet" }}
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
          className="max-h-full h-96 w-full max-w-screen-2xl"
          autoplay={{
            delay: 4000, // Time in ms
            disableOnInteraction: false, // Keep playing after interaction
            pauseOnMouseEnter: true, // Pause on hover
          }}
          loop={true}
        >
          {(itemsData.data?.items ?? []).map((item: TItem) => {
            return (
              <SwiperSlide
                key={item.id}
                className="max-h-full h-full w-full shadow-xl"
              >
                <GammaSlide item={item} feedPath={feedPath} />
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
  feedPath,
}: {
  item: TItem;
  feedPath: string | undefined;
}) {
  const getImages = useGetAppItemImages(item.id);
  const link = getItemLink(feedPath, item.id);
  const image = getImages?.data?.images?.find(
    (img: TImage) => img.type === "LANDSCAPE",
  );

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
        "bg-base-content rounded-full bg-opacity-75 hover:bg-opacity-100",
      ])}
    >
      <CircleArrowLeft size={120} className="!fill-none !stroke-base-300" />
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
        "bg-base-content rounded-full bg-opacity-75 hover:bg-opacity-100",
      ])}
    >
      <CircleArrowRight size={120} className="!fill-none !stroke-base-300" />
    </div>
  );
}
