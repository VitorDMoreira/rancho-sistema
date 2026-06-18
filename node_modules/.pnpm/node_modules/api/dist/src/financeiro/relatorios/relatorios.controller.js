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
exports.RelatoriosController = void 0;
const common_1 = require("@nestjs/common");
const relatorios_service_1 = require("./relatorios.service");
let RelatoriosController = class RelatoriosController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    contasPagar(q) {
        return this.svc.contasPagar(q);
    }
    contasReceber(q) {
        return this.svc.contasReceber(q);
    }
    locacoes(q) {
        return this.svc.locacoes(q);
    }
    centrosCusto(q) {
        return this.svc.fluxoCaixaPorCentroCusto(q);
    }
};
exports.RelatoriosController = RelatoriosController;
__decorate([
    (0, common_1.Get)('contas-pagar'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "contasPagar", null);
__decorate([
    (0, common_1.Get)('contas-receber'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "contasReceber", null);
__decorate([
    (0, common_1.Get)('locacoes'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "locacoes", null);
__decorate([
    (0, common_1.Get)('centros-custo'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "centrosCusto", null);
exports.RelatoriosController = RelatoriosController = __decorate([
    (0, common_1.Controller)('relatorios'),
    __metadata("design:paramtypes", [relatorios_service_1.RelatoriosService])
], RelatoriosController);
//# sourceMappingURL=relatorios.controller.js.map