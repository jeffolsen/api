import Text from "@/components/common/Text";
import BlockWrapper, {
  BlockComponentStandardProps,
} from "@/components/blocks/Block";
import useTeaserGridBlockData, {
  UseTeaserGridBlockData,
  UseTeaserGridBlockProps,
} from "@/components/blocks/BuildTeaserGridBlock/data";
import { lazy, Suspense } from "react";

const VariantAlpha = lazy(() => import("./variants/alpha"));
const VariantBeta = lazy(() => import("./variants/beta"));
const VariantGamma = lazy(() => import("./variants/gamma"));

export default function Component(config: BlockComponentStandardProps) {
  const result = useTeaserGridBlockData(config);
  if (result.type === "error") {
    return null;
  }

  const { blockProps, blockData } = result;

  if (blockData.itemsData.isLoading) return null;

  return <TeaserGridBlock blockProps={blockProps} blockData={blockData} />;
}

export function TeaserGridBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseTeaserGridBlockProps;
  blockData: UseTeaserGridBlockData;
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
    <BlockWrapper {...blockProps}>
      <Text textSize="md">Not implemented</Text>
    </BlockWrapper>
  );
}
