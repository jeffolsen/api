import Block, { BlockProps } from "./Block";
import Text from "../common/Text";

function FourOhOneBlock(props: BlockProps) {
  const { path } = props;
  return (
    <Block {...props}>
      <Text textSize="md" className="text-center">
        Sorry, you do not have permission to access the page
        <br />
        <Text as="span" textSize="lg" className="font-mono text-accent italic">
          {path}
        </Text>
      </Text>
    </Block>
  );
}

export default FourOhOneBlock;
