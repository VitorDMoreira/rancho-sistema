import { ContasReceberService } from './contas-receber.service';
export declare class ContasReceberController {
    private readonly svc;
    constructor(svc: ContasReceberService);
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
    resumo(): Promise<{
        totalEmAberto: number;
        qtdEmAberto: number;
        totalRecebido: number;
        qtdRecebido: number;
    }>;
    criar(body: any): Promise<{
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
    marcarPago(id: string, body: any): Promise<{
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
}
