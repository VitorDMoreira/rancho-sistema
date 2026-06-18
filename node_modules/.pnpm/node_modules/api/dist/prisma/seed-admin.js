"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("../generated/prisma");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcryptjs"));
async function main() {
    const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new prisma_1.PrismaClient({ adapter });
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
//# sourceMappingURL=seed-admin.js.map