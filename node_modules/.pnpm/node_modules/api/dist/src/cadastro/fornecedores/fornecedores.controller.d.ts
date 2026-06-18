import { FornecedoresService } from './fornecedores.service';
export declare class FornecedoresController {
    private readonly svc;
    constructor(svc: FornecedoresService);
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
    criar(body: any): Promise<{
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
    atualizar(id: string, body: any): Promise<{
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
