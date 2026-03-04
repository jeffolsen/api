import Block, { BlockProps } from "./Block";
import Text from "../common/Text";

function FourOhFourBlock(props: BlockProps) {
  const { path } = props;
  return (
    <Block {...props}>
      <Text textSize="md" className="text-center">
        Sorry, the page
        <br />
        <Text as="span" textSize="lg" className="font-mono text-accent italic">
          {path}
        </Text>
        <br />
        could not be found.
      </Text>
    </Block>
  );
}

export default FourOhFourBlock;
