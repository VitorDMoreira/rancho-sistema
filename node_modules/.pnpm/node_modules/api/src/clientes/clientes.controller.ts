import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientes: ClientesService) {}

  @Get()
  listar() {
    return this.clientes.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.clientes.buscarPorId(id);
  }

  @Post()
  criar(@Body() dto: CreateClienteDto) {
    return this.clientes.criar(dto);
  }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dto: Partial<CreateClienteDto>) {
    return this.clientes.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.clientes.remover(id);
  }
}
