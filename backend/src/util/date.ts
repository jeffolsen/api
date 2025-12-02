import {
  ACCESS_TOKEN_LIFESPAN,
  SESSION_TOKEN_LIFESPAN,
  VERIFICATION_CODE_LIFESPAN,
} from "../config/constants";

export const getNewVerificationCodeExpirationDate = (): Date =>
  new Date(Date.now() + VERIFICATION_CODE_LIFESPAN);

export const getNewAccessTokenExpirationDate = (): Date =>
  new Date(Date.now() + ACCESS_TOKEN_LIFESPAN);

export const getNewRefreshTokenExpirationDate = (): Date =>
  new Date(Date.now() + SESSION_TOKEN_LIFESPAN);

export const beforeNow = (date: Date): boolean =>
  new Date(date).getTime() <= Date.now();

export const afterNow = (date: Date): boolean => !beforeNow(date);

const date = (date: Date) => {
  return {
    isBeforeNow: () => beforeNow(date),
    isAfterNow: () => afterNow(date),
  };
};

export default date;
