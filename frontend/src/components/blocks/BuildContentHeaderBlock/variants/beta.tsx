import { UseContentHeaderBlockData, UseContentHeaderBlockProps } from "../data";
import Block from "@/components/blocks/Block";

export default function VariantBeta({
  blockData,
  blockProps,
}: {
  blockProps: UseContentHeaderBlockProps;
  blockData: UseContentHeaderBlockData;
}) {
  const { itemsData } = blockData;
  if (itemsData.isLoading) {
    return null;
  }
  return (
    <Block
      name={blockProps.name}
      settings={{ ...blockProps.settings, padded: false, width: "lg" }}
    >
      VariantBeta
    </Block>
  );
}
