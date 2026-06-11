import { UseDetailBlockData, UseDetailBlockProps } from "../data";
import Block from "@/components/blocks/Block";

export default function VariantGamma({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
}) {
  const { itemData } = blockData;

  console.log(itemData);

  return <Block {...blockProps}></Block>;
}
