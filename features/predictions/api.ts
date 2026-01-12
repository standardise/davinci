import { axiosInstance } from "@/lib/api";
import {
  PredictionInput,
  PredictionListResponse,
  PredictionLog,
} from "./types";

export const ListPredictions = async (
  projectId: string,
  params?: { page?: number; limit?: number }
) => {
  return axiosInstance.get<PredictionListResponse>(
    `/projects/${projectId}/predictions`,
    { params }
  );
};

export const ListGlobalPredictions = async (
  params?: { page?: number; limit?: number }
) => {
  return axiosInstance.get<PredictionListResponse>(
    `/predictions`,
    { params }
  );
};

export const GetPrediction = async (projectId: string, predictionId: string) => {
  return axiosInstance.get<PredictionLog>(
    `/projects/${projectId}/predictions/${predictionId}`
  );
};

export const GetPredictionData = async (
  projectId: string,
  predictionId: string,
  params?: { page?: number; limit?: number }
) => {
  return axiosInstance.get<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }>(`/projects/${projectId}/predictions/${predictionId}/data`, { params });
};

export const DownloadPrediction = async (
  projectId: string,
  predictionId: string
) => {
  return axiosInstance.get(
    `/projects/${projectId}/predictions/${predictionId}/download`,
    { responseType: "blob" }
  );
};

export const CreatePrediction = async (
  projectId: string,
  data: File | PredictionInput
) => {
  if (data instanceof File) {
    const formData = new FormData();
    formData.append("file", data);
    return axiosInstance.post<PredictionLog>(
      `/projects/${projectId}/predictions`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  } else {
    return axiosInstance.post<PredictionLog>(
      `/projects/${projectId}/predictions`,
      data
    );
  }
};
