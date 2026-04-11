import Text from "../../common/Text";
import Block, { BlockStandardProps } from "../Block";
import useGenericBlockData from "./data";

function GenericBlock({ component, params, path }: BlockStandardProps) {
  const result = useGenericBlockData({ component, params, path });
  const { blockProps } = result;
  return (
    <Block {...blockProps}>
      <Text textSize="md">Not implemented</Text>
    </Block>
  );
}

export default GenericBlock;
