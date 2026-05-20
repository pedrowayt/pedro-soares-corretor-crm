import { Role } from "@prisma/client";
import { getSession, hasAnyRole } from "@/lib/auth/session";
import { fail } from "@/lib/api/http";

export async function requireCrmWriteAccess() {
  const session = await getSession();

  if (!hasAnyRole(session, [Role.ADMIN, Role.CORRETOR])) {
    return {
      session,
      denied: fail("Sem permissão para ação no CRM.", 403)
    };
  }

  return {
    session,
    denied: null
  };
}
