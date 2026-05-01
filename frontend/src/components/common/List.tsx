import clsx, { ClassValue } from "clsx";
import { sizeClasses } from "@/components/common/helpers/contentStyles";
import { PropsWithChildren } from "react";

type Size = keyof typeof sizeClasses;

type ListProps = {
  textSize?: Size;
  as?: "ul" | "ol";
  listDecorator?: boolean;
  className?: ClassValue;
};

function List({
  textSize = "none",
  listDecorator = true,
  as: Component = "ul",
  className,
  children,
}: PropsWithChildren<ListProps>) {
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
        "list-inside",
        decoratorClasses,
        sizeClasses[actualSize],
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function ListItem({ children }: PropsWithChildren) {
  return <li>{children}</li>;
}

export default List;
