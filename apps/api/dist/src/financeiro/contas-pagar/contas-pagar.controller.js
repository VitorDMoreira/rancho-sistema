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
exports.ContasPagarController = void 0;
const common_1 = require("@nestjs/common");
const contas_pagar_service_1 = require("./contas-pagar.service");
let ContasPagarController = class ContasPagarController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    listar(status) {
        return this.svc.listar(status);
    }
    resumo() {
        return this.svc.resumo();
    }
    criar(body) {
        return this.svc.criar(body);
    }
    marcarPago(id, body) {
        return this.svc.marcarPago(id, body);
    }
    remover(id) {
        return this.svc.remover(id);
    }
};
exports.ContasPagarController = ContasPagarController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContasPagarController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('resumo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContasPagarController.prototype, "resumo", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContasPagarController.prototype, "criar", null);
__decorate([
    (0, common_1.Put)(':id/pagar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContasPagarController.prototype, "marcarPago", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContasPagarController.prototype, "remover", null);
exports.ContasPagarController = ContasPagarController = __decorate([
    (0, common_1.Controller)('contas-pagar'),
    __metadata("design:paramtypes", [contas_pagar_service_1.ContasPagarService])
], ContasPagarController);
//# sourceMappingURL=contas-pagar.controller.js.map