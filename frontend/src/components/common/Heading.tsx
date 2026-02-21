import clsx, { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { useHeadingLevel } from "../../contexts/HeadingLevelContext";
export { HeadingLevelProvider } from "../../contexts/HeadingLevelProvider";

export type HeadingProps = {
  headingSize?: keyof typeof sizes;
  headingDecorator?: "underline" | "strike" | "none";
  headingStyles?: ClassValue;
};

const levels = ["h1", "h2", "h3", "h4", "h5", "h6", "p"] as const;

const sizes = {
  xs: "text-base tracking-widest",
  sm: "text-lg tracking-widest",
  md: "text-2xl tracking-widest",
  lg: "text-4xl tracking-widest",
  xl: "text-6xl tracking-widest",
  xxl: "text-9xl tracking-widest",
};

function Heading({
  headingSize = "md",
  headingDecorator = "none",
  headingStyles,
  children,
}: PropsWithChildren<HeadingProps>) {
  const level = useHeadingLevel();
  const Tag = levels[level];
  const strike = headingDecorator === "strike";
  const underline = headingDecorator === "underline";
  return (
    <div
      className={clsx([
        underline && "flex flex-col gap-4",
        strike && "sm:flex items-center gap-0 sm:gap-4",
        headingStyles,
      ])}
    >
      {strike && (
        <hr
          className={clsx(
            "flex-1 sm:inline border-current",
            strike && "hidden",
          )}
        />
      )}
      <Tag className={clsx([sizes[headingSize]])}>{children}</Tag>
      {(underline || strike) && (
        <hr
          className={clsx(
            "flex-1 sm:inline border-current",
            strike && "hidden",
          )}
        />
      )}
    </div>
  );
}

export default Heading;
