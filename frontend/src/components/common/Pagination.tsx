import Button from "./Button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchParamWithDefault } from "../../hooks/useSearchParam";
import { useEffect } from "react";

export const PaginateItemBar = ({
  pageSize,
  itemCount,
}: {
  pageSize: number;
  itemCount: number;
}) => {
  const [currentPage, setCurrentPage] = useSearchParamWithDefault("page", "1");

  const numericPage = parseInt(currentPage);
  const totalPages = Math.ceil(itemCount / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(String(newPage));
    }
  };

  useEffect(() => {
    if (numericPage > 1 && itemCount < pageSize * (numericPage - 1) + 1) {
      setCurrentPage("1");
    }
  }, [itemCount, pageSize, numericPage, setCurrentPage]);

  return (
    <div className="join items-center">
      {numericPage > 1 && (
        <Button
          color="primary"
          onClick={() => handlePageChange(1)}
          className={"join-item"}
        >
          <ChevronFirst size={16} />
        </Button>
      )}
      {numericPage > 3 &&
        Math.floor((1 + numericPage) / 2) !== numericPage - 1 && (
          <Button
            color="primary"
            onClick={() => handlePageChange(Math.floor((1 + numericPage) / 2))}
            className={"hidden sm:flex join-item"}
          >
            {Math.round((1 + numericPage - 1) / 2)}
          </Button>
        )}
      {numericPage > 2 && (
        <Button
          color="primary"
          onClick={() => handlePageChange(numericPage - 1)}
          className={"join-item"}
        >
          <ChevronLeft size={16} />
        </Button>
      )}
      <Button className={"join-item"}>
        Page {numericPage} of {totalPages}
      </Button>
      {numericPage + 1 < totalPages && (
        <Button
          color="primary"
          onClick={() => handlePageChange(numericPage + 1)}
          className={"join-item"}
        >
          <ChevronRight size={16} />
        </Button>
      )}
      {numericPage + 2 < totalPages &&
        Math.floor((numericPage + totalPages) / 2) !== numericPage + 1 && (
          <Button
            color="primary"
            onClick={() =>
              handlePageChange(Math.floor((numericPage + totalPages) / 2))
            }
            className={"hidden sm:flex join-item"}
          >
            {Math.floor((numericPage + totalPages) / 2)}
          </Button>
        )}
      {numericPage < totalPages && (
        <Button
          color="primary"
          onClick={() => handlePageChange(totalPages)}
          className={"join-item"}
        >
          <ChevronLast size={16} />
        </Button>
      )}
    </div>
  );
};
