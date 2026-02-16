import { useRequestLogin, useLoginWithOTP } from "./login";
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

  return {
    isLoggedIn,
    profile,
    register,
    requestLogin,
    loginWithOTP,
    logout,
  };
};
