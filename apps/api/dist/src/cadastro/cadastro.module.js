"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadastroModule = void 0;
const common_1 = require("@nestjs/common");
const bancos_controller_1 = require("./bancos/bancos.controller");
const bancos_service_1 = require("./bancos/bancos.service");
const fornecedores_controller_1 = require("./fornecedores/fornecedores.controller");
const fornecedores_service_1 = require("./fornecedores/fornecedores.service");
let CadastroModule = class CadastroModule {
};
exports.CadastroModule = CadastroModule;
exports.CadastroModule = CadastroModule = __decorate([
    (0, common_1.Module)({
        controllers: [bancos_controller_1.BancosController, fornecedores_controller_1.FornecedoresController],
        providers: [bancos_service_1.BancosService, fornecedores_service_1.FornecedoresService],
    })
], CadastroModule);
//# sourceMappingURL=cadastro.module.js.map