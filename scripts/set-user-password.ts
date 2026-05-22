import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword, validatePasswordStrength } from "../lib/auth/password";

const prisma = new PrismaClient();

function getArg(name: string) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function questionHidden(prompt: string) {
  if (!input.isTTY || !input.setRawMode) {
    const rl = createInterface({ input, output });
    return rl.question(prompt).finally(() => rl.close());
  }

  return new Promise<string>((resolve, reject) => {
    let value = "";

    function cleanup() {
      input.setRawMode(false);
      input.off("data", onData);
      output.write("\n");
    }

    function onData(chunk: Buffer) {
      const char = chunk.toString("utf8");

      if (char === "\u0003") {
        cleanup();
        reject(new Error("Operação cancelada."));
        return;
      }

      if (char === "\r" || char === "\n") {
        cleanup();
        resolve(value);
        return;
      }

      if (char === "\u007f") {
        value = value.slice(0, -1);
        return;
      }

      value += char;
    }

    output.write(prompt);
    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
  });
}

async function main() {
  const rl = createInterface({ input, output });

  const email = (getArg("email") ?? (await rl.question("E-mail do usuário admin: "))).trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  const name = existingUser?.name ?? (getArg("name") ?? (await rl.question("Nome do usuário: "))).trim();

  rl.close();

  const password = await questionHidden("Nova senha (mínimo 12 caracteres): ");

  if (!email || !name) {
    throw new Error("E-mail e nome são obrigatórios.");
  }

  if (!validatePasswordStrength(password)) {
    throw new Error("A senha precisa ter pelo menos 12 caracteres.");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      active: true
    },
    create: {
      email,
      name,
      role: Role.ADMIN,
      passwordHash,
      active: true
    }
  });

  await prisma.crmSession.updateMany({
    where: {
      userId: user.id,
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  });

  console.log(`Senha atualizada para ${user.email}. Sessões anteriores revogadas.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
