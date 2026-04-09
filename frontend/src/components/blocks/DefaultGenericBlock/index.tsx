import Text from "../../common/Text";
import Block, { BlockProps } from "../Block";

function GenericBlock(props: BlockProps) {
  return (
    <Block {...props}>
      <Text textSize="md">Not implemented</Text>
    </Block>
  );
}

export default GenericBlock;
