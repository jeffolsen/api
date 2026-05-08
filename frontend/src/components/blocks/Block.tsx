import { PropsWithChildren } from "react";
import { HeadingLevelProvider } from "@/contexts/HeadingLevelProvider";
import Wrapper, { WrapperProps } from "@/components/common/Wrapper";
import Heading, { HeadingProps } from "@/components/common/Heading";
import { LocalFeedComponent } from "@/config/routes";
import { TComponent } from "@/network/component/types";
import ScrollInFade from "@/components/common/ScrollInFade";
import clsx, { ClassValue } from "clsx";

export type BlockWrapperProps<T> = {
  name?: string;
  headingProps?: HeadingProps;
  className?: string;
  settings: {
    width?: WrapperProps["width"];
    padded?: WrapperProps["padded"];
    isPrimaryContent: boolean;
    themeCss?: ClassValue;
  } & T;
};

function BlockWrapper<T extends Record<string, unknown>>({
  name,
  headingProps,
  settings,
  className,
  children,
}: PropsWithChildren<BlockWrapperProps<T>>) {
  if (settings.isPrimaryContent) {
    return (
      <InnerBlockWrapper
        name={name}
        headingProps={headingProps}
        settings={settings}
        className={className}
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
        className={className}
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
  className,
  children,
}: PropsWithChildren<BlockWrapperProps<T>>) {
  return (
    <div
      className={clsx([
        "w-full h-full",
        settings?.location !== "header" && "pb-14 pt-8 gap-6 flex flex-col",
        settings?.themeCss ? settings.themeCss : "text-base-content",
      ])}
    >
      {name && (
        <ScrollInFade className="mx-auto max-w-screen-lg w-full">
          <Heading
            headingSize="xl"
            headingStyles={clsx(["uppercase font-bold text-center"])}
            {...headingProps}
          >
            {name}
          </Heading>
        </ScrollInFade>
      )}
      <Wrapper
        width={settings.width || "md"}
        padded={settings.padded}
        className={className}
      >
        {children}
      </Wrapper>
    </div>
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
  critical?: boolean;
};

// returned as the result of the data hook for a block component, passed into the block component for rendering.
// blockProps are generally unique to the block component with some common ones like name, and settings.width and settings.isPrimaryContent.
export type BlockProps<T> = {
  name: string;
  settings: {
    width: WrapperProps["width"];
    isPrimaryContent: boolean;
    critical?: boolean;
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
