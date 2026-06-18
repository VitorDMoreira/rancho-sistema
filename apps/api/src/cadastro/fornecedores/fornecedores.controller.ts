import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';

@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly svc: FornecedoresService) {}

  @Get()
  listar() { return this.svc.listar(); }

  @Post()
  criar(@Body() body: any) { return this.svc.criar(body); }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() body: any) { return this.svc.atualizar(id, body); }

  @Delete(':id')
  remover(@Param('id') id: string) { return this.svc.remover(id); }
}
