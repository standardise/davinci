import { axiosInstance } from "@/lib/api";
import { Dataset, DatasetListResponse, DatasetQuery } from "./types";

const buildQuery = (params: DatasetQuery) => {
  const q = new URLSearchParams();
  if (params.page) q.append("page", params.page.toString());
  if (params.limit) q.append("limit", params.limit.toString());
  if (params.search) q.append("search", params.search);
  return q.toString();
};

export const ListDatasets = async (query: DatasetQuery = {}) => {
  return axiosInstance.get<DatasetListResponse>(
    `/datasets?${buildQuery(query)}`
  );
};

export const GetDataset = async (id: string) => {
  return axiosInstance.get<Dataset>(`/datasets/${id}`);
};

export const DeleteDataset = async (id: string) => {
  return axiosInstance.delete(`/datasets/${id}`);
};

export interface UploadDatasetParams {
  name: string;
  description: string;
  file: File;
}

export const UploadDataset = async ({
  name,
  description,
  file,
}: UploadDatasetParams) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("file", file);

  return axiosInstance.post<Dataset>("/datasets/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
