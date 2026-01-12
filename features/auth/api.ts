import { axiosInstance } from "@/lib/api";
import { LoginResponse, User } from "@/features/auth/types";

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export const SignIn = async (data: { email: string; password: string }) => {
  return axiosInstance.post<LoginResponse>("/auth/signin", data);
};

export const SignUp = async (data: RegisterCredentials) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  
  return axiosInstance.post<LoginResponse>("/auth/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const GetUserProfile = async () => {
  return axiosInstance.get<User>("/users/");
};
