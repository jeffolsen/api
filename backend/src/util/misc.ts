export const getSortOrder = (sort: string) => {
  if (sort.startsWith("-")) {
    return { [sort.slice(1)]: "desc" };
  }
  return { [sort]: "asc" };
};

export const getSortOrders = (sorts: string[]) => {
  return sorts && { orderBy: sorts.map((sort) => getSortOrder(sort)) };
};

export const getSkipCount = (page?: number, pageSize?: number) => {
  if (page && pageSize) {
    return (Number(page) - 1) * Number(pageSize);
  }
  return undefined;
};

export const getTakeCount = (pageSize?: number) => {
  if (pageSize) {
    return Number(pageSize);
  }
  return undefined;
};

export const getPagination = (page?: number, pageSize?: number) => {
  return {
    skip: getSkipCount(page, pageSize),
    take: getTakeCount(pageSize),
  };
};
