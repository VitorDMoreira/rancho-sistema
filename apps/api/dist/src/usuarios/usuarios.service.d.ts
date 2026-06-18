import { PrismaService } from '../prisma/prisma.service';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(): import("generated/prisma").Prisma.PrismaPromise<{
        id: string;
        email: string;
        nome: string;
        perfil: import("generated/prisma").$Enums.PerfilUsuario;
        ultimoAcesso: Date | null;
        criadoEm: Date;
    }[]>;
    criar(data: {
        nome: string;
        email: string;
        senha: string;
        perfil: string;
    }): Promise<{
        id: string;
        email: string;
        nome: string;
        perfil: import("generated/prisma").$Enums.PerfilUsuario;
    }>;
    atualizar(id: string, data: {
        nome?: string;
        email?: string;
        senha?: string;
        perfil?: string;
    }): Promise<{
        id: string;
        email: string;
        nome: string;
        perfil: import("generated/prisma").$Enums.PerfilUsuario;
    }>;
    remover(id: string): import("generated/prisma").Prisma.Prisma__UsuarioClient<{
        id: string;
        email: string;
        nome: string;
        senhaHash: string;
        perfil: import("generated/prisma").$Enums.PerfilUsuario;
        ativo: boolean;
        ultimoAcesso: Date | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }, never, import("generated/prisma/runtime/client").DefaultArgs, import("generated/prisma").Prisma.PrismaClientOptions>;
}
