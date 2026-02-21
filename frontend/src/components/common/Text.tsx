import { PropsWithChildren } from "react";
import clsx, { ClassValue } from "clsx";

import { sizeClasses } from "./helpers/contentStyles";

type As = "p" | "span" | "div";
type Size = keyof typeof sizeClasses;
type TextProps = {
  as?: As;
  textSize?: Size;
  className?: ClassValue;
};

function Text({
  as: Component = "p",
  textSize = "none",
  className,
  children,
}: PropsWithChildren<TextProps>) {
  return (
    <Component
      className={clsx("whitespace-pre-line", sizeClasses[textSize], className)}
    >
      {children}
    </Component>
  );
}

export default Text;
