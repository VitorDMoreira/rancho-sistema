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
exports.RanchosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RanchosService = class RanchosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar() {
        return this.prisma.db.rancho.findMany({
            orderBy: { nome: 'asc' },
        });
    }
    async buscarPorId(id) {
        return this.prisma.db.rancho.findUniqueOrThrow({ where: { id } });
    }
    async criar(dto) {
        return this.prisma.db.rancho.create({
            data: {
                nome: dto.nome,
                codigoInterno: dto.codigoInterno,
                endereco: dto.endereco,
                cidade: dto.cidade,
                estado: dto.estado,
                observacoes: dto.observacoes,
                capacidadeMaxima: 0,
                valorDiaria: 0,
            },
        });
    }
    async atualizar(id, dto) {
        return this.prisma.db.rancho.update({ where: { id }, data: dto });
    }
    async remover(id) {
        return this.prisma.db.rancho.delete({ where: { id } });
    }
};
exports.RanchosService = RanchosService;
exports.RanchosService = RanchosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RanchosService);
//# sourceMappingURL=ranchos.service.js.map