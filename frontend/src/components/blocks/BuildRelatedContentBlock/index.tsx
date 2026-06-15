import Text from "@/components/common/Text";
import BlockWrapper, { BlockComponentStandardProps } from "../Block";
import useDetailBlockData, {
  UseRelatedContentBlockData,
  UseRelatedContentBlockProps,
} from "./data";
import { lazy, Suspense } from "react";

const VariantAlpha = lazy(() => import("./variants/alpha"));
const VariantBeta = lazy(() => import("./variants/beta"));
const VariantGamma = lazy(() => import("./variants/gamma"));

export default function Component(config: BlockComponentStandardProps) {
  const result = useDetailBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  if (blockData.itemsData.isLoading) return null;

  return <RelatedContentBlock blockProps={blockProps} blockData={blockData} />;
}

export function RelatedContentBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseRelatedContentBlockProps;
  blockData: UseRelatedContentBlockData;
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
