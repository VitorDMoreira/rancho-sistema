import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ContasReceberService } from './contas-receber.service';

@Controller('contas-receber')
export class ContasReceberController {
  constructor(private readonly svc: ContasReceberService) {}

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
