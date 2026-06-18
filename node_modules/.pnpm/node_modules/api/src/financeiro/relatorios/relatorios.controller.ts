import { Controller, Get, Query } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly svc: RelatoriosService) {}

  @Get('contas-pagar')
  contasPagar(@Query() q: any) {
    return this.svc.contasPagar(q);
  }

  @Get('contas-receber')
  contasReceber(@Query() q: any) {
    return this.svc.contasReceber(q);
  }

  @Get('locacoes')
  locacoes(@Query() q: any) {
    return this.svc.locacoes(q);
  }

  @Get('centros-custo')
  centrosCusto(@Query() q: any) {
    return this.svc.fluxoCaixaPorCentroCusto(q);
  }
}
