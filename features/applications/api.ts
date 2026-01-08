import { axiosInstance } from "@/lib/api";
import {
  App,
  AppListResponse,
  CreateAppPayload,
  TimeSeriesConfig,
} from "@/features/applications/types";

export const ListApps = async (params?: { search?: string; limit?: number }) => {
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

export interface UpdateConfigPayload {
  name?: string;
  description?: string;
  is_public?: boolean;
  dataset_reference?: string;
  target_column?: string;
  id_column?: string;
  time_series_config?: TimeSeriesConfig;
}

export const UpdateConfiguration = async (
  id: string,
  data: UpdateConfigPayload
) => {
  return axiosInstance.patch(`/apps/${id}/config`, data);
};

export const AddWhitelist = async (id: string, collaborator_id: string) => {
  return axiosInstance.post(`/apps/${id}/whitelist`, { collaborator_id });
};

export const RemoveWhitelist = async (id: string, collaborator_id: string) => {
  return axiosInstance.delete(`/apps/${id}/whitelist`, {
    data: { collaborator_id },
  });
};

export const PredictApp = async (id: string, inputs: Record<string, any>) => {
  return axiosInstance.post<import("./types").PredictionResult>(`/apps/${id}/predict`, { inputs });
};
