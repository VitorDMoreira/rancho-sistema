import { PrismaService } from '../../prisma/prisma.service';
export declare class BancosService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        criadoEm: Date;
        tipo: string;
        banco: string;
        agencia: string | null;
        conta: string | null;
        saldoInicial: Prisma.Decimal;
    }[]>;
    criar(data: {
        nome: string;
        banco: string;
        agencia?: string;
        conta?: string;
        tipo: string;
    }): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        criadoEm: Date;
        tipo: string;
        banco: string;
        agencia: string | null;
        conta: string | null;
        saldoInicial: Prisma.Decimal;
    }>;
    atualizar(id: string, data: {
        nome?: string;
        banco?: string;
        agencia?: string;
        conta?: string;
        tipo?: string;
    }): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        criadoEm: Date;
        tipo: string;
        banco: string;
        agencia: string | null;
        conta: string | null;
        saldoInicial: Prisma.Decimal;
    }>;
    remover(id: string): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        criadoEm: Date;
        tipo: string;
        banco: string;
        agencia: string | null;
        conta: string | null;
        saldoInicial: Prisma.Decimal;
    }>;
    listarComSaldo(): Promise<{
        saldo: number;
        id: string;
        nome: string;
        ativo: boolean;
        criadoEm: Date;
        tipo: string;
        banco: string;
        agencia: string | null;
        conta: string | null;
        saldoInicial: Prisma.Decimal;
    }[]>;
}
