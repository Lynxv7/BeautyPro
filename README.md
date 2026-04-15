# BeautyPro

O BeautyPro é um sistema simples e moderno para gerenciamento de salões de beleza e studios.

A ideia aqui é centralizar tudo que um salão precisa no dia a dia:
agendamentos, clientes, serviços e organização do negócio — tudo em um só lugar.

---

## 💡 Por que esse projeto existe?

Esse projeto nasceu pra resolver um problema comum:

> “Tudo é feito no papel, WhatsApp ou planilha… e isso vira bagunça rápido.”

O BeautyPro tenta resolver isso de forma leve, rápida e escalável.

---

## ⚙️ Tecnologias usadas

- Next.js (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- Drizzle ORM
- PostgreSQL (Neon)
- Better Auth
- React Hook Form + Zod

---

## 🧠 Como funciona

O sistema é multi-tenant (cada usuário tem seu próprio salão).

Fluxo simples:

1. Usuário cria uma conta
2. Um salão é criado automaticamente
3. Tudo já fica vinculado a esse salão
4. A partir daí ele já usa o sistema normalmente

Sem onboarding complicado.

---

## 🏢 Estrutura de dados

Tudo gira em torno do salão:

- usuários pertencem a um salão
- clientes pertencem a um salão
- serviços pertencem a um salão
- agendamentos pertencem a um salão

Isso garante que cada negócio fique totalmente isolado.

---

## 🔐 Login e segurança

A autenticação é feita com Better Auth.

- login com email e senha
- sessões seguras
- integração direta com PostgreSQL

---

## 📦 O que o sistema faz hoje

- Criar conta e login
- Criar salão automaticamente
- Cadastro de clientes
- Cadastro de serviços
- Agendamento de horários
- Controle básico de status dos agendamentos

---

## 🧱 Banco de dados

Principais tabelas:

- users
- accounts
- sessions
- salons
- clients
- services
- appointments

---

Desenvolvido por Daniel Veloso 🚀

Esse projeto é parte do meu processo de construção de um SaaS real do zero.
