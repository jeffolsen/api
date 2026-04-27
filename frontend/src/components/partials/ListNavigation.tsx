import { paths } from "@/config/routes";
import { useSearchParam } from "@/hooks/useSearchParam";
import Button from "@/components/common/Button";
import DropDownMenu from "@/components/common/DropDownMenu";
import { PaginateItemBar } from "@/components/common/Pagination";
import { Plus } from "lucide-react";
import { useMemo } from "react";

export const ListNavigation = ({
  pageSize,
  totalCount,
  text = "New Item",
  newPath = paths.cmsItemCreate,
}: {
  pageSize: number;
  totalCount: number;
  text?: string;
  newPath?: string;
}) => {
  console.log(
    "Rendering ListNavigation with totalCount:",
    totalCount,
    typeof totalCount,
  );
  return (
    <div className="flex flex-col md:flex-row gap-4 sm:justify-between md:items-center">
      <PaginateItemBar pageSize={pageSize} itemCount={totalCount} />
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

export type ListSortOption = {
  id: string;
  label: string;
};

export type ListSortControlProps = {
  sortOptions?: ListSortOption[];
};

export const ListSortControl = ({
  sortOptions = [
    { id: "-updatedAt", label: "Updated At (Newest)" },
    { id: "updatedAt", label: "Updated At (Oldest)" },
    { id: "sortName", label: "Sort Name (A-Z)" },
    { id: "-sortName", label: "Sort Name (Z-A)" },
  ],
}: ListSortControlProps) => {
  const [sort] = useSearchParam("sort");
  const [, setSort] = useSearchParam("sort");

  const initialSortIndex = useMemo(() => {
    if (!sort) return 0;
    const foundIndex = sortOptions.findIndex((option) => option.id === sort);
    return foundIndex !== -1 ? foundIndex : 0;
  }, [sort, sortOptions]);

  return (
    <DropDownMenu
      className="w-full sm:w-48"
      value={sortOptions[initialSortIndex]}
      items={sortOptions}
      onChange={(item: ListSortOption) => {
        setSort(item.id);
      }}
    />
  );
};
