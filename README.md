# 🎯 People Tech – Teste Técnico Fullstack

Este projeto foi desenvolvido como parte do teste técnico da **People Tech**, com foco em construção de uma aplicação Fullstack para cadastro de usuários, com backend em NestJS e frontend em Next.js.

---

## ✨ Tecnologias Utilizadas

### Backend (NestJS + PostgreSQL + Redis)

- **NestJS** com estrutura modular e boas práticas (Service, DTO, etc.)
- **PostgreSQL** com ORM Prisma
- **Redis** para cache de listagem de usuários
- **Jest** para testes unitários
- **Swagger**

### Frontend (Next.js 15 + React 19 + MUI)

- **Next.js** com roteamento baseado em arquivos (`pages/`)
- **React 19** com estado assíncrono moderno
- **React Hook Form** para controle de formulários
- **Material UI (MUI)** com suporte a temas claro/escuro
- **React Query** para controle de cache e requisições
- **Jest + Testing Library** para testes de componentes
- **Styled Components**

---

## ⚙️ Funcionalidades

- ✅ CRUD de usuários com integração total
- ✅ Validações com feedback visual
- ✅ Snackbar global para mensagens
- ✅ Tema claro/escuro com botão de troca
- ✅ Menu lateral fixo com navegação
- ✅ Modo responsivo
- ✅ Testes automatizados
- ✅ Documentação Swagger a ser implementada

---

## 🧪 Testes Implementados

### Backend

```bash
npm run test
```

- Criação de usuário com mock do Prisma
- Recuperação por ID
- Testes de cache com Redis

### Frontend

```bash
npm run test
```

- Formulário de criação
- Tela de listagem

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

```
DATABASE_URL="postgresql://admin:admin@localhost:5432/peopletech"
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura de Pastas

```
backend/
├── prisma/
│   └── migrations/, schema.prisma, seeds
├── src/
│   ├── prisma/
│   ├── redis/
│   ├── users/
│   │   └── __tests__/
│   └── main.ts, app.module.ts, app.service.ts

frontend/src/
├── components/
│   └── Layout, NavBar, UserForm + __tests__
├── contexts/
├── pages/
│   └── index.tsx, create.tsx, edit/[id].tsx + __tests__
├── services/
├── styles/, themes/, types/, utils/
```

---

## 👨‍💻 Autor

**Marcos Paulo Lopes da Costa**  
[marcospaulolopesc@gmail.com](mailto:marcospaulolopesc@gmail.com)

---
