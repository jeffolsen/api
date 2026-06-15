import { PropsWithChildren } from "react";
import { HeadingLevelProvider } from "@/contexts/HeadingLevelProvider";
import Wrapper, { WrapperProps } from "@/components/common/Wrapper";
import Heading, { HeadingProps } from "@/components/common/Heading";
import { TComponent } from "@/network/component/types";
import { TItemWithIncludes } from "@/network/item/types";
import ScrollInFade from "@/components/common/ScrollInFade";
import clsx, { ClassValue } from "clsx";
import { ClientTypeName } from "@/network/clients/type";

export type BlockWrapperProps<T> = {
  name?: string;
  headingProps?: HeadingProps;
  className?: string;
  settings: {
    width?: WrapperProps["width"];
    padded?: WrapperProps["padded"];
    isPrimaryContent: boolean;
    themeCss?: ClassValue;
    critical?: boolean;
    textAlign?: "text-center" | "text-left";
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
  const align = settings.textAlign || "text-center";
  return (
    <div
      className={clsx([
        "w-full h-full",
        settings?.location !== "header" && "pb-14 pt-8 gap-6 flex flex-col",
        settings?.themeCss ? settings.themeCss : "text-base-content",
      ])}
    >
      <Wrapper
        width={settings.width || "md"}
        padded={settings.padded}
        className={className}
      >
        {name && (
          <ScrollInFade
            className={"mx-auto w-full"}
            critical={settings.critical}
          >
            <Heading
              headingSize="xl"
              headingStyles={clsx(["uppercase font-bold pb-4", align])}
              {...headingProps}
            >
              {name}
            </Heading>
          </ScrollInFade>
        )}
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
  component: TComponent;
  params: Record<string, string>;
  path: string;
  item?: TItemWithIncludes;
  critical?: boolean;
  renderFor?: ClientTypeName;
};

// returned as the result of the data hook for a block component, passed into the block component for rendering.
// blockProps are generally unique to the block component with some common ones like name, and settings.width and settings.isPrimaryContent.
export type BlockProps<T> = {
  name: string;
  settings: {
    width?: WrapperProps["width"];
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
