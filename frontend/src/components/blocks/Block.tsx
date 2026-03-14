import { PropsWithChildren } from "react";
import { HeadingLevelProvider } from "../../contexts/HeadingLevelProvider";
import Wrapper, { WrapperProps } from "../common/Wrapper";
import Heading from "../common/Heading";

export type BlockUrlIdentifier = {
  urlIdentifier: string;
};

export interface BlockProps {
  path?: string;
  params?: Record<string, string>;
  title: string;
  id: number;
  settings: {
    isprimaryContent?: boolean;
    showOnLoggedinState?: "LOGGED_IN" | "LOGGED_OUT" | "BOTH";
    width?: WrapperProps["width"];
    theme?: string;
    contentFilter?: { id?: string; tags?: string[] };
  };
}

function Block({
  title,
  settings,
  children,
}: PropsWithChildren<Omit<BlockProps, "id">>) {
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
}: PropsWithChildren<Omit<BlockProps, "id">>) {
  return (
    <Wrapper width={width || "md"}>
      <Heading
        headingSize="lg"
        headingStyles={"uppercase font-bold text-primary-content text-center"}
        headingDecorator={isprimaryContent ? "strike" : "none"}
      >
        {title}
      </Heading>
      {children}
    </Wrapper>
  );
}

export default Block;
