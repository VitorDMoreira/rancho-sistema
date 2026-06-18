import { CategoriasService } from './categorias.service';
export declare class CategoriasController {
    private readonly svc;
    constructor(svc: CategoriasService);
    listar(): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        observacoes: string | null;
    }[]>;
    criar(body: {
        nome: string;
        observacoes?: string;
    }): Promise<{
        id: string;
        nome: string;
        ativo: boolean;
        observacoes: string | null;
    }>;
    atualizar(id: string, body: {
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
