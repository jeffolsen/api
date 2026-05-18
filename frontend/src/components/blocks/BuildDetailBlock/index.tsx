import BlockWrapper, { BlockComponentStandardProps } from "../Block";
import useDetailBlockData from "./data";

export default function Component(config: BlockComponentStandardProps) {
  const result = useDetailBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }

  const { blockProps, blockData } = result;

  return (
    <BlockWrapper {...blockProps}>
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
