import { PrismaService } from '../../prisma/prisma.service';
export declare class TransferenciasService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<({
        contaOrigem: {
            nome: string;
        };
        contaDestino: {
            nome: string;
        };
    } & {
        id: string;
        criadoEm: Date;
        observacoes: string | null;
        valor: Prisma.Decimal;
        contaOrigemId: string;
        contaDestinoId: string;
        data: Date;
    })[]>;
    criar(data: {
        contaOrigemId: string;
        contaDestinoId: string;
        valor: number;
        data: string;
        observacoes?: string;
    }): Promise<{
        id: string;
        criadoEm: Date;
        observacoes: string | null;
        valor: Prisma.Decimal;
        contaOrigemId: string;
        contaDestinoId: string;
        data: Date;
    }>;
    remover(id: string): Promise<{
        id: string;
        criadoEm: Date;
        observacoes: string | null;
        valor: Prisma.Decimal;
        contaOrigemId: string;
        contaDestinoId: string;
        data: Date;
    }>;
}
