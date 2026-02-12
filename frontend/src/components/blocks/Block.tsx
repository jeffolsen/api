import { PropsWithChildren } from "react";
import { HeadingLevelProvider } from "../../contexts/HeadingLevelProvider";
import Wrapper, { WrapperProps } from "../common/Wrapper";
import Heading from "../common/Heading";

export interface BlockProps {
  title: string;
  isprimaryContent?: boolean;
  wrapperProps?: WrapperProps;
}

function Block({
  title,
  wrapperProps,
  isprimaryContent = false,
  children,
}: PropsWithChildren<BlockProps>) {
  if (isprimaryContent) {
    return (
      <InnerBlock {...{ title, wrapperProps, isprimaryContent, children }} />
    );
  }
  return (
    <HeadingLevelProvider>
      <InnerBlock {...{ title, wrapperProps, children }} />
    </HeadingLevelProvider>
  );
}

function InnerBlock({
  title,
  wrapperProps,
  isprimaryContent = false,
  children,
}: PropsWithChildren<BlockProps>) {
  return (
    <Wrapper width="sm" {...wrapperProps}>
      <Heading
        headingSize="lg"
        headingStyles={"uppercase font-bold text-rimary-content"}
        headingDecorator={isprimaryContent ? "underline" : "none"}
      >
        {title}
      </Heading>
      {children}
    </Wrapper>
  );
}

export default Block;
