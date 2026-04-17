import Text from "../../common/Text";
import Block, { BlockComponentStandardProps } from "../Block";
import useGenericBlockData from "./data";

function GenericBlock({
  component,
  params,
  path,
}: BlockComponentStandardProps) {
  const result = useGenericBlockData({ component, params, path });

  if (result.type === "error") return null;

  const { blockProps } = result;

  return (
    <Block {...blockProps}>
      <Text textSize="md">Not implemented</Text>
    </Block>
  );
}

export default GenericBlock;
