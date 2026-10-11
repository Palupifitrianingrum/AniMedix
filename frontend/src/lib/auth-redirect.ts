import { User } from "@/types/auth";

/**
 * Menentukan rute dashboard tujuan berdasarkan role pengguna.
 */
export function getDashboardPathByRole(role?: User["role"] | string): string {
  switch (role) {
    case "peternak":
      return "/dashboard";
    case "dokter":
      return "/dashboard/dokter";
    case "admin":
      return "/admin";
    default:
      return "/dashboard";
  }
}
