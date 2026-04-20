import { PropsWithChildren } from "react";
import clsx from "clsx";

export type WrapperProps = {
  width?: keyof typeof widths;
  padded?: boolean | "tablet" | "desktop";
  className?: string;
};

const widths = {
  xs: "max-w-md",
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-screen-2xl",
} as const;

const Wrapper = ({
  width = "md",
  padded = true,
  className,
  children,
}: PropsWithChildren<WrapperProps>) => {
  return (
    <div
      className={clsx([
        "flex items-start justify-center w-full max-h-full",
        padded === "desktop"
          ? "lg:px-4"
          : padded === "tablet"
            ? "md:px-4"
            : padded
              ? "px-4"
              : "",
        className,
      ])}
    >
      <div
        className={clsx([
          "relative w-full h-full flex flex-col items-stretch gap-4",
          widths[width],
        ])}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
