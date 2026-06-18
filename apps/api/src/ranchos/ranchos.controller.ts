import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RanchosService } from './ranchos.service';
import { CreateRanchoDto } from './dto/create-rancho.dto';

@Controller('ranchos')
export class RanchosController {
  constructor(private readonly ranchos: RanchosService) {}

  @Get()
  listar() {
    return this.ranchos.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.ranchos.buscarPorId(id);
  }

  @Post()
  criar(@Body() dto: CreateRanchoDto) {
    return this.ranchos.criar(dto);
  }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dto: Partial<CreateRanchoDto>) {
    return this.ranchos.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.ranchos.remover(id);
  }
}
