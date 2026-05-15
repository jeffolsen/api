import { useNavigate, useRouterState } from "@tanstack/react-router";

export const useSearchParam = (key: string) => {
  const value = useRouterState({
    select: (s) =>
      (s.location.search as Record<string, string>)[key] ?? undefined,
  });

  const navigate = useNavigate();

  const setValue = (newValue: string | undefined) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigate as any)({
      resetScroll: false,
      search: (prev: Record<string, string | undefined>) => {
        const next = { ...prev };
        if (newValue === undefined || newValue === "") {
          delete next[key];
        } else {
          next[key] = newValue;
        }
        return next;
      },
    });
  };

  return [value, setValue] as const;
};

export const useSearchParamWithDefault = (
  key: string,
  defaultValue: string,
): [string, (newValue: string | undefined) => void] => {
  const value = useRouterState({
    select: (s) =>
      (s.location.search as Record<string, string>)[key] ?? defaultValue,
  });

  const navigate = useNavigate();

  const setValue = (newValue: string | undefined) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigate as any)({
      resetScroll: false,
      search: (prev: Record<string, string | undefined>) => {
        const next = { ...prev };
        if (
          newValue === undefined ||
          newValue === defaultValue ||
          newValue === ""
        ) {
          delete next[key];
        } else {
          next[key] = newValue;
        }
        return next;
      },
    });
  };

  return [value, setValue];
};

export const useSearchParamsWithDefaults = (
  defaults: Record<string, string>,
): [
  Record<string, string>,
  (key: string, newValue: string | undefined) => void,
] => {
  const values = useRouterState({
    select: (s) => {
      const search = s.location.search as Record<string, string>;
      return Object.fromEntries(
        Object.entries(defaults).map(([k, defaultValue]) => [
          k,
          search[k] ?? defaultValue,
        ]),
      );
    },
  });

  const navigate = useNavigate();

  const setValue = (key: string, newValue: string | undefined) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigate as any)({
      search: (prev: Record<string, string | undefined>) => {
        const next = { ...prev };
        if (
          newValue === undefined ||
          newValue === defaults[key] ||
          newValue === ""
        ) {
          delete next[key];
        } else {
          next[key] = newValue;
        }
        return next;
      },
    });
  };

  return [values, setValue];
};
