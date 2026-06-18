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
exports.CalendarioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CalendarioService = class CalendarioService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listarReservasDoMes(ano, mes, ranchoId) {
        const inicio = new Date(ano, mes - 1, 1);
        const fim = new Date(ano, mes, 0, 23, 59, 59);
        const reservas = await this.prisma.db.reserva.findMany({
            where: {
                status: { not: 'CANCELADA' },
                ...(ranchoId ? { ranchoId } : {}),
                AND: [
                    { dataEntrada: { lte: fim } },
                    { dataSaida: { gte: inicio } },
                ],
            },
            include: {
                cliente: { select: { nomeCompleto: true, telefone: true } },
                rancho: { select: { nome: true, codigoInterno: true } },
            },
            orderBy: { dataEntrada: 'asc' },
        });
        return reservas;
    }
};
exports.CalendarioService = CalendarioService;
exports.CalendarioService = CalendarioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarioService);
//# sourceMappingURL=calendario.service.js.map