import Text from "@/components/common/Text";
import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import useHeroCarouselBlockData, {
  UseHeroCarouselBlockData,
  UseHeroCarouselBlockProps,
} from "@/components/blocks/BuildHeroCarouselBlock/data";

import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { lazy, Suspense } from "react";

const VariantAlpha = lazy(() => import("./variants/alpha"));
const VariantBeta = lazy(() => import("./variants/beta"));
const VariantGamma = lazy(() => import("./variants/gamma"));

export default function Component(config: BlockComponentStandardProps) {
  const result = useHeroCarouselBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  if (blockData.itemsData.isLoading) return null;

  return <HeroCarouselBlock blockProps={blockProps} blockData={blockData} />;
}

export function HeroCarouselBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseHeroCarouselBlockProps;
  blockData: UseHeroCarouselBlockData;
}) {
  const { settings } = blockProps;
  const { variant } = settings;

  if (variant === "alpha") {
    return (
      <Suspense fallback={<div className="skeleton" />}>
        <VariantAlpha blockData={blockData} blockProps={blockProps} />
      </Suspense>
    );
  }

  if (variant === "beta") {
    return (
      <Suspense fallback={<div className="skeleton" />}>
        <VariantBeta blockData={blockData} blockProps={blockProps} />
      </Suspense>
    );
  }

  if (variant === "gamma") {
    return (
      <Suspense fallback={<div className="skeleton" />}>
        <VariantGamma blockData={blockData} blockProps={blockProps} />
      </Suspense>
    );
  }

  return (
    <Block {...blockProps}>
      <Text textSize="md">Not implemented</Text>
    </Block>
  );
}

export function PrevButton() {
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
export function NextButton() {
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
