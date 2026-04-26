import { ChevronDown, ChevronUp } from "lucide-react";
import { IconButton, XButton } from "../common/Button";

export default function ComponentSchemaArrayOrderable<
  T extends { id: string },
>({
  label,
  fields,
  index,
  remove,
  swap,
}: {
  label: string;
  fields: T[];
  index: number;
  remove: (index: number) => void;
  swap: (from: number, to: number) => void;
}) {
  return (
    <div className="card compact rounded shadow-xl">
      <div className="card-body flex-row items-center gap-4">
        <div className="flex flex-col gap-2">
          <IconButton
            color="primary"
            disabled={index === 0}
            onClick={() => swap(index, Math.max(0, index - 1))}
            size="xs"
          >
            <ChevronUp />
          </IconButton>
          <IconButton
            color="primary"
            disabled={index === fields.length - 1}
            onClick={() => swap(index, Math.min(index + 1, fields.length - 1))}
            size="xs"
          >
            <ChevronDown />
          </IconButton>
        </div>
        <span className="truncate max-w-full mr-6">{label}</span>
        <XButton
          onClick={() => {
            remove(index);
          }}
          size="xs"
        />
      </div>
    </div>
  );
}
