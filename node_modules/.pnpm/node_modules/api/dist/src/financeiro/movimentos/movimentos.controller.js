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
exports.MovimentosController = void 0;
const common_1 = require("@nestjs/common");
const movimentos_service_1 = require("./movimentos.service");
let MovimentosController = class MovimentosController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    listar(contaBancariaId, dataIni, dataFim, busca) {
        return this.svc.listar({ contaBancariaId, dataIni, dataFim, busca });
    }
};
exports.MovimentosController = MovimentosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('contaBancariaId')),
    __param(1, (0, common_1.Query)('dataIni')),
    __param(2, (0, common_1.Query)('dataFim')),
    __param(3, (0, common_1.Query)('busca')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MovimentosController.prototype, "listar", null);
exports.MovimentosController = MovimentosController = __decorate([
    (0, common_1.Controller)('movimentos'),
    __metadata("design:paramtypes", [movimentos_service_1.MovimentosService])
], MovimentosController);
//# sourceMappingURL=movimentos.controller.js.map