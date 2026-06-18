import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias-despesa')
export class CategoriasController {
  constructor(private readonly svc: CategoriasService) {}

  @Get()
  listar() {
    return this.svc.listar();
  }

  @Post()
  criar(@Body() body: { nome: string; observacoes?: string }) {
    return this.svc.criar(body.nome, body.observacoes);
  }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() body: { nome?: string; observacoes?: string }) {
    return this.svc.atualizar(id, body);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.svc.remover(id);
  }
}
