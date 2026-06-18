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
exports.ReservasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReservasService = class ReservasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calcularDiarias(entrada, saida) {
        const ms = saida.getTime() - entrada.getTime();
        const dias = Math.ceil(ms / (1000 * 60 * 60 * 24));
        if (dias < 1)
            throw new common_1.BadRequestException('Data de saída deve ser após a entrada');
        return dias;
    }
    async verificarDisponibilidade(ranchoId, entrada, saida, ignorarId) {
        const conflito = await this.prisma.db.reserva.findFirst({
            where: {
                ranchoId,
                id: ignorarId ? { not: ignorarId } : undefined,
                status: { in: ['CONFIRMADA', 'EM_ANDAMENTO', 'AGUARDANDO_SINAL'] },
                dataEntrada: { lt: saida },
                dataSaida: { gt: entrada },
            },
        });
        if (conflito)
            throw new common_1.BadRequestException('Já existe reserva nesse período para este rancho');
    }
    async listar() {
        return this.prisma.db.reserva.findMany({
            include: {
                cliente: { select: { nomeCompleto: true } },
                rancho: { select: { nome: true, codigoInterno: true } },
            },
            orderBy: { dataEntrada: 'asc' },
        });
    }
    async buscarPorId(id) {
        return this.prisma.db.reserva.findUniqueOrThrow({
            where: { id },
            include: { cliente: true, rancho: true },
        });
    }
    async criar(dto) {
        const entrada = new Date(dto.dataEntrada);
        const saida = new Date(dto.dataSaida);
        const diarias = this.calcularDiarias(entrada, saida);
        await this.verificarDisponibilidade(dto.ranchoId, entrada, saida);
        const valorTotal = Number(dto.valorNegociado) * diarias;
        const sinal = Number(dto.sinalRecebido ?? 0);
        return this.prisma.db.reserva.create({
            data: {
                clienteId: dto.clienteId,
                ranchoId: dto.ranchoId,
                dataEntrada: entrada,
                dataSaida: saida,
                qtdHospedes: Number(dto.qtdHospedes),
                numDiarias: diarias,
                valorNegociado: dto.valorNegociado,
                valorTotal,
                sinalRecebido: sinal,
                formaPagamento: dto.formaPagamento,
                observacoes: dto.observacoes,
                status: sinal > 0 ? 'AGUARDANDO_SINAL' : 'ORCAMENTO',
            },
            include: {
                cliente: { select: { nomeCompleto: true } },
                rancho: { select: { nome: true } },
            },
        });
    }
    async atualizar(id, dto) {
        const entrada = new Date(dto.dataEntrada);
        const saida = new Date(dto.dataSaida);
        const diarias = this.calcularDiarias(entrada, saida);
        await this.verificarDisponibilidade(dto.ranchoId, entrada, saida, id);
        const valorTotal = Number(dto.valorNegociado) * diarias;
        const sinal = Number(dto.sinalRecebido ?? 0);
        return this.prisma.db.reserva.update({
            where: { id },
            data: {
                clienteId: dto.clienteId,
                ranchoId: dto.ranchoId,
                dataEntrada: entrada,
                dataSaida: saida,
                qtdHospedes: Number(dto.qtdHospedes),
                numDiarias: diarias,
                valorNegociado: dto.valorNegociado,
                valorTotal,
                sinalRecebido: sinal,
                formaPagamento: dto.formaPagamento,
                observacoes: dto.observacoes,
            },
            include: {
                cliente: { select: { nomeCompleto: true } },
                rancho: { select: { nome: true } },
            },
        });
    }
    async atualizarStatus(id, status) {
        return this.prisma.db.reserva.update({
            where: { id },
            data: { status: status },
        });
    }
    async confirmar(id, parcelas) {
        const reserva = await this.prisma.db.reserva.findUniqueOrThrow({
            where: { id },
            include: { rancho: { select: { nome: true } } },
        });
        await this.prisma.db.contaReceber.deleteMany({ where: { reservaId: id } });
        const total = parcelas.length;
        await this.prisma.db.contaReceber.createMany({
            data: parcelas.map((p, i) => {
                const numero = i + 1;
                const descricao = p.tipo === 'SINAL'
                    ? `Entrada (1/${total})`
                    : `Parcela ${numero}/${total}`;
                return {
                    reservaId: id,
                    clienteId: reserva.clienteId,
                    descricao,
                    tipo: p.tipo,
                    valor: p.valor,
                    vencimento: new Date(p.vencimento + 'T12:00:00'),
                    status: 'EM_ABERTO',
                };
            }),
        });
        return this.prisma.db.reserva.update({
            where: { id },
            data: { status: 'CONFIRMADA' },
            include: {
                cliente: { select: { nomeCompleto: true } },
                rancho: { select: { nome: true } },
            },
        });
    }
    async remover(id) {
        await this.prisma.db.contaReceber.deleteMany({ where: { reservaId: id } });
        return this.prisma.db.reserva.delete({ where: { id } });
    }
};
exports.ReservasService = ReservasService;
exports.ReservasService = ReservasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReservasService);
//# sourceMappingURL=reservas.service.js.map