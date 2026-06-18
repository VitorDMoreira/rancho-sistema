import { BancosService } from './bancos.service';
export declare class BancosController {
    private readonly svc;
    constructor(svc: BancosService);
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
    criar(body: any): Promise<{
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
    atualizar(id: string, body: any): Promise<{
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
}
