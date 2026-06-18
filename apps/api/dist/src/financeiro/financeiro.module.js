"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroModule = void 0;
const common_1 = require("@nestjs/common");
const contas_receber_controller_1 = require("./contas-receber/contas-receber.controller");
const contas_receber_service_1 = require("./contas-receber/contas-receber.service");
const contas_pagar_controller_1 = require("./contas-pagar/contas-pagar.controller");
const contas_pagar_service_1 = require("./contas-pagar/contas-pagar.service");
const categorias_controller_1 = require("./categorias/categorias.controller");
const categorias_service_1 = require("./categorias/categorias.service");
const movimentos_controller_1 = require("./movimentos/movimentos.controller");
const movimentos_service_1 = require("./movimentos/movimentos.service");
const transferencias_controller_1 = require("./transferencias/transferencias.controller");
const transferencias_service_1 = require("./transferencias/transferencias.service");
const relatorios_controller_1 = require("./relatorios/relatorios.controller");
const relatorios_service_1 = require("./relatorios/relatorios.service");
let FinanceiroModule = class FinanceiroModule {
};
exports.FinanceiroModule = FinanceiroModule;
exports.FinanceiroModule = FinanceiroModule = __decorate([
    (0, common_1.Module)({
        controllers: [contas_receber_controller_1.ContasReceberController, contas_pagar_controller_1.ContasPagarController, categorias_controller_1.CategoriasController, movimentos_controller_1.MovimentosController, transferencias_controller_1.TransferenciasController, relatorios_controller_1.RelatoriosController],
        providers: [contas_receber_service_1.ContasReceberService, contas_pagar_service_1.ContasPagarService, categorias_service_1.CategoriasService, movimentos_service_1.MovimentosService, transferencias_service_1.TransferenciasService, relatorios_service_1.RelatoriosService],
    })
], FinanceiroModule);
//# sourceMappingURL=financeiro.module.js.map