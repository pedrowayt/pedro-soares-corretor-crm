import { Role } from "@prisma/client";
import { headers } from "next/headers";

export type AppSession = {
  userId: string;
  role: Role;
};

const ROLE_MAP: Record<string, Role> = {
  ADMIN: Role.ADMIN,
  CORRETOR: Role.CORRETOR,
  PARCEIRO: Role.PARCEIRO
};

export async function getSession(): Promise<AppSession | null> {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("x-user-id");
  const roleHeader = requestHeaders.get("x-user-role") ?? "CORRETOR";

  if (!userId && process.env.NODE_ENV !== "development") {
    return null;
  }

  return {
    userId: userId ?? "dev-user",
    role: ROLE_MAP[roleHeader] ?? Role.CORRETOR
  };
}

export function hasAnyRole(session: AppSession | null, roles: Role[]) {
  if (!session) return false;
  return roles.includes(session.role);
}
