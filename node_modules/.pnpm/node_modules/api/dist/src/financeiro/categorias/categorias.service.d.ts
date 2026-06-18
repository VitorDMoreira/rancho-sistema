import { PrismaService } from '../../prisma/prisma.service';
export declare class CategoriasService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        observacoes: string | null;
    }[]>;
    criar(nome: string, observacoes?: string): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        observacoes: string | null;
    }>;
    atualizar(id: string, data: {
        nome?: string;
        observacoes?: string;
    }): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        observacoes: string | null;
    }>;
    remover(id: string): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        observacoes: string | null;
    }>;
}
