"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatoriosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
function parseData(d) {
    return d ? new Date(d + 'T12:00:00') : undefined;
}
let RelatoriosService = class RelatoriosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async contasPagar(f) {
        const where = {};
        if (f.ranchoId)
            where.ranchoId = f.ranchoId;
        if (f.categoriaId)
            where.categoriaId = f.categoriaId;
        if (f.fornecedorId)
            where.fornecedorId = f.fornecedorId;
        if (f.status)
            where.status = f.status;
        if (f.dataIni || f.dataFim) {
            where.vencimento = {};
            if (f.dataIni)
                where.vencimento.gte = parseData(f.dataIni);
            if (f.dataFim)
                where.vencimento.lte = parseData(f.dataFim);
        }
        const lista = await this.prisma.db.contaPagar.findMany({
            where,
            include: { categoria: { select: { nome: true } }, fornecedor: { select: { nome: true } }, rancho: { select: { nome: true } } },
            orderBy: { vencimento: 'asc' },
        });
        const total = lista.reduce((s, c) => s + Number(c.valor), 0);
        return { lista, total, qtd: lista.length };
    }
    async contasReceber(f) {
        const where = {};
        if (f.clienteId)
            where.clienteId = f.clienteId;
        if (f.status)
            where.status = f.status;
        if (f.dataIni || f.dataFim) {
            where.vencimento = {};
            if (f.dataIni)
                where.vencimento.gte = parseData(f.dataIni);
            if (f.dataFim)
                where.vencimento.lte = parseData(f.dataFim);
        }
        let lista = await this.prisma.db.contaReceber.findMany({
            where,
            include: { cliente: { select: { nomeCompleto: true } }, reserva: { select: { ranchoId: true, rancho: { select: { nome: true } } } } },
            orderBy: { vencimento: 'asc' },
        });
        if (f.ranchoId)
            lista = lista.filter((c) => c.reserva?.ranchoId === f.ranchoId);
        const total = lista.reduce((s, c) => s + Number(c.valor), 0);
        return { lista, total, qtd: lista.length };
    }
    async locacoes(f) {
        const where = {};
        if (f.ranchoId)
            where.ranchoId = f.ranchoId;
        if (f.clienteId)
            where.clienteId = f.clienteId;
        if (f.status)
            where.status = f.status;
        if (f.dataIni || f.dataFim) {
            where.dataEntrada = {};
            if (f.dataIni)
                where.dataEntrada.gte = parseData(f.dataIni);
            if (f.dataFim)
                where.dataEntrada.lte = parseData(f.dataFim);
        }
        const lista = await this.prisma.db.reserva.findMany({
            where,
            include: { cliente: { select: { nomeCompleto: true } }, rancho: { select: { nome: true } } },
            orderBy: { dataEntrada: 'asc' },
        });
        const totalValor = lista.reduce((s, r) => s + Number(r.valorTotal), 0);
        const totalDiarias = lista.reduce((s, r) => s + r.numDiarias, 0);
        return { lista, total: totalValor, qtd: lista.length, totalDiarias };
    }
    async fluxoCaixaPorCentroCusto(f) {
        const where = {};
        if (f.categoriaId)
            where.categoriaId = f.categoriaId;
        if (f.ranchoId)
            where.ranchoId = f.ranchoId;
        if (f.dataIni || f.dataFim) {
            where.vencimento = {};
            if (f.dataIni)
                where.vencimento.gte = parseData(f.dataIni);
            if (f.dataFim)
                where.vencimento.lte = parseData(f.dataFim);
        }
        const lista = await this.prisma.db.contaPagar.findMany({
            where,
            include: { categoria: { select: { nome: true } } },
        });
        const grupos = {};
        for (const c of lista) {
            const nome = c.categoria?.nome ?? 'Outros';
            if (!grupos[nome])
                grupos[nome] = { nome, total: 0, qtd: 0 };
            grupos[nome].total += Number(c.valor);
            grupos[nome].qtd += 1;
        }
        const grupo = Object.values(grupos).sort((a, b) => b.total - a.total);
        const total = grupo.reduce((s, g) => s + g.total, 0);
        return { grupo, total };
    }
};
exports.RelatoriosService = RelatoriosService;
exports.RelatoriosService = RelatoriosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelatoriosService);
//# sourceMappingURL=relatorios.service.js.map