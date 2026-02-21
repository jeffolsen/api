import clsx from "clsx";

const columnSizes = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
  "3": "grid-cols-3",
  "4": "grid-cols-4",
  "5": "grid-cols-5",
  "6": "grid-cols-6",
};

const columnDefaults = {
  base: "1",
  sm: "1",
  md: "2",
  lg: "2",
  xl: "2",
};

type ColumnSizes = keyof typeof columnSizes;
type ColumnnScreens = keyof typeof columnDefaults;
type ColumnProps = {
  [screen in ColumnnScreens]?: ColumnSizes;
};

function Grid({
  items,
  columns,
}: {
  items: React.ReactNode[];
  columns?: ColumnProps;
}) {
  const columnClasses = Object.entries({ ...columnDefaults, ...columns })
    .map(
      ([screen, size]) =>
        `${screen === "base" ? `${columnSizes[size as ColumnSizes]}` : `${screen}:${columnSizes[size as ColumnSizes]}`}`,
    )
    .join(" ");

  console.log("columnClasses", columnClasses);

  return (
    <div
      className={clsx("grid grid-flow-row auto-rows-fr gap-4", columnClasses)}
    >
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}

export default Grid;
