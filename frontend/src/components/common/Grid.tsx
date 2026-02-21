import clsx from "clsx";

type ColumnProps = {
  base: "1" | "2" | "3" | "4" | "5" | "6";
  sm: "1" | "2" | "3" | "4" | "5" | "6";
  md: "1" | "2" | "3" | "4" | "5" | "6";
  lg: "1" | "2" | "3" | "4" | "5" | "6";
  xl: "1" | "2" | "3" | "4" | "5" | "6";
};

function Grid({
  items,
  columns,
}: {
  items: React.ReactNode[];
  columns?: ColumnProps;
}) {
  const mergedColumns = {
    ...{
      base: "1",
      sm: "1",
      md: "2",
      lg: "2",
      xl: "2",
    },
    ...columns,
  };

  return (
    <div
      className={clsx([
        "grid grid-flow-row auto-rows-fr gap-4",
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
      ])}
    >
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}

export default Grid;
