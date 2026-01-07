export type AppStatus =
  | "DRAFT"
  | "QUEUED"
  | "TRAINING"
  | "COMPLETED"
  | "FAILED";
export type ProblemType = "REGRESSION" | "CLASSIFICATION" | "TIME_SERIES";

export interface TimeSeriesConfig {
  time_column: string;
  group_column: string;
  frequency: string;
  forecast_horizon: number;
}

export interface CreateAppPayload {
  name: string;
  description: string;
  dataset_reference: string;
  target_column: string;
  id_column?: string;
  time_series_config?: TimeSeriesConfig;
}

export interface App {
  id: string;
  name: string;
  description: string;
  slug: string;
  is_public: boolean;
  owner_reference: string;
  dataset_reference: string;
  target_column: string;
  id_column: string;
  problem_type: ProblemType;
  status: AppStatus;
  time_series_config?: TimeSeriesConfig;

  metrics?: Record<string, number>;
  models?: Record<string, string>;

  error_message?: string;
  version: number;
  created_at: string;
  updated_at: string;
  start_build_at?: string;
  end_build_at?: string;
}

export interface AppListResponse {
  data: App[];
  total: number;
  page: number;
  limit: number;
}
