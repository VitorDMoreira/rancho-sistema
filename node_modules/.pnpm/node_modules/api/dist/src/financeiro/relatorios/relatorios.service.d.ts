import { PrismaService } from '../../prisma/prisma.service';
interface FiltroBase {
    dataIni?: string;
    dataFim?: string;
    ranchoId?: string;
    categoriaId?: string;
    fornecedorId?: string;
    clienteId?: string;
    status?: string;
}
export declare class RelatoriosService {
    private prisma;
    constructor(prisma: PrismaService);
    contasPagar(f: FiltroBase): Promise<{
        lista: ({
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
        })[];
        total: number;
        qtd: number;
    }>;
    contasReceber(f: FiltroBase): Promise<{
        lista: ({
            cliente: {
                nomeCompleto: string;
            };
            reserva: {
                rancho: {
                    nome: string;
                };
                ranchoId: string;
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
        })[];
        total: number;
        qtd: number;
    }>;
    locacoes(f: FiltroBase): Promise<{
        lista: ({
            cliente: {
                nomeCompleto: string;
            };
            rancho: {
                nome: string;
            };
        } & {
            id: string;
            criadoEm: Date;
            atualizadoEm: Date;
            observacoes: string | null;
            clienteId: string;
            ranchoId: string;
            dataEntrada: Date;
            dataSaida: Date;
            qtdHospedes: number;
            numDiarias: number;
            valorNegociado: Prisma.Decimal;
            valorTotal: Prisma.Decimal;
            sinalRecebido: Prisma.Decimal;
            caucaoValor: Prisma.Decimal | null;
            caucaoDevolvida: boolean;
            formaPagamento: import("generated/prisma").$Enums.FormaPagamento | null;
            status: import("generated/prisma").$Enums.StatusReserva;
        })[];
        total: number;
        qtd: number;
        totalDiarias: number;
    }>;
    fluxoCaixaPorCentroCusto(f: FiltroBase): Promise<{
        grupo: {
            nome: string;
            total: number;
            qtd: number;
        }[];
        total: number;
    }>;
}
export {};
