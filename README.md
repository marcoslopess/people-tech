# 🎯 People Tech – Teste Técnico Fullstack

Este projeto foi desenvolvido como parte do teste técnico da **People Tech**, com foco em construção de uma aplicação Fullstack para cadastro de usuários, com backend em NestJS e frontend em Next.js.

---

## ✨ Tecnologias Utilizadas

### Backend (NestJS + PostgreSQL + Redis + Winston)

- **NestJS** com estrutura modular e boas práticas (Service, DTO, etc.)
- **PostgreSQL** com ORM Prisma
- **Redis** para cache de listagem de usuários
- **Jest** para testes e2e
- **Swagger** para documentação (a ser implementada)
- **Winston** para **logs estruturados** com arquivos `logs/combined.log` e `logs/error.log`
- **Dotenv** para **configuração de variáveis de ambiente**

### Frontend (Next.js 15 + React 19 + MUI)

- **Next.js** com roteamento baseado em arquivos (`pages/`)
- **React 19** com estado assíncrono moderno
- **React Hook Form** para controle de formulários com validação
- **Material UI (MUI)** com suporte a temas claro/escuro
- **React Query** para controle de cache e requisições
- **Styled Components**

---

## ⚙️ Funcionalidades

- ✅ CRUD de usuários com integração total
- ✅ Validações com feedback visual
- ✅ Snackbar global para mensagens
- ✅ Tema claro/escuro com botão de troca
- ✅ Menu lateral fixo com navegação
- ✅ Modo responsivo
- ✅ Testes automatizados e2e
- ✅ Logs estruturados com Winston
- ✅ Uso de variáveis de ambiente com dotenv

---

## 🧪 Testes Implementados

### Backend

```bash
npm run test:e2e
```

- Criação de usuário com mock do Prisma
- Recuperação por ID
- Testes de cache com Redis
- Autenticação com JWT

---

## 💻 Como rodar o projeto

### ✅ Com Docker (recomendado)

Certifique-se de ter o Docker instalado e rodando. Depois:

```bash
docker-compose up --build
```

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

> Configure o `.env` com PostgreSQL e Redis:

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/peopletech"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET="sua_chave"
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📂 Estrutura de Pastas

```
backend/
├── logs/                   # Arquivos de log (Winston)
│   ├── combined.log
│   └── error.log
├── src/
│   ├── auth/
│   ├── users/
│   ├── prisma/
│   ├── redis/
│   └── logger/             # Configuração Winston
├── prisma/
│   ├── migrations/
│   └── schema.prisma

frontend/src/
├── components/
├── contexts/
├── hooks/
├── pages/
├── services/
├── types/
└── utils/
```

---

## 📌 Logs Estruturados

Todos os acessos às rotas são logados utilizando Winston:

- `logs/combined.log`: todas as requisições (info)
- `logs/error.log`: somente erros (status 4xx, 5xx)

---

## 👨‍💻 Autor

**Marcos Paulo Lopes da Costa**  
📧 [marcospaulolopesc@gmail.com](mailto:marcospaulolopesc@gmail.com)
