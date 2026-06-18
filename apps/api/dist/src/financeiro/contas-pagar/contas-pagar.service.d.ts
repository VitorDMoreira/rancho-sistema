import { PrismaService } from '../../prisma/prisma.service';
export declare class ContasPagarService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(status?: string): Promise<({
        rancho: {
            nome: string;
            codigoInterno: string;
        } | null;
        fornecedor: {
            nome: string;
        } | null;
        contaBancaria: {
            id: string;
            nome: string;
            banco: string;
        } | null;
        categoria: {
            nome: string;
        };
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        observacoes: string | null;
        ranchoId: string | null;
        formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
        status: import("generated/prisma").$Enums.StatusPagar;
        descricao: string;
        valor: Prisma.Decimal;
        vencimento: Date;
        dataPagamento: Date | null;
        contaBancariaId: string | null;
        desconto: Prisma.Decimal | null;
        multa: Prisma.Decimal | null;
        juros: Prisma.Decimal | null;
        nRecibo: string | null;
        observacoesPagamento: string | null;
        fornecedorId: string | null;
        categoriaId: string;
        numeroNota: string | null;
        dataEmissao: Date | null;
    })[]>;
    criar(data: {
        categoriaId: string;
        fornecedorId?: string;
        ranchoId?: string;
        descricao?: string;
        numeroNota?: string;
        dataEmissao?: string;
        valor: number;
        vencimento: string;
        observacoes?: string;
    }): Promise<{
        rancho: {
            nome: string;
        } | null;
        fornecedor: {
            nome: string;
        } | null;
        categoria: {
            nome: string;
        };
    } & {
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        observacoes: string | null;
        ranchoId: string | null;
        formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
        status: import("generated/prisma").$Enums.StatusPagar;
        descricao: string;
        valor: Prisma.Decimal;
        vencimento: Date;
        dataPagamento: Date | null;
        contaBancariaId: string | null;
        desconto: Prisma.Decimal | null;
        multa: Prisma.Decimal | null;
        juros: Prisma.Decimal | null;
        nRecibo: string | null;
        observacoesPagamento: string | null;
        fornecedorId: string | null;
        categoriaId: string;
        numeroNota: string | null;
        dataEmissao: Date | null;
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
        observacoes: string | null;
        ranchoId: string | null;
        formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
        status: import("generated/prisma").$Enums.StatusPagar;
        descricao: string;
        valor: Prisma.Decimal;
        vencimento: Date;
        dataPagamento: Date | null;
        contaBancariaId: string | null;
        desconto: Prisma.Decimal | null;
        multa: Prisma.Decimal | null;
        juros: Prisma.Decimal | null;
        nRecibo: string | null;
        observacoesPagamento: string | null;
        fornecedorId: string | null;
        categoriaId: string;
        numeroNota: string | null;
        dataEmissao: Date | null;
    }>;
    remover(id: string): Promise<{
        id: string;
        criadoEm: Date;
        atualizadoEm: Date;
        observacoes: string | null;
        ranchoId: string | null;
        formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
        status: import("generated/prisma").$Enums.StatusPagar;
        descricao: string;
        valor: Prisma.Decimal;
        vencimento: Date;
        dataPagamento: Date | null;
        contaBancariaId: string | null;
        desconto: Prisma.Decimal | null;
        multa: Prisma.Decimal | null;
        juros: Prisma.Decimal | null;
        nRecibo: string | null;
        observacoesPagamento: string | null;
        fornecedorId: string | null;
        categoriaId: string;
        numeroNota: string | null;
        dataEmissao: Date | null;
    }>;
    resumo(): Promise<{
        totalEmAberto: number;
        qtdEmAberto: number;
        totalPago: number;
        qtdPago: number;
    }>;
}
