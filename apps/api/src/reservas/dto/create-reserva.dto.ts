export class CreateReservaDto {
  clienteId: string;
  ranchoId: string;
  dataEntrada: string;
  dataSaida: string;
  qtdHospedes: number;
  valorNegociado: number;
  sinalRecebido?: number;
  formaPagamento?: string;
  observacoes?: string;
}
