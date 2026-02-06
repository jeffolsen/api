import { PropsWithChildren, useContext, useMemo } from "react";
import { HeadingLevel } from "./HeadingLevelContext";

export const HeadingLevelProvider = ({ children }: PropsWithChildren) => {
  const level = useContext(HeadingLevel);
  const nextLevel = Math.min(level + 1, 6);

  const value = useMemo(() => nextLevel, [nextLevel]);

  return (
    <HeadingLevel.Provider value={value}>{children}</HeadingLevel.Provider>
  );
};
