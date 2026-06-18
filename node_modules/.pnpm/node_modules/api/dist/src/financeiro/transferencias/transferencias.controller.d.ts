import { TransferenciasService } from './transferencias.service';
export declare class TransferenciasController {
    private readonly svc;
    constructor(svc: TransferenciasService);
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
    criar(body: any): Promise<{
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
