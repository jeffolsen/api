// import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002/api"
    : "website/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export { axios };

export type RegisterFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

const register = async (userData: RegisterFormInput) => {
  // Replace with your actual API endpoint
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const useApi = () => {
  return {
    register,
  };
};
