import { PrismaService } from '../../prisma/prisma.service';
export declare class MovimentosService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(filtros: {
        contaBancariaId?: string;
        dataIni?: string;
        dataFim?: string;
        busca?: string;
    }): Promise<any[]>;
}
