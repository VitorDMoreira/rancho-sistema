import { PrismaService } from '../../prisma/prisma.service';
export declare class FornecedoresService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<{
        id: string;
        nome: string;
        cep: string | null;
        rua: string | null;
        numero: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        observacoes: string | null;
        documento: string | null;
        contato: string | null;
    }[]>;
    criar(data: {
        nome: string;
        documento?: string;
        contato?: string;
        observacoes?: string;
    }): Promise<{
        id: string;
        nome: string;
        cep: string | null;
        rua: string | null;
        numero: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        observacoes: string | null;
        documento: string | null;
        contato: string | null;
    }>;
    atualizar(id: string, data: {
        nome?: string;
        documento?: string;
        contato?: string;
        observacoes?: string;
    }): Promise<{
        id: string;
        nome: string;
        cep: string | null;
        rua: string | null;
        numero: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        observacoes: string | null;
        documento: string | null;
        contato: string | null;
    }>;
    remover(id: string): Promise<{
        id: string;
        nome: string;
        cep: string | null;
        rua: string | null;
        numero: string | null;
        bairro: string | null;
        cidade: string | null;
        estado: string | null;
        observacoes: string | null;
        documento: string | null;
        contato: string | null;
    }>;
}
