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
exports.BancosController = void 0;
const common_1 = require("@nestjs/common");
const bancos_service_1 = require("./bancos.service");
let BancosController = class BancosController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    listar() { return this.svc.listar(); }
    listarComSaldo() { return this.svc.listarComSaldo(); }
    criar(body) { return this.svc.criar(body); }
    atualizar(id, body) { return this.svc.atualizar(id, body); }
    remover(id) { return this.svc.remover(id); }
};
exports.BancosController = BancosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('saldos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "listarComSaldo", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "criar", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "remover", null);
exports.BancosController = BancosController = __decorate([
    (0, common_1.Controller)('bancos'),
    __metadata("design:paramtypes", [bancos_service_1.BancosService])
], BancosController);
//# sourceMappingURL=bancos.controller.js.map