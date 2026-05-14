# Task Manager — API de Produtividade

Uma API REST simples para gerenciar tarefas (tasks) com autenticação via JWT, escrita em TypeScript usando NestJS e Prisma (Postgres).

## Visão geral

Este projeto implementa um backend para criar/atualizar/remover tarefas associadas a usuários. Foi construído como um projeto de portfólio para demonstrar competências em:

- Autenticação e autorização (JWT)
- Modelagem e acesso a banco de dados com Prisma
- Documentação da API com Swagger
- Containerização com Docker / Docker Compose

## Principais funcionalidades

- CRUD de tarefas (Task) com relacionamento a `User`.
- Registro e login de usuários com senha protegida por `bcrypt`.
- Validações de entrada com DTOs e `class-validator`.
- Documentação interativa em `/api` (Swagger).

## Tech stack

- Framework: NestJS
- Linguagem: TypeScript
- Banco de dados: PostgreSQL (Prisma ORM)
- Autenticação: JWT (Passport)
- Container: Docker / Docker Compose

## Arquitetura e schema do banco

O schema Prisma principal está em [prisma/schema.prisma](prisma/schema.prisma). As entidades centrais são `User` e `Task`, onde cada Task pertence a um User.

## Como executar localmente

Pré-requisitos:

- `node` (v18+ recomendado)
- `npm`
- `docker` e `docker-compose` (opcional, para rodar em containers)

Passos rápidos:

1. Instale dependências:

```
npm install
```

2. Configure variáveis de ambiente (exemplo em `.env`):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
```

3. Gere o cliente Prisma e rode migrations (se necessário):

```
npx prisma generate
# npx prisma migrate dev --name init    # se quiser usar migrations locais
```

4. Inicie em modo desenvolvimento:

```
npm run start:dev
```

5. Acesse a documentação Swagger em `http://localhost:3000/api`.

## Rodando com Docker

Este repositório inclui `Dockerfile` e `docker-compose.yml` para subir a API e o Postgres:

```
docker compose up --build
```

O serviço do Postgres expõe a porta `5432` e a API `3000` conforme configurado em [docker-compose.yml](docker-compose.yml).

## Testes

Executar testes unitários e e2e:

```
npm run test
npm run test:e2e
```

## Observações técnicas importantes

- Validações globais são aplicadas em [src/main.ts](src/main.ts) com `ValidationPipe`.
- A documentação OpenAPI é montada via `SwaggerModule` em `src/main.ts` e exposta em `/api`.
- Exemplo de variáveis sensíveis e padrão está em `.env`.

## Organização do repositório

- [src/](src/) — código-fonte NestJS (módulos: `auth`, `tasks`, `users`, `prisma`)
- [prisma/schema.prisma](prisma/schema.prisma) — modelos de dados
- [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml) — configuração de container
- [package.json](package.json) — scripts e dependências

## CI/CD & Deploy

Este repositório já inclui um workflow de CI/CD baseado em GitHub Actions em `.github/workflows/deploy.yml` que pode ser usado como exemplo de pipeline simples: ele executa testes e, em caso de sucesso, faz deploy para um servidor remoto na AWS via SCP/SSH e executa `docker-compose up -d --build` no destino.

Pontos importantes sobre o workflow atual:

- Arquivo do workflow: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- A ação pressupõe acesso SSH ao servidor de destino e que o servidor tenha Docker e Docker Compose instalados.
- Segredos necessários (adicionar em GitHub > Settings > Secrets):
	- `EC2_HOST` — host ou IP do servidor de destino
	- `EC2_USER` — usuário SSH (ex.: `ubuntu`)
	- `EC2_SSH_KEY` — chave privada SSH (PEM) do usuário
	- `EC2_SSH_PORT` — porta SSH (opcional, padrão `22`)