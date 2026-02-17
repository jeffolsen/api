import { useRequestLogin, useLoginWithOTP } from "./login";
import {
  useRequestPasswordReset,
  usePasswordResetWithOTP,
} from "./passwordReset";
import { useProfile } from "./profile";
import { useRegister } from "./register";
import { useIsLoggedIn, useLogout } from "./api";

export const useApi = () => {
  const isLoggedIn = useIsLoggedIn;
  const profile = useProfile();

  const register = useRegister();
  const requestLogin = useRequestLogin();
  const loginWithOTP = useLoginWithOTP();
  const logout = useLogout();

  const requestLogoutAll = () => {};
  const logutAllWithOTP = () => {};

  const requestPasswordReset = useRequestPasswordReset();
  const passwordResetWithOTP = usePasswordResetWithOTP();

  const requestUnregister = () => {};
  const unregisterWithOTP = () => {};

  const requestGenerateApiKey = () => {};
  const generateApiKeyWithOTP = () => {};

  return {
    isLoggedIn,
    profile,
    register,
    requestLogin,
    loginWithOTP,
    requestPasswordReset,
    passwordResetWithOTP,
    requestLogoutAll,
    logutAllWithOTP,
    requestUnregister,
    unregisterWithOTP,
    requestGenerateApiKey,
    generateApiKeyWithOTP,
    logout,
  };
};
