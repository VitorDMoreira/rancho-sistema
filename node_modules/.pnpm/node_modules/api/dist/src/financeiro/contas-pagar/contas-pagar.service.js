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
exports.ContasPagarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ContasPagarService = class ContasPagarService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(status) {
        return this.prisma.db.contaPagar.findMany({
            where: status ? { status: status } : undefined,
            include: {
                categoria: { select: { nome: true } },
                rancho: { select: { nome: true, codigoInterno: true } },
                fornecedor: { select: { nome: true } },
                contaBancaria: { select: { id: true, nome: true, banco: true } },
            },
            orderBy: { vencimento: 'asc' },
        });
    }
    async criar(data) {
        let descricao = data.descricao?.trim();
        if (!descricao) {
            const categoria = await this.prisma.db.categoriaDespesa.findUnique({ where: { id: data.categoriaId } });
            descricao = categoria?.nome ?? 'Despesa';
        }
        return this.prisma.db.contaPagar.create({
            data: {
                categoriaId: data.categoriaId,
                fornecedorId: data.fornecedorId || null,
                ranchoId: data.ranchoId || null,
                descricao,
                numeroNota: data.numeroNota || null,
                dataEmissao: data.dataEmissao ? new Date(data.dataEmissao + 'T12:00:00') : null,
                valor: data.valor,
                vencimento: new Date(data.vencimento + 'T12:00:00'),
                observacoes: data.observacoes || null,
                status: 'EM_ABERTO',
            },
            include: {
                categoria: { select: { nome: true } },
                rancho: { select: { nome: true } },
                fornecedor: { select: { nome: true } },
            },
        });
    }
    async marcarPago(id, body) {
        return this.prisma.db.contaPagar.update({
            where: { id },
            data: {
                status: 'PAGO',
                dataPagamento: new Date(body.dataPagamento + 'T12:00:00'),
                formaPagamento: body.formaPagamento || undefined,
                contaBancariaId: body.contaBancariaId || null,
                desconto: body.desconto ?? 0,
                multa: body.multa ?? 0,
                juros: body.juros ?? 0,
                nRecibo: body.nRecibo || null,
                observacoesPagamento: body.observacoesPagamento || null,
            },
        });
    }
    async remover(id) {
        return this.prisma.db.contaPagar.delete({ where: { id } });
    }
    async resumo() {
        const [emAberto, pago] = await Promise.all([
            this.prisma.db.contaPagar.aggregate({
                where: { status: { in: ['EM_ABERTO', 'ATRASADO'] } },
                _sum: { valor: true },
                _count: true,
            }),
            this.prisma.db.contaPagar.aggregate({
                where: { status: 'PAGO' },
                _sum: { valor: true },
                _count: true,
            }),
        ]);
        return {
            totalEmAberto: Number(emAberto._sum.valor ?? 0),
            qtdEmAberto: emAberto._count,
            totalPago: Number(pago._sum.valor ?? 0),
            qtdPago: pago._count,
        };
    }
};
exports.ContasPagarService = ContasPagarService;
exports.ContasPagarService = ContasPagarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContasPagarService);
//# sourceMappingURL=contas-pagar.service.js.map