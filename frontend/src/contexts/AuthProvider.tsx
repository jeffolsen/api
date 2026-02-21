import { PropsWithChildren, useState, useEffect, useCallback } from "react";
import { AuthState } from "./AuthContext";
import api, {
  isAuthenticated,
  setIsAuthenticated,
  REFRESH_ENDPOINT,
} from "../network/api";
import createAuthRefreshInterceptor from "axios-auth-refresh";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState(isAuthenticated());

  const setAuthenticated = (value: boolean) => {
    setAuthState(value);
    setIsAuthenticated(value);
  };

  const authenticated = useCallback(() => {
    setAuthState(isAuthenticated());
    return authState;
  }, [authState]);

  useEffect(() => {
    const refreshAuthLogic = async (): Promise<void> => {
      try {
        const isLoggedIn = authenticated();

        if (!isLoggedIn) {
          throw new Error("No refresh token available");
        }

        console.log("refreshAuthLogic called, attempting to refresh token");

        const refreshResponse = await api.post(REFRESH_ENDPOINT, {
          skipAuthRefresh: true,
        });

        console.log("refreshAuthLogic refreshResponse", refreshResponse);

        if (refreshResponse.status === 401) {
          throw new Error("Refresh token expired");
        }

        setAuthenticated(true);

        return Promise.resolve();
      } catch (error) {
        console.error("refreshAuthLogic error", error);
        setAuthenticated(false);
        return Promise.reject(error);
      }
    };

    const interceptorId = createAuthRefreshInterceptor(api, refreshAuthLogic, {
      statusCodes: [401],
      pauseInstanceWhileRefreshing: true,
    });

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [authenticated]);

  const value = {
    api,
    setIsAuthenticated: setAuthenticated,
    isAuthenticated: authenticated,
  };

  return <AuthState.Provider value={value}>{children}</AuthState.Provider>;
};
