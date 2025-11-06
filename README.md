# Dev Planner

Plataforma web para gerenciamento de projetos acadêmicos com base na metodologia **Kanban**, desenvolvida por estudantes de Engenharia de Software da UniCesumar.

## Sobre o Projeto

O **Dev Planner** foi criado para ajudar estudantes a organizarem seus projetos e tarefas de forma simples e visual.  
A aplicação utiliza o método **Kanban**, permitindo acompanhar o progresso de cada projeto através de colunas, gráficos e tags personalizadas.  
Tudo é salvo e sincronizado em tempo real, com segurança garantida pelo **Supabase**.

## Principais Funcionalidades

- Login e registro com **Supabase Auth**  
- Criação, edição e exclusão de projetos  
- **Quadro Kanban interativo** com **drag & drop**  
- Filtros por status e tags personalizadas  
- **Modo escuro e claro** automático  
- **Gráficos de progresso** por projeto  
- Contador de tarefas por coluna  
- Interface responsiva e fluida  

## Stack Tecnológica

- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS  
- **Ícones:** Lucide React  
- **Backend / Database:** Supabase (PostgreSQL + Auth + RLS + Realtime)  
- **Arquitetura:** POO, Context API, e comunicação RESTful  

## Estrutura Simplificada
```yaml
src/
├── components/
│ ├── KanbanBoard.tsx
│ ├── TaskCard.tsx
│ ├── Navbar.tsx
│ ├── ModalTask.tsx
│ └── ModalProject.tsx
├── pages/
│ ├── Login.tsx
│ └── Dashboard.tsx
├── services/
│ ├── AuthService.ts
│ ├── ProjectService.ts
│ └── TaskService.ts
├── context/
│ └── AuthContext.tsx
├── lib/
│ ├── supabase.ts
│ └── database.types.ts
└── App.tsx
```

## Estrutura de Dados

### profiles
Tabela: profiles
```typescript
{
  id: uuid (PK, FK -> auth.users)
  name: string
  created_at: timestamp
}
```
Tabela: projects
```typescript
{
  id: uuid (PK)
  user_id: uuid (FK -> auth.users)
  title: string
  description: string
  created_at: timestamp
  updated_at: timestamp
}
```
Tabela: tasks
```typescript
{
  id: uuid (PK)
  project_id: uuid (FK -> projects)
  title: string
  description: string
  status: "A Fazer" | "Fazendo" | "Feito"
  tags: string[]
  created_at: timestamp
  updated_at: timestamp
}
```
Como Rodar
Clone o repositório

```bash
git clone <url-do-repositorio>
cd devplanner
```
Instale as dependências

```bash
npm install
```
Configure o Supabase
Crie um arquivo .env:

```env
VITE_SUPABASE_URL=https://sejbexxinpgnfsscpear.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-chave-anonima>
```
Inicie o projeto

```bash
npm run dev
```
Acesse em http://localhost:5173

Equipe
Pedro Toscano — R.A: 25362292-2
Lucas de Freitas Bovo — R.A: 25362304-2
Gabriel Felipe Alexandre dos Santos — R.A: 25362250-2

Dev Planner — Organize seus projetos, visualize seu progresso e entregue com mais foco. 
---