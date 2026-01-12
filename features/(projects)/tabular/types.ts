export type ProblemType = "classification" | "regression";
export type AppStatus =
  | "idle"
  | "draft"
  | "queueing"
  | "training"
  | "ready"
  | "error";

export interface FeatureSchema {
  name: string;
  type: "numeric" | "categorical" | "datetime" | "boolean";
  description?: string;
  is_nullable: boolean;
}

export interface TabularProject {
  // --- Metadata & Identity ---
  id: string;
  name: string;
  description: string;
  slug: string;
  is_public: boolean;
  owner_reference: string;
  version: number;

  // --- Resource Linking (Pooling) ---
  dataset_reference: string; // ID ของ Dataset จาก Data Lab
  service_type: string;

  // --- Training Configuration ---
  target_column: string; // คอลัมน์เป้าหมาย
  id_column: string; // คอลัมน์ที่ใช้ระบุตัวตน (ไม่ใช้เทรน)
  problem_type: ProblemType;
  white_lists?: string[]; // รายชื่อ Features ที่อนุญาตให้ใช้เทรน

  // --- Data Governance (Strict Type Safety) ---
  input_schema?: FeatureSchema[]; // ระบุว่า Input หน้าตาเป็นอย่างไร
  feature_importance?: Record<string, number>; // e.g., { "age": 0.45, "income": 0.32 }

  // --- Artifacts & Results ---
  model_path?: string; // ตำแหน่งไฟล์โมเดลใน Storage
  metrics?: Record<string, number>; // เช่น { "accuracy": 0.95, "f1_score": 0.94 }
  models?: Record<string, string>; // รายชื่อ Algorithm ที่ใช้ (e.g., {"LGBM": "v1"})

  // Appearance Customization
  theme_color?: string; // เก็บเป็น Tailwind color class เช่น "rose", "blue", "emerald"
  icon_id?: string; // ID ของ icon เพื่อใช้แมปกับ Lucide icons

  status: AppStatus;
  error_message?: string;
  created_at: string;
  updated_at: string;
  start_build_at?: string;
  end_build_at?: string;
}
