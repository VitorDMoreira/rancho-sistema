import { Controller, Get, Query } from '@nestjs/common';
import { MovimentosService } from './movimentos.service';

@Controller('movimentos')
export class MovimentosController {
  constructor(private readonly svc: MovimentosService) {}

  @Get()
  listar(
    @Query('contaBancariaId') contaBancariaId?: string,
    @Query('dataIni') dataIni?: string,
    @Query('dataFim') dataFim?: string,
    @Query('busca') busca?: string,
  ) {
    return this.svc.listar({ contaBancariaId, dataIni, dataFim, busca });
  }
}
