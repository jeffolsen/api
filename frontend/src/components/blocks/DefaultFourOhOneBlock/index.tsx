import Block, { BlockStandardProps } from "../Block";
import Text from "../../common/Text";
import { Button } from "../../common/Button";
import { useNavigate } from "react-router";
import useFourOhOneBlockData from "./data";

function FourOhOneBlock({ component, params, path }: BlockStandardProps) {
  const result = useFourOhOneBlockData({ component, params, path });
  const { blockProps } = result;
  const navigate = useNavigate();
  return (
    <Block {...blockProps}>
      <Text textSize="md" className="text-center">
        Sorry, you do not have permission to access the page
        <br />
        <Text as="span" textSize="lg" className="font-mono text-accent italic">
          {path}
        </Text>
      </Text>
      <Button onClick={() => navigate(-1)} color="primary" className="mx-auto">
        Go Back
      </Button>
    </Block>
  );
}

export default FourOhOneBlock;
