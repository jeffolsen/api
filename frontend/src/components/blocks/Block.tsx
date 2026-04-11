import { PropsWithChildren } from "react";
import { HeadingLevelProvider } from "../../contexts/HeadingLevelProvider";
import Wrapper, { WrapperProps } from "../common/Wrapper";
import Heading from "../common/Heading";
import { TComponent } from "../../network/component";
import { LocalFeedComponent } from "../../config/routes";

export type TBlockDataProps =
  | {
      feedComponent?: TComponent;
      pageProps?: BlockProps;
    }
  | undefined;

export type BlockUrlIdentifier = {
  urlIdentifier: string;
};

export interface BlockProps {
  path?: string;
  params?: Record<string, string>;
  title: string;
  id: number;
  settings: {
    isPrimaryContent?: boolean;
    width?: WrapperProps["width"];
  } & Record<string, unknown>;
}

function Block({
  title,
  settings,
  children,
}: PropsWithChildren<Omit<BlockProps, "id">>) {
  if (settings?.isPrimaryContent) {
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
  settings: { isPrimaryContent, width } = {},
  children,
}: PropsWithChildren<Omit<BlockProps, "id">>) {
  return (
    <Wrapper width={width || "md"}>
      <Heading
        headingSize="lg"
        headingStyles={"uppercase font-bold text-primary-content text-center"}
        headingDecorator={isPrimaryContent ? "strike" : "none"}
      >
        {title}
      </Heading>
      {children}
    </Wrapper>
  );
}

export type BlockStandardProps = {
  component: LocalFeedComponent;
  params: Record<string, string>;
  path: string;
};

export default Block;
