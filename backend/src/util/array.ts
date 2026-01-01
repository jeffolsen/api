import { TagName } from "../db/client";

export const isTagArray = (variable: unknown): variable is TagName[] => {
  if (!Array.isArray(variable)) {
    return false;
  }

  const tagList = Object.values(TagName);
  return variable.every((element) => tagList.includes(element as TagName));
};
