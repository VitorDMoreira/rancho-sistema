import { ContasPagarService } from './contas-pagar.service';
export declare class ContasPagarController {
    private readonly svc;
    constructor(svc: ContasPagarService);
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
    resumo(): Promise<{
        totalEmAberto: number;
        qtdEmAberto: number;
        totalPago: number;
        qtdPago: number;
    }>;
    criar(body: any): Promise<{
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
    marcarPago(id: string, body: any): Promise<{
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
}
