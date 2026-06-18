# Rancho — Sistema de Locação

Sistema web para administrar locações de ranchos, pousadas e imóveis de temporada.
Funcionalidades: clientes, reservas, contratos, calendário e financeiro.

## Stack
- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS + TanStack Query + React Router
- **Backend**: NestJS + Prisma ORM (TypeScript)
- **Banco**: PostgreSQL 16
- **Infra**: Docker Compose + Caddy (HTTPS automático)

## Fases do projeto
| Fase | Foco |
|------|------|
| 0 — Setup | Monorepo, Docker, Postgres, Prisma, autenticação JWT, layout base |
| 1 — MVP | Clientes, Ranchos, Reservas, Calendário, Dashboard |
| 2 — Financeiro | Contas a receber/pagar, fluxo de caixa, relatórios |
| 3 — Contratos | Geração de PDF, histórico de contratos |
| 4 — Diferenciais | PIX, WhatsApp, assinatura eletrônica, checklists |
| 5 — Mobile | App React Native (Expo) sobre a mesma API |

## Estrutura de pastas (monorepo pnpm)
```
rancho-saas/
├── apps/
│   ├── api/        # Backend NestJS
│   └── web/        # Frontend React + Vite
├── packages/
│   └── shared/     # Tipos e enums compartilhados
├── docker-compose.yml
└── .env
```

## Regras para trabalhar neste projeto

### O usuário é INICIANTE — respeitar sempre:
1. **Antes de escrever qualquer código**, explique em português simples o que será feito e por quê.
2. **Perguntas sempre simples**, uma de cada vez, com opções quando possível. Nunca presumir conhecimento técnico.
3. **Passos bem pequenos**. Após cada passo, dizer em uma frase o que mudou e como ver o resultado.
4. **Sem jargão técnico** sem explicação. Se usar um termo técnico, explicar brevemente.
5. **Nunca avançar sem confirmação** do usuário quando houver decisão a tomar.

### Padrões de código
- Backend: cada módulo segue o padrão NestJS — `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`
- Frontend: cada feature fica em `src/features/<nome>/` com seu hook `use<Nome>.ts`
- Campos calculados (saldoRestante, qtdLocacoes, etc.) **nunca são armazenados** — sempre calculados na consulta
