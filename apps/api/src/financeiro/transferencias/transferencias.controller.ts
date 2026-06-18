import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { TransferenciasService } from './transferencias.service';

@Controller('transferencias')
export class TransferenciasController {
  constructor(private readonly svc: TransferenciasService) {}

  @Get()
  listar() { return this.svc.listar(); }

  @Post()
  criar(@Body() body: any) { return this.svc.criar(body); }

  @Delete(':id')
  remover(@Param('id') id: string) { return this.svc.remover(id); }
}
