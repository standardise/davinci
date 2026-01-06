export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthResponseError {
  error: string;
}
