export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "peternak" | "dokter" | "admin";
  farm_scale?: "kecil" | "menengah" | "besar";
  address?: string;
  nik?: string;
  username?: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterPeternakPayload {
  // Step 1: Data Personal
  full_name: string;
  nik: string;
  address: string;
  phone: string;

  // Step 2: Data Akun
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
