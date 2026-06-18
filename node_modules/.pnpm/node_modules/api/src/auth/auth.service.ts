import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.prisma.db.usuario.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!usuario || !usuario.ativo) throw new UnauthorizedException('E-mail ou senha inválidos');

    const senhaOk = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaOk) throw new UnauthorizedException('E-mail ou senha inválidos');

    await this.prisma.db.usuario.update({ where: { id: usuario.id }, data: { ultimoAcesso: new Date() } });

    const token = this.jwt.sign({ sub: usuario.id, email: usuario.email, perfil: usuario.perfil });
    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    };
  }
}
