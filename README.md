# Dev Planner

Plataforma web de gerenciamento de projetos acadêmicos usando metodologia Kanban, desenvolvida para estudantes de Engenharia de Software da UniCesumar.

## Sobre o Projeto

Dev Planner é uma ferramenta completa para organização de tarefas acadêmicas, permitindo que estudantes gerenciem múltiplos projetos simultaneamente utilizando a metodologia ágil Kanban. A aplicação oferece uma interface intuitiva e moderna para criação, visualização e movimentação de tarefas entre as colunas "A Fazer", "Fazendo" e "Feito".

## Funcionalidades

### Autenticação
- Sistema completo de registro e login
- Autenticação segura com Supabase Auth
- Proteção de rotas e dados por usuário

### Gestão de Projetos
- Criação de múltiplos projetos
- Visualização organizada em cards
- Exclusão de projetos com confirmação
- Descrições detalhadas para cada projeto

### Gestão de Tarefas
- Criação de tarefas com título e descrição
- Edição de tarefas existentes
- Movimentação entre colunas do Kanban
- Exclusão de tarefas com confirmação
- Data de criação visível em cada tarefa

### Interface Kanban
- Board visual com 3 colunas padrão
- Contador de tarefas por coluna
- Botões de navegação para mover tarefas
- Design responsivo e moderno
- Cores diferenciadas por status

## Stack Tecnológica

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **TailwindCSS** - Framework CSS utility-first
- **Lucide React** - Ícones modernos

### Backend/Database
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Real-time capabilities

### Arquitetura
- **Programação Orientada a Objetos (POO)** - Services classes
- **Context API** - Gerenciamento de estado
- **RESTful patterns** - Comunicação com banco de dados

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── KanbanBoard.tsx     # Board Kanban principal
│   ├── TaskCard.tsx        # Card individual de tarefa
│   ├── Navbar.tsx          # Barra de navegação
│   ├── ModalCreateTask.tsx # Modal de criação/edição
│   └── ModalCreateProject.tsx
├── pages/              # Páginas da aplicação
│   ├── Login.tsx           # Tela de login/registro
│   └── Dashboard.tsx       # Dashboard principal
├── services/           # Lógica de negócio (POO)
│   ├── AuthService.ts      # Autenticação
│   ├── ProjectService.ts   # Gestão de projetos
│   └── TaskService.ts      # Gestão de tarefas
├── context/            # Context API
│   └── AuthContext.tsx     # Contexto de autenticação
├── lib/                # Configurações
│   ├── supabase.ts         # Cliente Supabase
│   └── database.types.ts   # Tipos TypeScript
└── App.tsx             # Componente principal
```

## Modelo de Dados

### Tabela: profiles
```typescript
{
  id: uuid (PK, FK -> auth.users)
  name: string
  created_at: timestamp
}
```

### Tabela: projects
```typescript
{
  id: uuid (PK)
  user_id: uuid (FK -> auth.users)
  title: string
  description: string
  columns: jsonb ["A Fazer", "Fazendo", "Feito"]
  created_at: timestamp
  updated_at: timestamp
}
```

### Tabela: tasks
```typescript
{
  id: uuid (PK)
  project_id: uuid (FK -> projects)
  title: string
  description: string
  status: string
  created_at: timestamp
  updated_at: timestamp
}
```

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (já configurada)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd devplanner
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

O arquivo `.env` já está configurado com as credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://sejbexxinpgnfsscpear.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-chave-anonima>
```

4. **Execute a aplicação**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa o linter
npm run typecheck # Verifica tipos TypeScript
```

## Segurança

### Row Level Security (RLS)
Todas as tabelas possuem políticas RLS habilitadas:

- **Profiles**: Usuários só acessam seu próprio perfil
- **Projects**: Usuários só visualizam/editam seus projetos
- **Tasks**: Usuários só gerenciam tarefas de seus projetos

### Autenticação
- Senhas criptografadas pelo Supabase Auth
- Tokens JWT para sessões
- Proteção contra SQL injection
- CORS configurado adequadamente

## Conceitos Aplicados

### Programação Orientada a Objetos
- **Classes de Serviço**: AuthService, ProjectService, TaskService
- **Encapsulamento**: Métodos privados e públicos
- **Single Responsibility**: Cada service tem responsabilidade única
- **Abstração**: Interfaces TypeScript para contratos

### Padrões de Design
- **Service Layer Pattern**: Lógica de negócio separada
- **Repository Pattern**: Acesso a dados centralizado
- **Provider Pattern**: Context API para estado global

### Metodologia Ágil
- **Kanban**: Visualização de fluxo de trabalho
- **Cards**: Representação visual de tarefas
- **Colunas**: Estados do processo (To Do, Doing, Done)
- **WIP Limits**: Controle implícito de trabalho em progresso

## Guia de Uso

### 1. Criar Conta
- Acesse a aplicação
- Clique em "Cadastrar"
- Preencha nome, email e senha (mínimo 6 caracteres)
- Clique em "Cadastrar"

### 2. Criar Projeto
- No dashboard, clique em "Novo Projeto"
- Preencha título e descrição
- Clique em "Criar Projeto"

### 3. Gerenciar Tarefas
- Selecione um projeto clicando nele
- Clique em "Nova Tarefa"
- Preencha título, descrição e status inicial
- Use os botões "Anterior" e "Próximo" para mover tarefas
- Clique no ícone de lápis para editar
- Clique no ícone de lixeira para excluir

### 4. Navegar entre Projetos
- Clique em qualquer card de projeto para visualizá-lo
- O projeto selecionado fica destacado com borda azul
- Cada projeto mantém suas próprias tarefas

## Desenvolvimento

### Adicionar Nova Funcionalidade
1. Crie o service em `src/services/`
2. Adicione tipos em `src/lib/database.types.ts`
3. Crie componentes necessários em `src/components/`
4. Atualize a interface em `src/pages/`

### Boas Práticas Implementadas
- TypeScript strict mode
- ESLint configurado
- Componentes reutilizáveis
- Tratamento de erros consistente
- Loading states
- Confirmações para ações destrutivas
- Design responsivo mobile-first

## Troubleshooting

### Erro de Autenticação
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o Supabase Auth está habilitado
- Limpe o cache do navegador

### Tarefas não aparecem
- Verifique se você está no projeto correto
- Confirme que as políticas RLS estão ativas
- Recarregue a página

### Build falha
```bash
npm run typecheck  # Verifica erros de TypeScript
npm run lint       # Verifica problemas no código
```

## Melhorias Futuras

- [ ] Drag and drop nativo para tarefas
- [ ] Filtros por status
- [ ] Gráficos de progresso
- [ ] Modo dark/light
- [ ] Priorização de tarefas
- [ ] Tags e categorias
- [ ] Histórico de mudanças
- [ ] Notificações
- [ ] Colaboração em projetos
- [ ] Export/Import de dados

## Licença

Projeto Acadêmico - Engenharia de Software UniCesumar 2025

## Autor

Desenvolvido como projeto acadêmico para a disciplina de Engenharia de Software (ESOFT6S).

---

**Dev Planner** - Organize seus projetos acadêmicos com metodologia ágil 🚀
