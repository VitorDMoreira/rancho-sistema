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
exports.ContasReceberService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ContasReceberService = class ContasReceberService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(status) {
        return this.prisma.db.contaReceber.findMany({
            where: status ? { status: status } : undefined,
            include: {
                cliente: { select: { nomeCompleto: true } },
                reserva: { select: { dataEntrada: true, dataSaida: true, rancho: { select: { nome: true } } } },
                contaBancaria: { select: { id: true, nome: true, banco: true } },
            },
            orderBy: { vencimento: 'asc' },
        });
    }
    async criar(data) {
        return this.prisma.db.contaReceber.create({
            data: {
                reservaId: data.reservaId || null,
                clienteId: data.clienteId,
                descricao: data.descricao,
                tipo: data.tipo,
                valor: data.valor,
                vencimento: new Date(data.vencimento + 'T12:00:00'),
                formaPagamento: data.formaPagamento || null,
                status: 'EM_ABERTO',
            },
        });
    }
    async marcarPago(id, body) {
        return this.prisma.db.contaReceber.update({
            where: { id },
            data: {
                status: 'RECEBIDO',
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
        return this.prisma.db.contaReceber.delete({ where: { id } });
    }
    async resumo() {
        const [emAberto, recebido] = await Promise.all([
            this.prisma.db.contaReceber.aggregate({
                where: { status: { in: ['EM_ABERTO', 'ATRASADO'] } },
                _sum: { valor: true },
                _count: true,
            }),
            this.prisma.db.contaReceber.aggregate({
                where: { status: 'RECEBIDO' },
                _sum: { valor: true },
                _count: true,
            }),
        ]);
        return {
            totalEmAberto: Number(emAberto._sum.valor ?? 0),
            qtdEmAberto: emAberto._count,
            totalRecebido: Number(recebido._sum.valor ?? 0),
            qtdRecebido: recebido._count,
        };
    }
};
exports.ContasReceberService = ContasReceberService;
exports.ContasReceberService = ContasReceberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContasReceberService);
//# sourceMappingURL=contas-receber.service.js.map