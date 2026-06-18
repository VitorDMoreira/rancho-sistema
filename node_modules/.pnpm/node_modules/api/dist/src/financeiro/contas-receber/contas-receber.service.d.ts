import { PrismaService } from '../../prisma/prisma.service';
export declare class ContasReceberService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(status?: string): Promise<({
        cliente: {
            nomeCompleto: string;
        };
        reserva: {
            rancho: {
                nome: string;
            };
            dataEntrada: Date;
            dataSaida: Date;
        } | null;
        contaBancaria: {
            id: string;
            nome: string;
            banco: string;
        } | null;
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
        status: import("generated/prisma").$Enums.StatusReceber;
        reservaId: string | null;
        descricao: string;
        tipo: import("generated/prisma").$Enums.TipoReceber;
        valor: Prisma.Decimal;
        vencimento: Date;
        dataPagamento: Date | null;
        contaBancariaId: string | null;
        desconto: Prisma.Decimal | null;
        multa: Prisma.Decimal | null;
        juros: Prisma.Decimal | null;
        nRecibo: string | null;
        observacoesPagamento: string | null;
    })[]>;
    criar(data: {
        reservaId?: string;
        clienteId: string;
        descricao: string;
        tipo: string;
        valor: number;
        vencimento: string;
        formaPagamento?: string;
    }): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
        status: import("generated/prisma").$Enums.StatusReceber;
        reservaId: string | null;
        descricao: string;
        tipo: import("generated/prisma").$Enums.TipoReceber;
        valor: Prisma.Decimal;
        vencimento: Date;
        dataPagamento: Date | null;
        contaBancariaId: string | null;
        desconto: Prisma.Decimal | null;
        multa: Prisma.Decimal | null;
        juros: Prisma.Decimal | null;
        nRecibo: string | null;
        observacoesPagamento: string | null;
    }>;
    marcarPago(id: string, body: {
        dataPagamento: string;
        formaPagamento?: string;
        contaBancariaId?: string;
        desconto?: number;
        multa?: number;
        juros?: number;
        nRecibo?: string;
        observacoesPagamento?: string;
    }): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
        status: import("generated/prisma").$Enums.StatusReceber;
        reservaId: string | null;
        descricao: string;
        tipo: import("generated/prisma").$Enums.TipoReceber;
        valor: Prisma.Decimal;
        vencimento: Date;
        dataPagamento: Date | null;
        contaBancariaId: string | null;
        desconto: Prisma.Decimal | null;
        multa: Prisma.Decimal | null;
        juros: Prisma.Decimal | null;
        nRecibo: string | null;
        observacoesPagamento: string | null;
    }>;
    remover(id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        clienteId: string;
        formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
        status: import("generated/prisma").$Enums.StatusReceber;
        reservaId: string | null;
        descricao: string;
        tipo: import("generated/prisma").$Enums.TipoReceber;
        valor: Prisma.Decimal;
        vencimento: Date;
        dataPagamento: Date | null;
        contaBancariaId: string | null;
        desconto: Prisma.Decimal | null;
        multa: Prisma.Decimal | null;
        juros: Prisma.Decimal | null;
        nRecibo: string | null;
        observacoesPagamento: string | null;
    }>;
    resumo(): Promise<{
        totalEmAberto: number;
        qtdEmAberto: number;
        totalRecebido: number;
        qtdRecebido: number;
    }>;
}
