import { CalendarioService } from './calendario.service';
export declare class CalendarioController {
    private readonly svc;
    constructor(svc: CalendarioService);
    listar(ano: string, mes: string, ranchoId?: string): Promise<({
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
