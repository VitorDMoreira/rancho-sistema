import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ContasPagarService } from './contas-pagar.service';

@Controller('contas-pagar')
export class ContasPagarController {
  constructor(private readonly svc: ContasPagarService) {}

  @Get()
  listar(@Query('status') status?: string) {
    return this.svc.listar(status);
  }

  @Get('resumo')
  resumo() {
    return this.svc.resumo();
  }

  @Post()
  criar(@Body() body: any) {
    return this.svc.criar(body);
  }

  @Put(':id/pagar')
  marcarPago(@Param('id') id: string, @Body() body: any) {
    return this.svc.marcarPago(id, body);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.svc.remover(id);
  }
}
