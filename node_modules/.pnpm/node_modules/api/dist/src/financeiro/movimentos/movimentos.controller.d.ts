import { MovimentosService } from './movimentos.service';
export declare class MovimentosController {
    private readonly svc;
    constructor(svc: MovimentosService);
    listar(contaBancariaId?: string, dataIni?: string, dataFim?: string, busca?: string): Promise<any[]>;
}
