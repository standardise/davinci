export interface DataStat {
  mean?: number;
  median?: number;
  mode?: string;
  std_dev?: number;
  missing_count: number;
  unique_count: number;
}

export interface DatasetColumn {
  id: string;
  dataset_id: string;
  name: string;
  data_type: string;
  stats?: DataStat;
  created_at: string;
  updated_at: string;
}

export interface Dataset {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  row_count: number;
  file_size: number;
  metadata?: Record<string, any>;
  columns?: DatasetColumn[];
  created_at: string;
  updated_at: string;
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
