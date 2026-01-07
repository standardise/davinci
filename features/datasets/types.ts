export type DataType = "object" | "int64" | "float64" | "bool" | "datetime64";

export interface DatasetColumn {
  name: string;
  type: DataType;
}

export type DatasetPreview = Record<string, unknown>[];

export interface Dataset {
  id: string;
  name: string;
  description: string;
  url: string;
  owner_ref: string;
  schema: DatasetColumn[];
  preview: DatasetPreview;
  row_count: number;
  file_size: number;
  created_at: string;
}

export interface DatasetQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DatasetListResponse {
  data: Dataset[];
  total: number;
  page: number;
  limit: number;
}
