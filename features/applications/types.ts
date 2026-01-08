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

export interface FeatureSchema {
  name: string;
  data_type: "FLOAT" | "INT" | "CATEGORY" | "TEXT" | "DATE";
  description?: string;
  example?: any;
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
  
  input_schema?: FeatureSchema[];
  white_lists?: string[];
  model_path?: string;

  metrics?: Record<string, number>;
  models?: Record<string, string>;

  error_message?: string;
  version: number;
  created_at: string;
  updated_at: string;
  start_build_at?: string;
  end_build_at?: string;
}

export interface PredictPayload {
  inputs: Record<string, any>;
}

export interface PredictionResult {
  prediction: any;
  probability?: Record<string, number>;
  explanation?: string; // For "Prediction as a Document" concept
  features_used: Record<string, any>;
  timestamp: string;
}

export interface AppListResponse {
  data: App[];
  total: number;
  page: number;
  limit: number;
}
