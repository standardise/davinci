import { axiosInstance } from "@/lib/api";
import {
  App,
  AppListResponse,
  CreateAppPayload,
  UpdateAppPayload,
} from "@/features/applications/types";

export const ListApps = async (params?: { page?: number; limit?: number; public?: boolean }) => {
  return axiosInstance.get<AppListResponse>("/projects", { params });
};

export const GetApp = async (id: string) => {
  return axiosInstance.get<App>(`/projects/${id}`);
};

export const CreateApp = async (data: CreateAppPayload) => {
  return axiosInstance.post<App>("/projects", data);
};

export const UpdateApp = async (id: string, data: UpdateAppPayload) => {
  return axiosInstance.put<App>(`/projects/${id}`, data);
};

export const DeleteApp = async (id: string) => {
  return axiosInstance.delete(`/projects/${id}`);
};

export const StartTraining = async (id: string) => {
  return axiosInstance.post(`/projects/${id}/train`);
};
