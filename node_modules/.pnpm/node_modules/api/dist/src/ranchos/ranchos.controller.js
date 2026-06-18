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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RanchosController = void 0;
const common_1 = require("@nestjs/common");
const ranchos_service_1 = require("./ranchos.service");
const create_rancho_dto_1 = require("./dto/create-rancho.dto");
let RanchosController = class RanchosController {
    ranchos;
    constructor(ranchos) {
        this.ranchos = ranchos;
    }
    listar() {
        return this.ranchos.listar();
    }
    buscar(id) {
        return this.ranchos.buscarPorId(id);
    }
    criar(dto) {
        return this.ranchos.criar(dto);
    }
    atualizar(id, dto) {
        return this.ranchos.atualizar(id, dto);
    }
    remover(id) {
        return this.ranchos.remover(id);
    }
};
exports.RanchosController = RanchosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RanchosController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RanchosController.prototype, "buscar", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rancho_dto_1.CreateRanchoDto]),
    __metadata("design:returntype", void 0)
], RanchosController.prototype, "criar", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RanchosController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RanchosController.prototype, "remover", null);
exports.RanchosController = RanchosController = __decorate([
    (0, common_1.Controller)('ranchos'),
    __metadata("design:paramtypes", [ranchos_service_1.RanchosService])
], RanchosController);
//# sourceMappingURL=ranchos.controller.js.map