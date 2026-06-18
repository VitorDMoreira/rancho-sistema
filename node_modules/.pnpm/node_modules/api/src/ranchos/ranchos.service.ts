import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRanchoDto } from './dto/create-rancho.dto';

@Injectable()
export class RanchosService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.db.rancho.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    return this.prisma.db.rancho.findUniqueOrThrow({ where: { id } });
  }

  async criar(dto: CreateRanchoDto) {
    return this.prisma.db.rancho.create({
      data: {
        nome: dto.nome,
        codigoInterno: dto.codigoInterno,
        endereco: dto.endereco,
        cidade: dto.cidade,
        estado: dto.estado,
        observacoes: dto.observacoes,
        capacidadeMaxima: 0,
        valorDiaria: 0,
      },
    });
  }

  async atualizar(id: string, dto: Partial<CreateRanchoDto>) {
    return this.prisma.db.rancho.update({ where: { id }, data: dto });
  }

  async remover(id: string) {
    return this.prisma.db.rancho.delete({ where: { id } });
  }
}
