import { useSearchParams } from "react-router";

export const useSearchParam = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) || undefined;

  const setValue = (newValue: string | undefined) => {
    if (newValue === undefined || newValue === "") {
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
    if (
      newValue === undefined ||
      newValue === defaultValue ||
      newValue === ""
    ) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, newValue);
    }
    setSearchParams(searchParams);
  };

  return [value, setValue];
};

export const useSearchParamsWithDefaults = (
  defaults: Record<string, string>,
): [
  Record<string, string>,
  (key: string, newValue: string | undefined) => void,
] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const values = Object.fromEntries(
    Object.entries(defaults).map(([key, defaultValue]) => [
      key,
      searchParams.get(key) || defaultValue,
    ]),
  );

  const setValue = (key: string, newValue: string | undefined) => {
    if (
      newValue === undefined ||
      newValue === defaults[key] ||
      newValue === ""
    ) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, newValue);
    }
    setSearchParams(searchParams);
  };

  return [values, setValue];
};
