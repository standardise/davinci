import { axiosInstance } from "@/lib/api";
import {
  App,
  AppListResponse,
  CreateAppPayload,
} from "@/features/applications/types";

export const ListApps = async (params?: { search?: string }) => {
  return axiosInstance.get<AppListResponse>("/apps", { params });
};

export const GetApp = async (id: string) => {
  return axiosInstance.get<App>(`/apps/${id}`);
};

export const CreateApp = async (data: CreateAppPayload) => {
  return axiosInstance.post<App>("/apps", data);
};

export const DeleteApp = async (id: string) => {
  return axiosInstance.delete(`/apps/${id}`);
};

export const StartTraining = async (id: string) => {
  return axiosInstance.post(`/apps/${id}/train`);
};

export const CancelTraining = async (id: string) => {
  return axiosInstance.post(`/apps/${id}/train/cancel`);
};

export const ArchiveApp = async (id: string) => {
  return axiosInstance.delete(`/apps/${id}`);
};
