import Block, { BlockProps } from "./Block";

function FourOhFourBlock(props: BlockProps) {
  const { path } = props;
  return (
    <Block {...props}>
      <p>Sorry, the page "{path}" could not be found.</p>
    </Block>
  );
}

export default FourOhFourBlock;
