# 🚀 DB-Generator (Monorepo)

**DB-Generator** is a full-stack, AI-powered PostgreSQL database schema designer. It enables developers to architect 3NF normalized schemas using natural language prompts, visually customize tables and foreign key relationships on an interactive canvas, and deploy live to Supabase PostgreSQL with 1 click.

---

## 📁 Monorepo Folder Structure

```
db-generator/
├── frontend/                   # Next.js 16 (App Router) + React Flow + Zustand
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Obsidian Nebula login & register pages
│   │   ├── dashboard/          # Post-login WebGL nebula dashboard & studio
│   │   │   ├── schema/         # Unified Interactive Schema Builder studio
│   │   │   └── databases/      # Saved databases & connection strings
│   │   └── api/                # Next.js API route handlers
│   ├── components/             # Reusable UI component modules
│   │   ├── Auth/               # Login & Register forms + SQL showcase
│   │   ├── Dashboard/          # WebGL organic nebula background shader
│   │   ├── Landing/            # Spatial cosmic landing page sections
│   │   ├── ManualBuilder/      # React Flow canvas, table cards & toolbar
│   │   └── Schema/             # Modals, DDL export, deployment buttons
│   ├── lib/                    # Client hooks, store, and services
│   ├── styles/                 # Theme effects, nebula shaders, animations
│   ├── types/                  # Local TypeScript type declarations
│   ├── .env.example            # Frontend environment variable template
│   ├── .env.local              # Frontend local secrets (ignored by git)
│   └── package.json            # Frontend dependencies (@db-generator/frontend)
│
├── backend/                    # Express + TypeScript API Server (Port 3001)
│   ├── src/
│   │   ├── api/                # API routes & controllers
│   │   │   ├── controllers/    # authController, databaseController, groqController
│   │   │   └── routes/         # Express endpoint definitions
│   │   ├── config/             # Environment, Supabase & Groq client configs
│   │   └── services/           # AuthService, DatabaseService, GroqService, SqlService
│   ├── .env.example            # Backend environment variable template
│   ├── .env.local              # Backend local secrets (ignored by git)
│   └── package.json            # Backend dependencies (@db-generator/backend)
│
├── shared/                     # Shared TypeScript packages (@db-generator/shared)
│   ├── constants/              # PostgreSQL data types, app routes
│   ├── types/                  # Schema, Groq, database, auth TypeScript models
│   └── utils/                  # Schema normalization, formatting & validation
│
├── docs/                       # Technical & architectural documentation
│   ├── API.md                  # REST API endpoint reference
│   └── ARCHITECTURE.md         # Full system architecture specification
│
├── .env.example                # Monorepo root environment variable template
├── .env.local                  # Monorepo root local secrets (ignored by git)
├── PROJECT_MEMORY.md           # Persistent project memory & quick start
└── package.json                # Monorepo workspace configuration
```

---

## 🔐 Environment Setup

Each workspace (`frontend/`, `backend/`, and root) has a `.env.example` template:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Required credentials:
   - **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL (`https://your-project.supabase.co`)
   - **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Supabase anonymous public key
   - **`SUPABASE_SERVICE_ROLE_KEY`**: Supabase service role key (for schema execution)
   - **`GROQ_API_KEY`**: Groq API key (`gsk_...`)
   - **`GROQ_MODEL`**: `openai/gpt-oss-120b`

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Both Services Simultaneously
```bash
npm run dev
```
- **Frontend**: `http://localhost:3002` (or `3000`)
- **Backend API**: `http://localhost:3001`

### 3. Run Workspaces Individually
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

---

## 📌 Architecture & Memory
For complete design details, credentials, and API specifications, see [PROJECT_MEMORY.md](./PROJECT_MEMORY.md).
