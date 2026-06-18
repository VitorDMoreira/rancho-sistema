import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    login(email: string, senha: string): Promise<{
        token: string;
        usuario: {
            id: string;
            nome: string;
            email: string;
            perfil: import("generated/prisma").$Enums.PerfilUsuario;
        };
    }>;
}
