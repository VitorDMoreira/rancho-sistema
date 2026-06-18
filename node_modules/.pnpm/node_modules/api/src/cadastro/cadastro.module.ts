import { Module } from '@nestjs/common';
import { BancosController } from './bancos/bancos.controller';
import { BancosService } from './bancos/bancos.service';
import { FornecedoresController } from './fornecedores/fornecedores.controller';
import { FornecedoresService } from './fornecedores/fornecedores.service';

@Module({
  controllers: [BancosController, FornecedoresController],
  providers: [BancosService, FornecedoresService],
})
export class CadastroModule {}
