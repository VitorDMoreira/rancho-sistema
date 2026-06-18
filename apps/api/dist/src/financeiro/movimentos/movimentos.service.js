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
exports.MovimentosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MovimentosService = class MovimentosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(filtros) {
        const dataIni = filtros.dataIni ? new Date(filtros.dataIni + 'T00:00:00') : undefined;
        const dataFim = filtros.dataFim ? new Date(filtros.dataFim + 'T23:59:59') : undefined;
        const busca = filtros.busca?.trim().toLowerCase();
        const [recebimentos, pagamentos, transferencias] = await Promise.all([
            this.prisma.db.contaReceber.findMany({
                where: {
                    status: 'RECEBIDO',
                    contaBancariaId: filtros.contaBancariaId || undefined,
                    dataPagamento: (dataIni || dataFim) ? { gte: dataIni, lte: dataFim } : undefined,
                },
                include: {
                    cliente: { select: { nomeCompleto: true } },
                    contaBancaria: { select: { id: true, nome: true } },
                },
            }),
            this.prisma.db.contaPagar.findMany({
                where: {
                    status: 'PAGO',
                    contaBancariaId: filtros.contaBancariaId || undefined,
                    dataPagamento: (dataIni || dataFim) ? { gte: dataIni, lte: dataFim } : undefined,
                },
                include: {
                    fornecedor: { select: { nome: true } },
                    categoria: { select: { nome: true } },
                    contaBancaria: { select: { id: true, nome: true } },
                },
            }),
            this.prisma.db.transferencia.findMany({
                where: {
                    data: (dataIni || dataFim) ? { gte: dataIni, lte: dataFim } : undefined,
                    OR: filtros.contaBancariaId
                        ? [{ contaOrigemId: filtros.contaBancariaId }, { contaDestinoId: filtros.contaBancariaId }]
                        : undefined,
                },
                include: {
                    contaOrigem: { select: { id: true, nome: true } },
                    contaDestino: { select: { id: true, nome: true } },
                },
            }),
        ]);
        let movimentos = [
            ...recebimentos.map(r => ({
                id: `receber-${r.id}`,
                data: r.dataPagamento,
                tipo: 'ENTRADA',
                descricao: r.descricao,
                contraparte: r.cliente?.nomeCompleto ?? '',
                planoConta: 'Receita',
                contaBancariaId: r.contaBancaria?.id ?? '',
                contaBancariaNome: r.contaBancaria?.nome ?? '',
                valor: Number(r.valor),
            })),
            ...pagamentos.map(p => ({
                id: `pagar-${p.id}`,
                data: p.dataPagamento,
                tipo: 'SAIDA',
                descricao: p.descricao,
                contraparte: p.fornecedor?.nome ?? '',
                planoConta: p.categoria?.nome ?? '',
                contaBancariaId: p.contaBancaria?.id ?? '',
                contaBancariaNome: p.contaBancaria?.nome ?? '',
                valor: Number(p.valor),
            })),
            ...transferencias.flatMap(t => {
                const linhas = [];
                if (!filtros.contaBancariaId || t.contaOrigemId === filtros.contaBancariaId) {
                    linhas.push({
                        id: `transf-saida-${t.id}`,
                        data: t.data,
                        tipo: 'SAIDA',
                        descricao: `Transferência para ${t.contaDestino.nome}`,
                        contraparte: t.contaDestino.nome,
                        planoConta: 'Transferência',
                        contaBancariaId: t.contaOrigem.id,
                        contaBancariaNome: t.contaOrigem.nome,
                        valor: Number(t.valor),
                    });
                }
                if (!filtros.contaBancariaId || t.contaDestinoId === filtros.contaBancariaId) {
                    linhas.push({
                        id: `transf-entrada-${t.id}`,
                        data: t.data,
                        tipo: 'ENTRADA',
                        descricao: `Transferência de ${t.contaOrigem.nome}`,
                        contraparte: t.contaOrigem.nome,
                        planoConta: 'Transferência',
                        contaBancariaId: t.contaDestino.id,
                        contaBancariaNome: t.contaDestino.nome,
                        valor: Number(t.valor),
                    });
                }
                return linhas;
            }),
        ];
        if (busca) {
            movimentos = movimentos.filter(m => m.descricao?.toLowerCase().includes(busca) ||
                m.contraparte?.toLowerCase().includes(busca) ||
                m.planoConta?.toLowerCase().includes(busca));
        }
        movimentos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        return movimentos;
    }
};
exports.MovimentosService = MovimentosService;
exports.MovimentosService = MovimentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MovimentosService);
//# sourceMappingURL=movimentos.service.js.map