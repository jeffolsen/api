import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, login, register, submitOTP } from "./api";

export const useProfile = () => {
  return useQuery({ queryKey: ["profile"], queryFn: getProfile });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      console.log("congrats you registered");
    },
    onError: (error) => {
      console.error("useRegister", error);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.setQueryData(["profile"], { pendingAction: "LOGIN" });
    },
    onError: (error) => {
      console.error("useLogin", error);
    },
  });
};

export const useSubmitOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitOTP,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
    onError: (error) => {
      console.error("useSubmitOTP", error);
    },
  });
};

export const useApi = () => {
  const profile = useProfile();
  const login = useLogin();
  const register = useRegister();
  const submitOTP = useSubmitOTP();

  return { profile, register, login, submitOTP };
};
