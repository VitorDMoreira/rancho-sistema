import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.db.usuario.findMany({
      where: { ativo: true },
      select: { id: true, nome: true, email: true, perfil: true, ultimoAcesso: true, criadoEm: true },
      orderBy: { nome: 'asc' },
    });
  }

  async criar(data: { nome: string; email: string; senha: string; perfil: string }) {
    const existente = await this.prisma.db.usuario.findUnique({ where: { email: data.email.toLowerCase().trim() } });
    if (existente) throw new ConflictException('Já existe um usuário com este e-mail');

    const senhaHash = await bcrypt.hash(data.senha, 10);
    return this.prisma.db.usuario.create({
      data: {
        nome: data.nome,
        email: data.email.toLowerCase().trim(),
        senhaHash,
        perfil: data.perfil as any,
      },
      select: { id: true, nome: true, email: true, perfil: true },
    });
  }

  async atualizar(id: string, data: { nome?: string; email?: string; senha?: string; perfil?: string }) {
    const update: any = {};
    if (data.nome) update.nome = data.nome;
    if (data.email) update.email = data.email.toLowerCase().trim();
    if (data.perfil) update.perfil = data.perfil;
    if (data.senha) update.senhaHash = await bcrypt.hash(data.senha, 10);

    return this.prisma.db.usuario.update({
      where: { id },
      data: update,
      select: { id: true, nome: true, email: true, perfil: true },
    });
  }

  remover(id: string) {
    return this.prisma.db.usuario.update({ where: { id }, data: { ativo: false } });
  }
}
