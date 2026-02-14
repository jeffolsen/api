import { PropsWithChildren } from "react";
import { HeadingLevelProvider } from "../../contexts/HeadingLevelProvider";
import Wrapper, { WrapperProps } from "../common/Wrapper";
import Heading from "../common/Heading";

export interface BlockProps {
  path?: string;
  title: string;
  settings: {
    isprimaryContent?: boolean;
    width?: WrapperProps["width"];
    theme?: string;
    contentFilter?: { id?: string; tags?: string[] };
  };
}

function Block({ title, settings, children }: PropsWithChildren<BlockProps>) {
  if (settings?.isprimaryContent) {
    return <InnerBlock {...{ title, settings, children }} />;
  }
  return (
    <HeadingLevelProvider>
      <InnerBlock {...{ title, settings, children }} />
    </HeadingLevelProvider>
  );
}

function InnerBlock({
  title,
  settings: { isprimaryContent, width } = {},
  children,
}: PropsWithChildren<BlockProps>) {
  return (
    <Wrapper width={width || "md"}>
      <Heading
        headingSize="lg"
        headingStyles={"uppercase font-bold text-primary-content"}
        headingDecorator={isprimaryContent ? "underline" : "none"}
      >
        {title}
      </Heading>
      {children}
    </Wrapper>
  );
}

export default Block;
