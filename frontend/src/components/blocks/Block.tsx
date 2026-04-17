import { PropsWithChildren } from "react";
import { HeadingLevelProvider } from "../../contexts/HeadingLevelProvider";
import Wrapper, { WrapperProps } from "../common/Wrapper";
import Heading, { HeadingProps } from "../common/Heading";
import { LocalFeedComponent } from "../../config/routes";
import { TComponent } from "../../network/component";

export type BlockWrapperProps<T> = {
  name?: string;
  headingProps?: HeadingProps;
  settings: {
    width?: WrapperProps["width"];
    padded?: WrapperProps["padded"];
    isPrimaryContent: boolean;
  } & T;
};

function BlockWrapper<T extends Record<string, unknown>>({
  name,
  headingProps,
  settings,
  children,
}: PropsWithChildren<BlockWrapperProps<T>>) {
  if (settings.isPrimaryContent) {
    return (
      <InnerBlockWrapper
        name={name}
        headingProps={headingProps}
        settings={settings}
      >
        {children}
      </InnerBlockWrapper>
    );
  }
  return (
    <HeadingLevelProvider>
      <InnerBlockWrapper
        name={name}
        headingProps={headingProps}
        settings={settings}
      >
        {children}
      </InnerBlockWrapper>
    </HeadingLevelProvider>
  );
}

function InnerBlockWrapper<T extends Record<string, unknown>>({
  name,
  headingProps,
  settings,
  children,
}: PropsWithChildren<BlockWrapperProps<T>>) {
  return (
    <Wrapper width={settings.width || "md"} padded={settings.padded}>
      {name && (
        <Heading
          headingSize="lg"
          headingStyles={"uppercase font-bold text-neutral-content text-center"}
          headingDecorator={settings.isPrimaryContent ? "strike" : "none"}
          {...headingProps}
        >
          {name}
        </Heading>
      )}
      {children}
    </Wrapper>
  );
}

// I think the plan with this is to create unique searchParams to avoid collisions between blocks and their sub-components, ie filterSetlect_{componentId}
export type BlockUrlIdentifier = {
  urlIdentifier: string;
};

// passed into top level block component default elements and associated data hooks.
export type BlockComponentStandardProps = {
  component: LocalFeedComponent;
  params: Record<string, string>;
  path: string;
};

// returned as the result of the data hook for a block component, passed into the block component for rendering.
// blockProps are generally unique to the block component with some common ones like name, and settings.width and settings.isPrimaryContent.
export type BlockProps<T> = {
  name: string;
  settings: {
    width: WrapperProps["width"];
    isPrimaryContent: boolean;
  } & T;
};

// returned as the result of the data hook for a block component, passed into the block component for rendering.
// blockData is generally unique to the block component.
export type BlockData<T> = { id: TComponent["id"] } & T;

export type BlockComponentStandardSuccessReturnType<T, U> = {
  type: "success";
  blockProps: BlockProps<T>;
  blockData: BlockData<U>;
};

export type BlockStandardFailedDataReturnType = {
  type: "error";
  error: string;
  params: Record<string, string>;
  path: string;
};

export type BlockComponentDataReturnType<T, U> =
  | BlockStandardFailedDataReturnType
  | BlockComponentStandardSuccessReturnType<T, U>;

export default BlockWrapper;
