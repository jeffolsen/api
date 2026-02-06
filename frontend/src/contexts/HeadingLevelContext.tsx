import { createContext, useContext } from "react";

export const HeadingLevel = createContext<number>(-1);

export const useHeadingLevel = () => {
  const level = useContext(HeadingLevel);
  return level;
};
