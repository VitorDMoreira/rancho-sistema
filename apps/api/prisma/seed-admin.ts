import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const nome = process.argv[2];
  const email = process.argv[3];
  const senha = process.argv[4];

  if (!nome || !email || !senha) {
    console.error('Uso: npx ts-node prisma/seed-admin.ts "Nome Completo" email@exemplo.com senha123');
    process.exit(1);
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.upsert({
    where: { email: email.toLowerCase().trim() },
    update: { senhaHash, perfil: 'ADMIN', ativo: true },
    create: { nome, email: email.toLowerCase().trim(), senhaHash, perfil: 'ADMIN' },
  });

  console.log('Usuário administrador criado/atualizado:', usuario.email);
  await prisma.$disconnect();
}

main();
