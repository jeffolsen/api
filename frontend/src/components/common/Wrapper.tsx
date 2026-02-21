import { PropsWithChildren } from "react";
import clsx from "clsx";

export type WrapperProps = {
  width?: keyof typeof widths;
};

const widths = {
  xs: "max-w-md",
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
} as const;

const Wrapper = ({
  width = "md",
  children,
}: PropsWithChildren<WrapperProps>) => {
  return (
    <div className="flex items-start justify-center px-6 w-full">
      <div
        className={clsx(["w-full h-full flex flex-col gap-4", widths[width]])}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
