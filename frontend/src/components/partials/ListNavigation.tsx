import Button from "../common/Button";
import { PaginateItemBar } from "../common/Pagination";
import { Plus } from "lucide-react";

export const ListNavigation = ({
  initialPageSize,
  totalCount,
  text = "New Item",
  newPath = "/items/new",
}: {
  initialPageSize: number;
  totalCount: number;
  text?: string;
  newPath?: string;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 sm:justify-between items-center">
      <PaginateItemBar pageSize={initialPageSize} itemCount={totalCount} />
      <Button
        as="Link"
        to={newPath}
        size="md"
        color="primary"
        className="w-full md:w-auto self-end"
      >
        <Plus size={16} /> {text}
      </Button>
    </div>
  );
};
