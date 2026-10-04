export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  user?: UserProfile | null;
  token?: string;
  error?: string;
  message?: string;
}
