import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
export declare class ReservasService {
    private prisma;
    constructor(prisma: PrismaService);
    private calcularDiarias;
    private verificarDisponibilidade;
    listar(): Promise<({
        cliente: {
            nomeCompleto: string;
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
    buscarPorId(id: string): Promise<{
        cliente: {
            id: string;
            email: string | null;
            criadoEm: Date;
            atualizadoEm: Date;
            nomeCompleto: string;
            cpf: string;
            rg: string | null;
            dataNascimento: Date | null;
            estadoCivil: import("generated/prisma").$Enums.EstadoCivil | null;
            telefone: string | null;
            whatsapp: string | null;
            cep: string | null;
            rua: string | null;
            numero: string | null;
            bairro: string | null;
            cidade: string | null;
            estado: string | null;
            observacoes: string | null;
        };
        rancho: {
            id: string;
            nome: string;
            criadoEm: Date;
            atualizadoEm: Date;
            cidade: string | null;
            estado: string | null;
            observacoes: string | null;
            status: import("generated/prisma").$Enums.StatusRancho;
            codigoInterno: string;
            endereco: string | null;
            capacidadeMaxima: number;
            qtdQuartos: number;
            qtdBanheiros: number;
            valorDiaria: Prisma.Decimal;
            valorFimSemana: Prisma.Decimal | null;
            valorFeriado: Prisma.Decimal | null;
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
    }>;
    criar(dto: CreateReservaDto): Promise<{
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
    }>;
    atualizar(id: string, dto: Partial<CreateReservaDto>): Promise<{
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
    }>;
    atualizarStatus(id: string, status: string): Promise<{
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
    }>;
    confirmar(id: string, parcelas: {
        valor: number;
        vencimento: string;
        tipo: string;
    }[]): Promise<{
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
    }>;
    remover(id: string): Promise<{
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
    }>;
}
