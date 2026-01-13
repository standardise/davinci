export type PredictionStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED";

export interface PredictionLog {
  id: string;
  project_id: string;
  project_name: string;
  target: string;
  problem_type: string;
  model_version: string;
  input_url: string;
  output_url: string;
  output_format: string; // "PARQUET", "CSV", "JSON"
  status: PredictionStatus;
  error_msg?: string;
  row_count: number;
  metadata?: Record<string, any>;
  created_at: string;
  started_at?: string;
  finished_at?: string;
}

export type PredictionInput = Record<string, unknown>[];

export interface PredictionListResponse {
  data: PredictionLog[];
  total: number;
  page: number;
  limit: number;
}
