import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly svc: UsuariosService) {}

  @Get()
  listar() {
    return this.svc.listar();
  }

  @Post()
  criar(@Body() dto: { nome: string; email: string; senha: string; perfil: string }) {
    return this.svc.criar(dto);
  }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dto: { nome?: string; email?: string; senha?: string; perfil?: string }) {
    return this.svc.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.svc.remover(id);
  }
}
