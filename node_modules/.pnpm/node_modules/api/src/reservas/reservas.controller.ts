import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservas: ReservasService) {}

  @Get()
  listar() {
    return this.reservas.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.reservas.buscarPorId(id);
  }

  @Post()
  criar(@Body() dto: CreateReservaDto) {
    return this.reservas.criar(dto);
  }

  @Put(':id')
  atualizar(@Param('id') id: string, @Body() dto: Partial<CreateReservaDto>) {
    return this.reservas.atualizar(id, dto);
  }

  @Put(':id/confirmar')
  confirmar(
    @Param('id') id: string,
    @Body() body: { parcelas: { valor: number; vencimento: string; tipo: string }[] },
  ) {
    return this.reservas.confirmar(id, body.parcelas);
  }

  @Put(':id/status')
  atualizarStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.reservas.atualizarStatus(id, body.status);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.reservas.remover(id);
  }
}
