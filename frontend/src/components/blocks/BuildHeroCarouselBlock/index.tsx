// import "swiper/css";
// import "swiper/css/navigation";

import Text from "../../common/Text";
import Block, { BlockComponentStandardProps } from "../Block";
import useHeroCarouselBlockData, {
  UseHeroCarouselBlockData,
  UseHeroCarouselBlockProps,
} from "./data";
import { TItem } from "../../../network/item";
import { TFeed } from "../../../network/feed";
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
import { TImage } from "../../../network/image";
import { InsetLink } from "../../common/Link";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { clsx } from "clsx";

export default function Component({
  component,
  params,
  path,
}: BlockComponentStandardProps) {
  const result = useHeroCarouselBlockData({ component, params, path });
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

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block
      {...blockProps}
      settings={{ ...blockProps.settings, padded: false }}
      className="h-full"
    >
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        spaceBetween={50}
        slidesPerView={1}
        className="max-h-full h-full w-full max-w-screen-2xl"
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
        <div
          className={clsx([
            "swiper-button-prev xl:ml-6",
            "md:!w-20 md:!h-20",
            "!top-auto bottom-1 sm:!top-1/2",
          ])}
        >
          <CircleArrowLeft
            size={120}
            className="!fill-none !stroke-base-content"
          />
        </div>
        <div
          className={clsx([
            "swiper-button-next xl:mr-6",
            "md:!w-20 md:!h-20",
            "!top-auto bottom-1 sm:!top-1/2",
          ])}
        >
          <CircleArrowRight
            size={120}
            className="!fill-none !stroke-base-content"
          />
        </div>
      </Swiper>
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
    <div className="relative w-full h-full">
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

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block {...blockProps} settings={{ ...blockProps.settings, padded: false }}>
      <div
        className={clsx(["swiper-button-prev xl:ml-6", "md:!w-20 md:!h-20"])}
      >
        <CircleArrowLeft
          size={120}
          className="!fill-none !stroke-base-content"
        />
      </div>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        spaceBetween={50}
        slidesPerView={1}
        className="max-h-full h-[30rem] w-full max-w-screen-xl"
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
              <BetaSlide item={item} feedPath={feedPath} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className={clsx(["swiper-button-next xl:mr-6", "md:!w-20 md:!h-20"])}
      >
        <CircleArrowRight
          size={120}
          className="!fill-none !stroke-base-content"
        />
      </div>
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
    <div className="relative w-full h-full">
      <Image
        src={image?.url || ""}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <Heading
        headingSize="xl"
        headingStyles="text-white absolute bottom-6 left-6"
      >
        {item.name}
      </Heading>
      {link && <InsetLink to={link} aria-label={item.name} />}
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
  console.log("feedPath", feedPath);

  if (itemsData.isLoading) {
    return null;
  }

  return (
    <Block
      {...blockProps}
      settings={{ ...blockProps.settings, padded: "tablet" }}
    >
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        spaceBetween={16}
        slidesPerView={3}
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
            <SwiperSlide key={item.id} className="max-h-full h-full w-full">
              <GammaSlide item={item} feedPath={feedPath} />
            </SwiperSlide>
          );
        })}
        <div
          className={clsx(["swiper-button-prev xl:ml-6", "md:!w-20 md:!h-20"])}
        >
          <CircleArrowLeft
            size={120}
            className="!fill-none !stroke-base-content"
          />
        </div>
        <div
          className={clsx(["swiper-button-next xl:mr-6", "md:!w-20 md:!h-20"])}
        >
          <CircleArrowRight
            size={120}
            className="!fill-none !stroke-base-content"
          />
        </div>
      </Swiper>
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
    <div className="relative w-full h-full">
      <Image
        src={image?.url || ""}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <Heading
        headingSize="lg"
        headingStyles="text-white absolute bottom-4 left-4"
      >
        {item.name}
      </Heading>
      {link && <InsetLink to={link} aria-label={item.name} />}
    </div>
  );
}
