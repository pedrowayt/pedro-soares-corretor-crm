import { Role } from "@prisma/client";
import { getSession, hasAnyRole } from "@/lib/auth/session";
import { fail } from "@/lib/api/http";

export async function requireCrmWriteAccess() {
  const session = await getSession();

  if (!session) {
    return {
      session,
      denied: fail("Sessão expirada. Faça login novamente.", 401)
    };
  }

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

export async function requireCrmAdminAccess() {
  const session = await getSession();

  if (!session) {
    return {
      session,
      denied: fail("Sessão expirada. Faça login novamente.", 401)
    };
  }

  if (!hasAnyRole(session, [Role.ADMIN])) {
    return {
      session,
      denied: fail("Apenas administradores podem configurar integrações.", 403)
    };
  }

  return {
    session,
    denied: null
  };
}
