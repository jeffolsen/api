import clsx from "clsx";
import { motion } from "motion/react";

type ColumnProps = {
  base?: "1" | "2" | "3" | "4" | "5" | "6";
  sm?: "1" | "2" | "3" | "4" | "5" | "6";
  md?: "1" | "2" | "3" | "4" | "5" | "6";
  lg?: "1" | "2" | "3" | "4" | "5" | "6";
  xl?: "1" | "2" | "3" | "4" | "5" | "6";
};

export type GridItem = {
  id: string | number;
  content: React.ReactNode;
};

function isGridItem(item: GridItem | React.ReactNode): item is GridItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "content" in item
  );
}

type GridProps = {
  items: (GridItem | React.ReactNode)[];
  columns?: ColumnProps;
  onEmpty?: () => React.ReactNode;
};

function Grid({ items, columns = {}, onEmpty = () => null }: GridProps) {
  const mergedColumns = { base: "1" as const, ...columns };

  if (items.length === 0) {
    return <>{onEmpty()}</>;
  }

  return (
    <div
      className={clsx([
        "w-full grid grid-flow-row auto-rows-fr gap-4",
        ...columnClasses(mergedColumns),
      ])}
    >
      {items.map((item, index) =>
        isGridItem(item) ? (
          <motion.div layout key={item.id}>
            {item.content}
          </motion.div>
        ) : (
          <div key={index}>{item}</div>
        ),
      )}
    </div>
  );
}

function columnClasses(
  mergedColumns: ColumnProps & { base: NonNullable<ColumnProps["base"]> },
) {
  return [
    mergedColumns["base"] === "1"
      ? "grid-cols-1"
      : mergedColumns["base"] === "2"
        ? "grid-cols-2"
        : mergedColumns["base"] === "3"
          ? "grid-cols-3"
          : mergedColumns["base"] === "4"
            ? "grid-cols-4"
            : mergedColumns["base"] === "5"
              ? "grid-cols-5"
              : mergedColumns["base"] === "6"
                ? "grid-cols-6"
                : "",
    mergedColumns["sm"] === "1"
      ? "sm:grid-cols-1"
      : mergedColumns["sm"] === "2"
        ? "sm:grid-cols-2"
        : mergedColumns["sm"] === "3"
          ? "sm:grid-cols-3"
          : mergedColumns["sm"] === "4"
            ? "sm:grid-cols-4"
            : mergedColumns["sm"] === "5"
              ? "sm:grid-cols-5"
              : mergedColumns["sm"] === "6"
                ? "sm:grid-cols-6"
                : "",
    mergedColumns["md"] === "1"
      ? "md:grid-cols-1"
      : mergedColumns["md"] === "2"
        ? "md:grid-cols-2"
        : mergedColumns["md"] === "3"
          ? "md:grid-cols-3"
          : mergedColumns["md"] === "4"
            ? "md:grid-cols-4"
            : mergedColumns["md"] === "5"
              ? "md:grid-cols-5"
              : mergedColumns["md"] === "6"
                ? "md:grid-cols-6"
                : "",
    mergedColumns["lg"] === "1"
      ? "lg:grid-cols-1"
      : mergedColumns["lg"] === "2"
        ? "lg:grid-cols-2"
        : mergedColumns["lg"] === "3"
          ? "lg:grid-cols-3"
          : mergedColumns["lg"] === "4"
            ? "lg:grid-cols-4"
            : mergedColumns["lg"] === "5"
              ? "lg:grid-cols-5"
              : mergedColumns["lg"] === "6"
                ? "lg:grid-cols-6"
                : "",
    mergedColumns["xl"] === "1"
      ? "xl:grid-cols-1"
      : mergedColumns["xl"] === "2"
        ? "xl:grid-cols-2"
        : mergedColumns["xl"] === "3"
          ? "xl:grid-cols-3"
          : mergedColumns["xl"] === "4"
            ? "xl:grid-cols-4"
            : mergedColumns["xl"] === "5"
              ? "xl:grid-cols-5"
              : mergedColumns["xl"] === "6"
                ? "xl:grid-cols-6"
                : "",
  ];
}

export default Grid;
