import clsx, { ClassValue } from "clsx";
import { sizeClasses } from "./helpers/contentStyles";
import { ReactNode } from "react";

type Size = keyof typeof sizeClasses;
type ListProps = {
  items: ReactNode[];
  textSize?: Size;
  as?: "ul" | "ol";
  listDecorator?: boolean;
  className?: ClassValue;
};

function List({
  items,
  textSize = "none",
  listDecorator = true,
  as: Component = "ul",
  className,
}: ListProps) {
  const decoratorClasses =
    listDecorator && Component === "ul"
      ? "list-disc"
      : listDecorator
        ? "list-decimal"
        : "list-none";

  const actualSize = ["xl", "xxl"].includes(textSize) ? "lg" : textSize;

  return (
    <Component
      className={clsx(
        "whitespace-pre-line list-inside",
        decoratorClasses,
        sizeClasses[actualSize],
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </Component>
  );
}

export default List;
