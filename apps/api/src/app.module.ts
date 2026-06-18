import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { RanchosModule } from './ranchos/ranchos.module';
import { ReservasModule } from './reservas/reservas.module';
import { CalendarioModule } from './calendario/calendario.module';
import { FinanceiroModule } from './financeiro/financeiro.module';
import { CadastroModule } from './cadastro/cadastro.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [PrismaModule, AuthModule, UsuariosModule, ClientesModule, RanchosModule, ReservasModule, CalendarioModule, FinanceiroModule, CadastroModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
