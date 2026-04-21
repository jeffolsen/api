import Block, { BlockComponentStandardProps } from "../Block";
import Text from "../../common/Text";
import Button from "../../common/Button";
import { useNavigate } from "react-router";
import useFourOhFourBlockData from "./data";

function FourOhFourBlock(config: BlockComponentStandardProps) {
  const result = useFourOhFourBlockData(config);
  const navigate = useNavigate();

  if (result.type === "error") return null;

  const { blockProps } = result;
  return (
    <Block {...blockProps}>
      <Text textSize="md" className="text-center">
        Sorry, the page
        <br />
        <Text as="span" textSize="lg" className="font-mono text-accent italic">
          {config.path}
        </Text>
        <br />
        could not be found.
      </Text>
      <Button onClick={() => navigate(-1)} color="primary" className="mx-auto">
        Go Back
      </Button>
    </Block>
  );
}

export default FourOhFourBlock;
