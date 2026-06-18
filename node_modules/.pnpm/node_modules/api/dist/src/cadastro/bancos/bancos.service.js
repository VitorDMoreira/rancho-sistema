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
exports.BancosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BancosService = class BancosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar() {
        return this.prisma.db.contaBancaria.findMany({
            where: { ativo: true },
            orderBy: { nome: 'asc' },
        });
    }
    async criar(data) {
        return this.prisma.db.contaBancaria.create({ data });
    }
    async atualizar(id, data) {
        return this.prisma.db.contaBancaria.update({ where: { id }, data });
    }
    async remover(id) {
        return this.prisma.db.contaBancaria.update({
            where: { id },
            data: { ativo: false },
        });
    }
    async listarComSaldo() {
        const contas = await this.prisma.db.contaBancaria.findMany({
            where: { ativo: true },
            orderBy: { nome: 'asc' },
        });
        const resultado = await Promise.all(contas.map(async (conta) => {
            const [recebido, pago, transfEntrada, transfSaida] = await Promise.all([
                this.prisma.db.contaReceber.aggregate({
                    where: { contaBancariaId: conta.id, status: 'RECEBIDO' },
                    _sum: { valor: true },
                }),
                this.prisma.db.contaPagar.aggregate({
                    where: { contaBancariaId: conta.id, status: 'PAGO' },
                    _sum: { valor: true },
                }),
                this.prisma.db.transferencia.aggregate({
                    where: { contaDestinoId: conta.id },
                    _sum: { valor: true },
                }),
                this.prisma.db.transferencia.aggregate({
                    where: { contaOrigemId: conta.id },
                    _sum: { valor: true },
                }),
            ]);
            const saldo = Number(conta.saldoInicial) +
                Number(recebido._sum.valor ?? 0) -
                Number(pago._sum.valor ?? 0) +
                Number(transfEntrada._sum.valor ?? 0) -
                Number(transfSaida._sum.valor ?? 0);
            return { ...conta, saldo };
        }));
        return resultado;
    }
};
exports.BancosService = BancosService;
exports.BancosService = BancosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BancosService);
//# sourceMappingURL=bancos.service.js.map