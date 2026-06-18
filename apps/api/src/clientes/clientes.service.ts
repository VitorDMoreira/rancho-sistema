import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.db.cliente.findMany({
      orderBy: { nomeCompleto: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    return this.prisma.db.cliente.findUniqueOrThrow({ where: { id } });
  }

  async criar(dto: CreateClienteDto) {
    return this.prisma.db.cliente.create({ data: dto });
  }

  async atualizar(id: string, dto: Partial<CreateClienteDto>) {
    return this.prisma.db.cliente.update({ where: { id }, data: dto });
  }

  async remover(id: string) {
    return this.prisma.db.cliente.delete({ where: { id } });
  }
}
