import { Controller, Get, Query } from '@nestjs/common';
import { CalendarioService } from './calendario.service';

@Controller('calendario')
export class CalendarioController {
  constructor(private readonly svc: CalendarioService) {}

  @Get()
  listar(
    @Query('ano') ano: string,
    @Query('mes') mes: string,
    @Query('ranchoId') ranchoId?: string,
  ) {
    return this.svc.listarReservasDoMes(Number(ano), Number(mes), ranchoId);
  }
}
