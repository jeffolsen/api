export const DATE_RANGES_KEY = "date-ranges" as const;

export type TDateRange = {
  id?: number;
  description?: string;
  startAt: string;
  endAt: string;
};
