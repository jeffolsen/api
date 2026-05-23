import BlockWrapper, { BlockComponentStandardProps } from "../Block";
import useDetailBlockData, {
  UseDetailBlockData,
  UseDetailBlockProps,
} from "./data";

export default function Component(config: BlockComponentStandardProps) {
  const result = useDetailBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  return <DetailBlock blockData={blockData} blockProps={blockProps} />;
}

export function DetailBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseDetailBlockProps;
  blockData: UseDetailBlockData;
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
          {JSON.stringify(blockData.itemData, null, 2)}
        </pre>
        <pre className="w-full p-4 max-w-full whitespace-break-spaces">
          {JSON.stringify(blockProps, null, 2)}
        </pre>
      </code>
    </BlockWrapper>
  );
}
