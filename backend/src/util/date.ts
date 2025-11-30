import {
  ACCESS_TOKEN_LIFESPAN,
  SESSION_TOKEN_LIFESPAN,
} from "../config/constants";

export const getNewAccessTokenExpirationDate = (): Date =>
  new Date(new Date().getDate() + ACCESS_TOKEN_LIFESPAN);

export const getNewRefreshTokenExpirationDate = (): Date =>
  new Date(new Date().getDate() + SESSION_TOKEN_LIFESPAN);

export const beforeNow = (date: Date): boolean => {
  return date.getDate() < new Date().getDate();
};

export const afterNow = (date: Date): boolean => {
  return !beforeNow(date);
};

const D = (date: Date) => {
  return {
    isBeforeNow: () => beforeNow(date),
    isAfterNow: () => afterNow(date),
  };
};

export default D;
