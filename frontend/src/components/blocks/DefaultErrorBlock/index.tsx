import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import Text from "@/components/common/Text";
import Button from "@/components/common/Button";
import { useRouter } from "@tanstack/react-router";
import useErrorBlockData, {
  UseErrorBlockProps,
  UseErrorBlockData,
} from "@/components/blocks/DefaultErrorBlock/data";

export default function Component(config: BlockComponentStandardProps) {
  const result = useErrorBlockData(config);

  const { blockProps, blockData } = result;

  return <ErrorBlock blockProps={blockProps} blockData={blockData} />;
}

function ErrorBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseErrorBlockProps;
  blockData: UseErrorBlockData;
}) {
  const { errorCode } = blockData;

  if (errorCode === 204) {
    return <TwoOhFourBlock blockProps={blockProps} />;
  }

  if (errorCode === 404) {
    return <FourOhFourBlock blockData={blockData} blockProps={blockProps} />;
  }

  if (errorCode === 401) {
    return <FourOhOneBlock blockData={blockData} blockProps={blockProps} />;
  }

  if (errorCode === 429) {
    return (
      <FourTwentyNineBlock blockData={blockData} blockProps={blockProps} />
    );
  }

  return (
    <Block {...blockProps}>
      <Text textSize="md">Not implemented</Text>
    </Block>
  );
}

function TwoOhFourBlock({ blockProps }: { blockProps: UseErrorBlockProps }) {
  return (
    <Block {...blockProps}>
      <Text textSize="md" className="text-center">
        This page is under construction.
      </Text>
    </Block>
  );
}

function FourOhFourBlock({
  blockData,
  blockProps,
}: {
  blockProps: UseErrorBlockProps;
  blockData: UseErrorBlockData;
}) {
  const router = useRouter();
  const { path } = blockData;

  return (
    <Block {...blockProps}>
      <Text textSize="md" className="text-center">
        Sorry, the page
        <br />
        <Text as="span" textSize="lg" className="font-mono text-accent italic">
          {path}
        </Text>
        <br />
        could not be found.
      </Text>
      <Button
        onClick={() => router.history.back()}
        color="primary"
        className="mx-auto"
      >
        Go Back
      </Button>
    </Block>
  );
}

function FourOhOneBlock({
  blockData,
  blockProps,
}: {
  blockProps: UseErrorBlockProps;
  blockData: UseErrorBlockData;
}) {
  const router = useRouter();
  const { path } = blockData;

  return (
    <Block {...blockProps}>
      <Text textSize="md" className="text-center">
        Sorry, you do not have permission to access the page
        <br />
        <Text as="span" textSize="lg" className="font-mono text-accent italic">
          {path}
        </Text>
      </Text>
      <Button
        onClick={() => router.history.back()}
        color="primary"
        className="mx-auto"
      >
        Go Back
      </Button>
    </Block>
  );
}

function FourTwentyNineBlock({
  blockProps,
}: {
  blockProps: UseErrorBlockProps;
  blockData: UseErrorBlockData;
}) {
  return (
    <Block {...blockProps}>
      <div className="text-6xl text-center">🐢</div>
      <Text textSize="md" className="text-center">
        You're making requests too quickly. Wait a moment and try again.
      </Text>
    </Block>
  );
}
