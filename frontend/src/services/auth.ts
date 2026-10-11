import {
  AuthResponse,
  LoginCredentials,
  RegisterPeternakPayload,
  User,
} from "@/types/auth";

// Default Mock User sesuai data di wireframe (Prabowo Subianto)
export const MOCK_USER: User = {
  id: "usr-001-prabowo",
  full_name: "Prabowo Subianto",
  username: "prabowo",
  email: "prabowosubianto@gmail.com",
  phone: "081234567890",
  role: "peternak",
  farm_scale: "menengah",
  address: "Bojong Koneng, Babakan Madang, Bogor",
  nik: "3201012345670001",
};

// Mock User Administrator
export const MOCK_ADMIN_USER: User = {
  id: "usr-admin-001",
  full_name: "Administrator AniMedix",
  username: "admin",
  email: "admin@animedix.id",
  phone: "081199887766",
  role: "admin",
  address: "Kantor Operasional AniMedix, Jakarta",
};

/**
 * Auth Service Layer.
 * Saat backend temanmu sudah siap dengan endpoint Django,
 * kamu cukup mengganti isi fungsi di berkas ini dengan fetch/axios ke:
 * - POST /api/accounts/login/
 * - POST /api/accounts/register/
 */
export const authService = {
  /**
   * Login User
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulasi delay request jaringan (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Validasi input sederhana
    if (!credentials.emailOrUsername || !credentials.password) {
      throw new Error("Username/Email dan password wajib diisi.");
    }

    if (credentials.password.length < 4) {
      throw new Error("Password minimal 4 karakter.");
    }

    const input = credentials.emailOrUsername.toLowerCase().trim();
    const isAdmin =
      input === "admin" ||
      input === "admin@animedix.id" ||
      input.startsWith("admin");

    if (isAdmin) {
      return {
        user: MOCK_ADMIN_USER,
        token: "mock-jwt-token-animedix-admin-9999",
      };
    }

    // Return mock response berhasil untuk peternak
    const loggedUser: User = {
      ...MOCK_USER,
      email: credentials.emailOrUsername.includes("@")
        ? credentials.emailOrUsername
        : `${credentials.emailOrUsername}@gmail.com`,
      username: credentials.emailOrUsername.split("@")[0],
      role: "peternak",
    };

    return {
      user: loggedUser,
      token: "mock-jwt-token-animedix-12345",
    };
  },

  /**
   * Register Peternak (User Baru)
   */
  async registerPeternak(
    payload: RegisterPeternakPayload
  ): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!payload.full_name || !payload.email || !payload.password) {
      throw new Error("Data pendaftaran belum lengkap.");
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      full_name: payload.full_name,
      username: payload.username || payload.email.split("@")[0],
      email: payload.email,
      phone: payload.phone,
      nik: payload.nik,
      address: payload.address,
      role: "peternak",
      farm_scale: "kecil",
    };

    return {
      user: newUser,
      token: `mock-jwt-token-${Date.now()}`,
    };
  },

  /**
   * Logout User
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Nanti bisa hit POST /api/accounts/logout/ jika menggunakan session/token blacklist
  },
};
