import clsx, { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { useHeadingLevel } from "../../contexts/HeadingLevelContext";
export { HeadingLevelProvider } from "../../contexts/HeadingLevelProvider";

export type HeadingProps = {
  headingSize?: keyof typeof sizes;
  headingDecorator?:
    | "underline"
    | "strike"
    | "left-strike"
    | "right-strike"
    | "none";
  headingStyles?: ClassValue;
};

const levels = ["h1", "h2", "h3", "h4", "h5", "h6", "p"] as const;

const sizes = {
  xs: "text-base tracking-widest font-extrabold",
  sm: "text-lg tracking-widest font-extrabold",
  md: "text-2xl tracking-widest font-extrabold",
  lg: "text-3xl md:text-4xl tracking-wider font-black",
  xl: "text-4xl md:text-5xl xl:text-6xl tracking-wider font-black",
  xxl: "text-5xl md:text-7xl lg:text-8xl xl:text-9xl tracking-noraml font-black",
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
  const leftStrike = headingDecorator === "left-strike";
  const rightStrike = headingDecorator === "right-strike";
  return (
    <div
      className={clsx([
        underline && "flex flex-col gap-4",
        (strike || leftStrike || rightStrike) &&
          "sm:flex items-center gap-0 sm:gap-4",
        headingStyles,
      ])}
    >
      {(strike || leftStrike) && (
        <hr
          className={clsx(
            "flex-1 sm:inline border-current",
            strike && "hidden",
            leftStrike && "hidden",
            rightStrike && "hidden",
          )}
        />
      )}
      <Tag className={clsx([sizes[headingSize]])}>{children}</Tag>
      {(underline || strike || rightStrike) && (
        <hr
          className={clsx(
            "flex-1 sm:inline border-current",
            strike && "hidden",
            leftStrike && "hidden",
            rightStrike && "hidden",
          )}
        />
      )}
    </div>
  );
}

export default Heading;
