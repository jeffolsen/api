import { createContext, useContext } from "react";
import { AxiosInstance } from "axios";
import api, { setIsAuthenticated, isAuthenticated } from "../network/api";

type AuthContextType = {
  api: AxiosInstance;
  isAuthenticated: () => boolean;
  setIsAuthenticated: (value: boolean) => void;
};

export const AuthState = createContext<AuthContextType>({
  api,
  isAuthenticated,
  setIsAuthenticated,
});

export const useAuthState = () => {
  const isLoggedIn = useContext(AuthState);
  return isLoggedIn;
};
