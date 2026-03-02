import { useSearchParams } from "react-router";

export const useSearchParam = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) || undefined;

  const setValue = (newValue: string | undefined) => {
    if (newValue === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, newValue);
    }
    setSearchParams(searchParams);
  };

  return [value, setValue] as const;
};

export const useSearchParamWithDefault = (
  key: string,
  defaultValue: string,
): [string, (newValue: string | undefined) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) || defaultValue;

  const setValue = (newValue: string | undefined) => {
    if (newValue === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, newValue);
    }
    setSearchParams(searchParams);
  };

  return [value, setValue];
};
