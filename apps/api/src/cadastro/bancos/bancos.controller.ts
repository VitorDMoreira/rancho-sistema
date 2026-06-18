import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BancosService } from './bancos.service';

@Controller('bancos')
export class BancosController {
  constructor(private readonly svc: BancosService) {}

  @Get()
  listar() { return this.svc.listar(); }

  @Get('saldos')
  listarComSaldo() { return this.svc.listarComSaldo(); }

  @Post()
  criar(@Body() body: any) { return this.svc.criar(body); }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() body: any) { return this.svc.atualizar(id, body); }

  @Delete(':id')
  remover(@Param('id') id: string) { return this.svc.remover(id); }
}
