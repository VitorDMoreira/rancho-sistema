# Sistema de Locação de Ranchos, Pousadas e Imóveis de Temporada
### Especificação técnica e plano de desenvolvimento

---

## 1. Visão geral

Sistema web responsivo para pequenas empresas e administradores de imóveis de temporada centralizarem clientes, reservas, contratos, calendário e todo o financeiro (contas a pagar, contas a receber, fluxo de caixa e relatórios) em um único lugar, com caminho claro para um aplicativo mobile no futuro.

O princípio que guia todas as decisões abaixo é **simples e barato de manter**: uma única linguagem de ponta a ponta, um monolito bem organizado e hospedagem em uma única VPS.

---

## 2. Arquitetura

### 2.1 Stack recomendada

| Camada | Tecnologia | Por quê |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript, TailwindCSS, TanStack Query, React Router | Rápido, responsivo, ecossistema enorme; reaproveita conhecimento no mobile |
| Calendário | FullCalendar | Visões dia/semana/mês prontas, estilo Airbnb |
| Backend | NestJS (Node + TypeScript) + Prisma ORM | Estrutura modular clara, ótimo para CRUD de negócio, mesma linguagem do front |
| Banco | PostgreSQL 16 | Robusto, gratuito, transacional, ótimo com Prisma |
| Autenticação | JWT + RBAC (3 perfis) | Simples e suficiente para o porte |
| Geração de PDF | Puppeteer ou pdfmake | Contrato gerado a partir de template HTML |
| Storage de fotos | Volume na VPS (início) → Cloudflare R2 / Backblaze B2 (escala) | Custo quase zero no começo |
| Proxy / HTTPS | Caddy | HTTPS automático (Let's Encrypt) sem configuração |
| Empacotamento | Docker + Docker Compose | Sobe tudo com um comando, idêntico em dev e produção |

### 2.2 Por que essa escolha

- **Uma só linguagem (TypeScript)** no front, back e no futuro app mobile. Uma pessoa só consegue manter o sistema inteiro.
- **Monolito** (uma API, um banco): menos partes móveis, mais barato. Microserviços seriam complexidade desnecessária nesse porte.
- **Docker Compose em uma VPS** (Hostinger, Contabo, DigitalOcean ou Hetzner) custa de R$ 30 a R$ 60 por mês e dá controle total. Sobe `Caddy + API + PostgreSQL` em um comando.
- **Mobile depois** é só um app React Native (Expo) consumindo a mesma API REST. Os tipos TypeScript são compartilhados via um pacote `shared`, evitando retrabalho.

### 2.3 Alternativa de menor esforço operacional

Se você não quiser administrar servidor, troque o trio Postgres + autenticação + storage por **Supabase** (Postgres gerenciado + Auth + Storage prontos) e hospede o frontend na **Vercel**. Fica um pouco menos barato conforme cresce, mas você não cuida de servidor, backup nem certificado. É uma troca legítima de "custo de infra" por "custo de tempo". A recomendação principal (VPS + Docker) é a mais barata em dinheiro; o Supabase é a mais barata em tempo.

### 2.4 Integrações externas (todas via webhook, adicionadas por fase)

- **PIX**: Asaas, Mercado Pago ou Efí — geração de cobrança e baixa automática ao receber.
- **WhatsApp**: WhatsApp Cloud API (oficial) ou Evolution API / Z-API (mais barato) — envio de contrato e cobrança.
- **Assinatura eletrônica**: Autentique, Clicksign ou D4Sign — assinatura do contrato com validade jurídica.

---

## 3. Modelagem do banco de dados

O schema completo (todos os campos, tipos e enums) está no arquivo `schema.prisma`. As entidades:

| Entidade | Papel |
|---|---|
| `usuarios` | Operadores do sistema, com perfil (ADMIN / FINANCEIRO / ATENDENTE) |
| `audit_logs` | Log de alterações (quem fez o quê e quando) |
| `clientes` | Cadastro de locatários |
| `ranchos` | Imóveis, com valores por tipo de dia e status de disponibilidade |
| `rancho_fotos` | Galeria de fotos por imóvel |
| `bloqueios` | Períodos de manutenção/bloqueio do proprietário (não são reservas) |
| `reservas` | Locações, com cálculos de diárias, total e saldo |
| `contratos` | Contrato gerado a partir da reserva (PDF + assinatura) |
| `contas_receber` | Sinais, parcelas, pagamento final, caução |
| `categorias_despesa` | Energia, Água, Funcionários, Manutenção etc. |
| `fornecedores` | Quem emite as despesas |
| `contas_pagar` | Despesas, com rateio opcional por imóvel |
| `checklists` | Checklist de entrada e saída por reserva |

### 3.1 Campos calculados (não armazenados)

Para nunca haver inconsistência, estes valores são **derivados em tempo de consulta**, não salvos em coluna:

- **Reserva**: `numDiarias` (diferença entre datas), `valorTotal` e `saldoRestante` (`valorTotal − sinalRecebido`).
- **Cliente**: quantidade de locações, valor total gasto e última hospedagem (agregação sobre `reservas`).
- **Fluxo de caixa**: combinação de `contas_receber` recebidas (entradas) e `contas_pagar` pagas (saídas). Recomendo materializar como uma **view SQL** (`vw_fluxo_caixa`) para os relatórios.

> Observação: na reserva, `numDiarias` e `valorTotal` são gravados como "foto" do momento da negociação (porque o valor pode ser negociado), mas o `saldoRestante` e os indicadores de cliente/caixa são sempre recalculados.

---

## 4. Fluxos dos usuários

### 4.1 Fluxo principal — ciclo de uma reserva

```
Orçamento → Aguardando sinal → Confirmada → Em andamento → Finalizada
                                      ↘ Cancelada (a qualquer momento)
```

1. **Atendente** cria a reserva como `ORCAMENTO` (cliente + rancho + datas + nº hóspedes). O sistema calcula diárias e total automaticamente.
2. Ao acertar, vira `AGUARDANDO_SINAL` e o sistema gera automaticamente uma conta a receber do tipo `SINAL`.
3. Sinal recebido → `CONFIRMADA`. O calendário pinta as datas de vermelho e o saldo restante vira uma conta a receber `PAGAMENTO_FINAL`.
4. Na data de entrada → `EM_ANDAMENTO` (checklist de entrada).
5. Na saída → checklist de saída, devolução de caução, `FINALIZADA`.

### 4.2 Fluxo financeiro

Cada reserva alimenta o **Contas a Receber**. Cada despesa cai no **Contas a Pagar**. O **Fluxo de Caixa** e o **Dashboard** apenas leem e somam esses dois — não duplicam dado.

### 4.3 Perfis e o que cada um vê

| Tela | ADMIN | FINANCEIRO | ATENDENTE |
|---|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | parcial |
| Clientes | ✅ | leitura | ✅ |
| Ranchos | ✅ | leitura | leitura |
| Reservas / Calendário | ✅ | leitura | ✅ |
| Contratos | ✅ | ✅ | gerar |
| Contas a receber/pagar | ✅ | ✅ | ❌ |
| Fluxo de caixa / Relatórios | ✅ | ✅ | ❌ |
| Usuários e permissões | ✅ | ❌ | ❌ |

---

## 5. Estrutura de pastas do projeto

Monorepo com `pnpm workspaces` — frontend, backend e tipos compartilhados no mesmo repositório.

```
rancho-saas/
├── apps/
│   ├── api/                      # Backend NestJS
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts           # dados iniciais (admin, categorias)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── prisma/           # PrismaService
│   │   │   ├── common/           # guards (JWT, roles), filters, decorators
│   │   │   ├── auth/             # login, JWT, RBAC
│   │   │   ├── usuarios/
│   │   │   ├── clientes/
│   │   │   ├── ranchos/
│   │   │   ├── reservas/
│   │   │   ├── calendario/
│   │   │   ├── contratos/
│   │   │   ├── contas-receber/
│   │   │   ├── contas-pagar/
│   │   │   ├── fluxo-caixa/
│   │   │   └── dashboard/
│   │   └── test/
│   └── web/                      # Frontend React + Vite
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           ├── lib/              # api client (axios), queryClient
│           ├── components/       # ui/, layout/ (sidebar, header)
│           ├── features/         # clientes/, reservas/, calendario/, financeiro/...
│           ├── pages/
│           ├── hooks/
│           └── routes/
├── packages/
│   └── shared/                   # tipos, enums e schemas Zod compartilhados
├── docker-compose.yml
├── Caddyfile
├── .env.example
├── pnpm-workspace.yaml
└── README.md
```

Cada módulo do backend segue sempre o mesmo padrão NestJS: `*.module.ts`, `*.controller.ts`, `*.service.ts` e `dto/`. Isso torna o código previsível: quem aprende um módulo, entende todos.

---

## 6. Plano de desenvolvimento por etapas

| Fase | Foco | Entregas | Estimativa |
|---|---|---|---|
| **0 — Setup** | Fundação | Monorepo, Docker, Postgres, Prisma, autenticação JWT + perfis, layout base | ~1 semana |
| **1 — MVP** | Operação | Clientes, Ranchos, Reservas (com cálculos), Calendário, Dashboard básico, Usuários | 3–4 semanas |
| **2 — Financeiro** | Dinheiro | Contas a receber, Contas a pagar, Fluxo de caixa, Relatórios e gráficos | 2–3 semanas |
| **3 — Contratos** | Documentos | Geração de PDF, histórico de contratos | ~2 semanas |
| **4 — Diferenciais** | Crescimento | PIX, WhatsApp, assinatura eletrônica, caução, checklists, limpeza/manutenção, relatórios de ocupação | iterativo |
| **5 — Mobile** | Alcance | App React Native (Expo) sobre a mesma API | futuro |

A ordem é proposital: primeiro o que faz a empresa **operar** (Fase 1), depois o que faz **controlar dinheiro** (Fase 2). Contratos e diferenciais vêm quando o uso diário já estiver estável.

---

## 7. MVP inicial

O MVP é o conjunto mínimo que já permite tocar o dia a dia:

- **Autenticação** e os 3 perfis de acesso.
- **Clientes**: CRUD completo + histórico calculado.
- **Ranchos**: CRUD + fotos + status de disponibilidade.
- **Reservas**: criação com cálculo automático de diárias, total e saldo; mudança de status.
- **Calendário**: visão mensal com as 4 cores; clique abre a reserva.
- **Dashboard**: cards de reservas do mês, faturamento, ocupação e saldo.

Com isso a empresa já substitui a planilha. Financeiro detalhado e contratos entram logo em seguida.

---

## 8. Funcionalidades futuras (diferenciais)

Os itens que viram diferencial nos primeiros meses, em ordem sugerida de implementação:

1. **Integração PIX** (Asaas/Mercado Pago/Efí) — cobrança gerada e baixada sozinha.
2. **WhatsApp** — envio automático de contrato e lembrete de cobrança.
3. **Assinatura eletrônica** do contrato (Autentique/Clicksign).
4. **Caução / depósito de garantia** com controle de devolução (já previsto no schema).
5. **Checklist de entrada e saída** do rancho (já previsto no schema).
6. **Controle de limpeza e manutenção** com agenda própria.
7. **Relatórios avançados** de ocupação por rancho e por período.

---

## 9. Código inicial

### 9.1 `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: rancho
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: rancho
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: ./apps/api
    restart: always
    depends_on: [db]
    environment:
      DATABASE_URL: postgresql://rancho:${DB_PASSWORD}@db:5432/rancho
      JWT_SECRET: ${JWT_SECRET}
    expose:
      - "3000"

  caddy:
    image: caddy:2-alpine
    restart: always
    depends_on: [api]
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./apps/web/dist:/srv
      - caddy_data:/data

volumes:
  pgdata:
  caddy_data:
```

### 9.2 `Caddyfile`

```
seudominio.com.br {
    encode gzip
    handle /api/* {
        reverse_proxy api:3000
    }
    handle {
        root * /srv
        try_files {path} /index.html
        file_server
    }
}
```

### 9.3 `.env.example`

```
DB_PASSWORD=troque-esta-senha
JWT_SECRET=uma-string-longa-e-aleatoria
DATABASE_URL=postgresql://rancho:troque-esta-senha@localhost:5432/rancho
```

### 9.4 Backend — service de Reservas (o coração dos cálculos)

```typescript
// apps/api/src/reservas/reservas.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, StatusReserva, TipoReceber } from '@prisma/client';

@Injectable()
export class ReservasService {
  constructor(private prisma: PrismaService) {}

  /** Calcula nº de diárias entre entrada e saída (mínimo 1). */
  private calcularDiarias(entrada: Date, saida: Date): number {
    const ms = saida.getTime() - entrada.getTime();
    const dias = Math.ceil(ms / (1000 * 60 * 60 * 24));
    if (dias < 1) throw new BadRequestException('Data de saída deve ser após a entrada');
    return dias;
  }

  /** Verifica se o rancho está livre no período (sem reserva ativa nem bloqueio). */
  private async verificarDisponibilidade(ranchoId: string, entrada: Date, saida: Date, ignorarReservaId?: string) {
    const conflito = await this.prisma.reserva.findFirst({
      where: {
        ranchoId,
        id: ignorarReservaId ? { not: ignorarReservaId } : undefined,
        status: { in: [StatusReserva.CONFIRMADA, StatusReserva.EM_ANDAMENTO, StatusReserva.AGUARDANDO_SINAL] },
        dataEntrada: { lt: saida },
        dataSaida: { gt: entrada },
      },
    });
    if (conflito) throw new BadRequestException('Já existe reserva nesse período para este rancho');
  }

  async criar(dto: {
    clienteId: string; ranchoId: string;
    dataEntrada: Date; dataSaida: Date;
    qtdHospedes: number; valorNegociado: number; sinalRecebido?: number;
  }) {
    const diarias = this.calcularDiarias(dto.dataEntrada, dto.dataSaida);
    await this.verificarDisponibilidade(dto.ranchoId, dto.dataEntrada, dto.dataSaida);

    const valorTotal = new Prisma.Decimal(dto.valorNegociado).mul(diarias);
    const sinal = new Prisma.Decimal(dto.sinalRecebido ?? 0);

    return this.prisma.reserva.create({
      data: {
        clienteId: dto.clienteId,
        ranchoId: dto.ranchoId,
        dataEntrada: dto.dataEntrada,
        dataSaida: dto.dataSaida,
        qtdHospedes: dto.qtdHospedes,
        numDiarias: diarias,
        valorNegociado: dto.valorNegociado,
        valorTotal,
        sinalRecebido: sinal,
        status: sinal.gt(0) ? StatusReserva.AGUARDANDO_SINAL : StatusReserva.ORCAMENTO,
      },
    });
  }

  /** Saldo restante é sempre calculado, nunca armazenado. */
  saldoRestante(valorTotal: Prisma.Decimal, sinalRecebido: Prisma.Decimal) {
    return valorTotal.sub(sinalRecebido);
  }

  /** Ao confirmar, gera automaticamente a conta a receber do saldo final. */
  async confirmar(reservaId: string) {
    const r = await this.prisma.reserva.findUniqueOrThrow({ where: { id: reservaId } });
    const saldo = this.saldoRestante(r.valorTotal, r.sinalRecebido);

    await this.prisma.$transaction([
      this.prisma.reserva.update({ where: { id: reservaId }, data: { status: StatusReserva.CONFIRMADA } }),
      this.prisma.contaReceber.create({
        data: {
          reservaId, clienteId: r.clienteId,
          descricao: 'Pagamento final da reserva',
          tipo: TipoReceber.PAGAMENTO_FINAL,
          valor: saldo, vencimento: r.dataEntrada,
        },
      }),
    ]);
  }
}
```

### 9.5 Backend — controller com proteção por perfil

```typescript
// apps/api/src/clientes/clientes.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientesController {
  constructor(private readonly clientes: ClientesService) {}

  @Get()
  @Roles('ADMIN', 'ATENDENTE', 'FINANCEIRO')
  listar() {
    return this.clientes.listarComHistorico();
  }

  @Post()
  @Roles('ADMIN', 'ATENDENTE')
  criar(@Body() dto: CreateClienteDto) {
    return this.clientes.criar(dto);
  }
}
```

### 9.6 Backend — histórico do cliente calculado

```typescript
// apps/api/src/clientes/clientes.service.ts  (trecho)
async listarComHistorico() {
  const clientes = await this.prisma.cliente.findMany({
    include: {
      reservas: {
        where: { status: { in: ['FINALIZADA', 'EM_ANDAMENTO', 'CONFIRMADA'] } },
        select: { valorTotal: true, dataSaida: true },
      },
    },
  });

  return clientes.map((c) => ({
    ...c,
    reservas: undefined,
    qtdLocacoes: c.reservas.length,
    valorTotalGasto: c.reservas.reduce((s, r) => s.add(r.valorTotal), new Prisma.Decimal(0)),
    ultimaHospedagem: c.reservas.map((r) => r.dataSaida).sort().at(-1) ?? null,
  }));
}
```

### 9.7 Frontend — client da API e hook de dados

```typescript
// apps/web/src/lib/api.ts
import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

```typescript
// apps/web/src/features/clientes/useClientes.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export interface Cliente {
  id: string; nomeCompleto: string; cpf: string; whatsapp?: string;
  qtdLocacoes: number; valorTotalGasto: string; ultimaHospedagem?: string;
}

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => (await api.get<Cliente[]>('/clientes')).data,
  });
}
```

```tsx
// apps/web/src/pages/ClientesPage.tsx
import { useClientes } from '../features/clientes/useClientes';

export function ClientesPage() {
  const { data: clientes, isLoading } = useClientes();
  if (isLoading) return <p>Carregando…</p>;

  return (
    <div>
      <h1 className="text-xl font-medium mb-4">Clientes</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">Nome</th><th>WhatsApp</th><th>Locações</th><th>Total gasto</th>
          </tr>
        </thead>
        <tbody>
          {clientes?.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="py-2">{c.nomeCompleto}</td>
              <td>{c.whatsapp ?? '—'}</td>
              <td>{c.qtdLocacoes}</td>
              <td>R$ {Number(c.valorTotalGasto).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 10. Próximos passos sugeridos

1. Criar o monorepo e subir a Fase 0 (`docker compose up` com Postgres + Prisma migrado + login funcionando).
2. Implementar Clientes e Ranchos (CRUDs simples para validar o padrão).
3. Implementar Reservas reaproveitando o `ReservasService` acima.
4. Plugar o FullCalendar lendo as reservas e bloqueios.
5. Só então avançar para o financeiro.

Manter sempre o mesmo padrão de módulo no backend e de `feature/` no frontend é o que mantém o projeto barato de evoluir: cada novo recurso é uma cópia da estrutura que já existe.
