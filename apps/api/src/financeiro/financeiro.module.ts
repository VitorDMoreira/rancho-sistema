import { Module } from '@nestjs/common';
import { ContasReceberController } from './contas-receber/contas-receber.controller';
import { ContasReceberService } from './contas-receber/contas-receber.service';
import { ContasPagarController } from './contas-pagar/contas-pagar.controller';
import { ContasPagarService } from './contas-pagar/contas-pagar.service';
import { CategoriasController } from './categorias/categorias.controller';
import { CategoriasService } from './categorias/categorias.service';
import { MovimentosController } from './movimentos/movimentos.controller';
import { MovimentosService } from './movimentos/movimentos.service';
import { TransferenciasController } from './transferencias/transferencias.controller';
import { TransferenciasService } from './transferencias/transferencias.service';
import { RelatoriosController } from './relatorios/relatorios.controller';
import { RelatoriosService } from './relatorios/relatorios.service';

@Module({
  controllers: [ContasReceberController, ContasPagarController, CategoriasController, MovimentosController, TransferenciasController, RelatoriosController],
  providers: [ContasReceberService, ContasPagarService, CategoriasService, MovimentosService, TransferenciasService, RelatoriosService],
})
export class FinanceiroModule {}
