import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, LoginCredentials, RegisterPeternakPayload } from "@/types/auth";
import { authService, MOCK_USER } from "@/services/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (payload: RegisterPeternakPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login(credentials);
          set({
            user: res.user,
            token: res.token || null,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
          set({ error: message, isLoading: false });
          return false;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.registerPeternak(payload);
          set({
            user: res.user,
            token: res.token || null,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: unknown) {
          const message =
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat pendaftaran.";
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            token: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
          });
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user, isLoggedIn: true }),
    }),
    {
      name: "animedix_auth_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
