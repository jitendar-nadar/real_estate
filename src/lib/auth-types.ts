export type Role = "super_admin" | "admin" | "user";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
}

/** Roles that can access the admin panel */
export const ADMIN_ROLES: Role[] = ["super_admin", "admin"];

export function canAccessAdmin(role: Role): boolean {
  return ADMIN_ROLES.includes(role);
}
