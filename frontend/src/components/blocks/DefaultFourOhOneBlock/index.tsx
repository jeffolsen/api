import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import Text from "@/components/common/Text";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router";
import useFourOhOneBlockData from "@/components/blocks/DefaultFourOhOneBlock/data";

function FourOhOneBlock(config: BlockComponentStandardProps) {
  const result = useFourOhOneBlockData(config);
  const navigate = useNavigate();

  if (result.type === "error") return null;

  const { blockProps } = result;

  return (
    <Block {...blockProps}>
      <Text textSize="md" className="text-center">
        Sorry, you do not have permission to access the page
        <br />
        <Text as="span" textSize="lg" className="font-mono text-accent italic">
          {config.path}
        </Text>
      </Text>
      <Button onClick={() => navigate(-1)} color="primary" className="mx-auto">
        Go Back
      </Button>
    </Block>
  );
}

export default FourOhOneBlock;
