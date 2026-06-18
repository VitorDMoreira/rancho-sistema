import { PrismaService } from '../prisma/prisma.service';
export declare class CalendarioService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listarReservasDoMes(ano: number, mes: number, ranchoId?: string): Promise<({
        cliente: {
            nomeCompleto: string;
            telefone: string | null;
        };
        rancho: {
            nome: string;
            codigoInterno: string;
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
    })[]>;
}
