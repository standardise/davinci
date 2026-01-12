export type AppStatus =
  | "WAITING"
  | "PROCESSING"
  | "ACTIVE"
  | "FAILED";
export type AppVisibility = "PRIVATE" | "PUBLIC";

export interface App {
  id: string;
  owner_id: string;
  dataset_id: string;
  name: string;
  description: string;
  target: string;
  colour: string;
  icon: string;
  status: AppStatus;
  visibility: AppVisibility;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateAppPayload {
  name: string;
  description: string;
  dataset_id: string;
  target: string;
  colour: string;
  icon: string;
  visibility: AppVisibility;
}

export interface UpdateAppPayload {
  name?: string;
  description?: string;
  target?: string;
  colour?: string;
  icon?: string;
  visibility?: AppVisibility;
}

export interface AppListResponse {
  data: App[];
  total: number;
  page: number;
  limit: number;
}
