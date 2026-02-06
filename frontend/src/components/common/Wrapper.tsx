import { PropsWithChildren } from "react";
import clsx from "clsx";

type WrapperProps = {
  width?: "sm" | "md" | "lg";
};

const widths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
};

const Wrapper = ({
  width = "md",
  children,
}: PropsWithChildren<WrapperProps>) => {
  return (
    <div className="flex items-start justify-center px-6">
      <div
        className={clsx(["w-full h-full flex flex-col gap-4", widths[width]])}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
