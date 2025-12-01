import {
  ACCESS_TOKEN_LIFESPAN,
  SESSION_TOKEN_LIFESPAN,
} from "../config/constants";

export const getNewAccessTokenExpirationDate = (): Date =>
  new Date(Date.now() + ACCESS_TOKEN_LIFESPAN);

export const getNewRefreshTokenExpirationDate = (): Date =>
  new Date(Date.now() + SESSION_TOKEN_LIFESPAN);

export const beforeNow = (date: string | Date): boolean => {
  return new Date(date).getTime() < Date.now();
};

export const afterNow = (date: string | Date): boolean => {
  return !beforeNow(date);
};

const D = (date: string | Date) => {
  return {
    isBeforeNow: () => beforeNow(date),
    isAfterNow: () => afterNow(date),
  };
};

export default D;
