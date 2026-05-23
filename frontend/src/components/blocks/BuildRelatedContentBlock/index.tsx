import BlockWrapper, { BlockComponentStandardProps } from "../Block";
import useDetailBlockData, {
  UseRelatedContentBlockData,
  UseRelatedContentBlockProps,
} from "./data";

export default function Component(config: BlockComponentStandardProps) {
  const result = useDetailBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  return <RelatedContentBlock blockProps={blockProps} blockData={blockData} />;
}

export function RelatedContentBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseRelatedContentBlockProps;
  blockData: UseRelatedContentBlockData;
}) {
  const variants = {
    alpha: {
      width: "xl",
    },
    beta: {
      width: "lg",
    },
    gamma: {
      width: "md",
    },
  } as const;
  return (
    <BlockWrapper
      {...blockProps}
      settings={{ ...blockProps.settings, width: variants["alpha"].width }}
    >
      <code>
        <pre className="w-full p-4 max-w-full whitespace-break-spaces">
          {JSON.stringify(blockData.itemsData.data, null, 2)}
        </pre>
        <pre className="w-full p-4 max-w-full whitespace-break-spaces">
          {JSON.stringify(blockData.itemData, null, 2)}
        </pre>
        <pre className="w-full p-4 max-w-full whitespace-break-spaces">
          {JSON.stringify(blockProps, null, 2)}
        </pre>
      </code>
    </BlockWrapper>
  );
}
