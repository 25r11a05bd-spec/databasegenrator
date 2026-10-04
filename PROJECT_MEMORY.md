# 🗂️ DB-GENERATOR: PROJECT MEMORY & QUICK START

**Last Updated:** October 4, 2026
**Status:** ACTIVE/DEVELOPMENT
**Team:** Antigravity + User
**Architecture:** Monorepo (Frontend + Backend + Shared)

---

## 🎯 PROJECT OVERVIEW

**DB-Generator** is an AI-powered database schema generator that allows users to:
1. Generate PostgreSQL database schemas from natural language prompts (Groq AI)
2. **Unified Schema Studio (`/dashboard/schema`)**: AI and manual editing are unified into a single interactive workspace. When AI generates a schema, the tables load directly onto the draggable React Flow canvas, allowing users to freely manipulate tables, add/edit/delete columns, draw relationships, or add new tables by hand.
3. Deploy the manipulated schema to Supabase PostgreSQL with 1-click
4. Get connection strings in multiple formats (.env, PostgreSQL URI, PgBouncer Pooler, Prisma)
5. Manage all created databases with drop/delete synchronization

**Tech Stack:**
- Frontend: Next.js 16 (App Router) + TypeScript + Tailwind CSS / Vanilla CSS + React Flow + Zustand
- Backend: Node.js + Express + TypeScript
- Database: Supabase PostgreSQL (REST API + RPC SQL execution)
- AI: Groq API (`openai/gpt-oss-120b`, 3500 max_tokens)
- Visualization: React Flow (Interactive Canvas Studio)

---

## 🔑 CREDENTIALS

Secrets are stored in `.env.local` files (git-ignored). Never commit real keys.
See `.env.example` templates for variable names.

| Variable | Location |
|----------|----------|
| SUPABASE_URL | backend/.env.local |
| SUPABASE_ANON_KEY | backend/.env.local |
| SUPABASE_SERVICE_ROLE_KEY | backend/.env.local |
| GROQ_API_KEY | backend/.env.local |
| GROQ_MODEL | backend/.env.local |

---

## 📁 FOLDER STRUCTURE & ENVIRONMENT FILES

```
db-generator/
├── frontend/                   # Next.js 16 (App Router) + React Flow + Zustand
│   ├── app/                    # App Router pages (/, login, register, dashboard, schema, databases)
│   ├── components/             # UI modules (Landing, Auth, Dashboard, ManualBuilder, Schema)
│   ├── lib/                    # Client hooks (useAuth, useManualBuilder), Zustand store, Supabase client
│   ├── styles/                 # Tailwind CSS, nebula shaders, animations
│   ├── types/                  # Local TypeScript type declarations
│   ├── .env.example            # Frontend environment variable template
│   ├── .env.local              # Frontend local secrets (ignored by git)
│   └── package.json            # Frontend dependencies (@db-generator/frontend)
│
├── backend/                    # Express + TypeScript API Server (Port 3001)
│   ├── src/
│   │   ├── api/                # Controllers (auth, database, groq) & routes
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
├── .gitignore                  # Ignores secret .env files, keeps .env.example
├── PROJECT_MEMORY.md           # Persistent project memory & quick start
├── README.md                   # Workspace instructions
└── package.json                # Monorepo workspace configuration
```

### **Environment Files Overview**
- **`.env.local` (in root, `frontend/`, `backend/`)**: Active development secrets (git-ignored). Copy from `.env.example` and fill in real values.
- **`.env.example` (in root, `frontend/`, `backend/`)**: Clean, public configuration templates documenting each variable for developers cloning the repository.
- **`.gitignore`**: Configured to ignore all secret `.env` and `.env*.local` files while preserving `.env.example` templates.

### **Frontend (`/frontend`)**
- **High-Fidelity Landing Page (`/` / `components/Landing/`)**: Replicated from Stitch design with cosmic grid, interactive mouse follower glow, spatial canvas preview mockup, live animated stats, 6-feature grid, 4-step walkthrough, comparison table, value props, testimonials, and CTA
- **Obsidian Nebula Auth (`/login` & `/register`)**: 2-column developer-focused design with interactive cursor spotlight, glassmorphic panel, password visibility toggle, real Supabase auth with auto-confirm fallback, live system status indicator, floating SQL terminal showcase with 3NF verification, and CTO social proof
- **Post-Login Obsidian Nebula Dashboard (`/dashboard`)**: Replicated pixel-perfect from Google Stitch export:
  - Custom full-bleed WebGL Simplex & FBM organic nebula shader canvas with domain warping and stardust scintillation + mouse coordinate reactivity
  - Architectural grid lattice overlay (`.bg-grid-lattice`) and delicate radial vignette for maximum readability
  - Glassmorphic top navigation bar with active violet glow pill tabs (`Home`, `Schema Builder`, `My Databases`), live user email pill with pulsing emerald indicator, and Sign Out button
  - Shimmering hero headline (`Welcome to DB-Generator`), subtitle, and dual glowing CTA buttons (`⚡ Launch Schema Builder` -> `/dashboard/schema` and `🗄️ View Past Databases` -> `/dashboard/databases`)
  - 4-card interactive feature grid (`Prompt → Schema`, `Define Relationships`, `Export & Deploy`, `Saved Databases`) with responsive hover lift, neon accent bottom lines, and direct links
  - Minimalist live status footer (`PostgreSQL 16.4`, `Zero Schema Drift`, `Supabase Connected`)
- **Unified Interactive Schema Builder (`/dashboard/schema`)**: Replicated pixel-perfect from Google Stitch export:
  - Responsive constrained width (`max-w-[1240px]`) preventing over-stretching on wide monitors
  - Compact & sleek AI Schema Architect input bar (`prompter-glow`, `ai-btn-shimmer`, quick template chips with tight padding)
  - Streamlined Action Toolbar (`glass-panel`) with compact database name editor, `📁 X Tables` badge, and compact action buttons (`+ Add Table`, `🔗 Connect Tables`, `✨ Tidy`, `📄 SQL`, `🧹 Clear`, `✅ Approve Schema`, `🚀 Deploy to Supabase`)
  - Compact Table Cards (`TableNode` width: `230px`) with smaller connector ports (`!w-3 !h-3`), neat header, monospace column items, and tight badges (`PK`, `UQ`, `REQ`, `SERIAL`, `INT`)
  - Interactive Visual Canvas (height: `540px`, `bg-dot-grid`, radial dots, floating instruction badge, top-right HUD with `Tidy & Align`, `Fit View`, Zoom in/out, dynamic percentage, `Snap`, and `Map`)
  - Built-in SQL Preview Modal displaying generated PostgreSQL DDL with 1-click Copy to Clipboard and `.sql` file download
- Full Schema Manipulation: Add columns, change types, toggle PK/UQ/Nullable, draw FK edges, rename tables, add manual tables
- Dashboard: View past databases, table counts, creation dates, open in visual builder
- Connection strings: Copy in multiple formats (.env, URI, Pooler, Prisma)

### **Backend (`/backend`)**
- Auth endpoints (register, login, logout, auto-confirm)
- Groq integration (parse natural language prompts, merge schema adjustments)
- Database operations (create, fetch, delete & drop tables)
- SQL generation from schemas (DDL with foreign keys)
- Supabase PostgreSQL execution via `sql` RPC helper
- Validation & error handling

### **Shared (`/shared`)**
- TypeScript type definitions (`schema`, `groq`, `database`, `auth`)
- Constants (data types, routes)
- Validation logic
- Formatting utilities

---

## 🗄️ DATABASE SCHEMA

**Supabase Tables:**

```sql
-- profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- created_databases (stores user's schemas)
CREATE TABLE IF NOT EXISTS created_databases (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  database_name VARCHAR(255),
  schema_json JSONB,
  connection_string VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- DDL execution helper function:
CREATE OR REPLACE FUNCTION sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;
```

---

## 🚀 LOCAL DEVELOPMENT

### **Setup**
```bash
# Install all dependencies across workspaces
npm install

# Set up environment variables
# frontend/.env.local and backend/.env.local
```

### **Run Both (Monorepo)**
```bash
npm run dev
# Frontend runs on http://localhost:3000 (or 3002)
# Backend runs on http://localhost:3001
```

### **Frontend Only**
```bash
npm run dev --workspace=frontend
```

### **Backend Only**
```bash
npm run dev --workspace=backend
```

---

## 📡 API ENDPOINTS (Backend - Port 3001)

### **Auth**
- `POST /api/auth/register` - Sign up with auto-confirm
- `POST /api/auth/login` - Sign in
- `POST /api/auth/confirm` - Auto-confirm unconfirmed email
- `POST /api/auth/logout` - Sign out

### **Database**
- `GET /api/database/history` - Get user's databases
- `POST /api/database/create` - Deploy & create tables in Supabase
- `DELETE /api/database/:id` - Delete database record & drop tables
- `GET /api/database/connection-string` - Get formatted connection strings

### **Groq / Schema**
- `POST /api/groq/parse` - Parse natural language text prompt → schema JSON
- `POST /api/groq/adjust` - Conversational incremental schema adjustments
- `POST /api/groq/clarify` - Handle ambiguous relationships

### **Health**
- `GET /api/health` - Health check endpoint

---

## 🤖 GROQ INTEGRATION

**Model:** `openai/gpt-oss-120b` (3500 max_tokens)

**Parse Flow:**
1. User enters natural language prompt (e.g., "E-commerce store with users, orders, products")
2. Frontend → `POST /api/groq/parse` or `POST /api/generate-schema`
3. Backend / Next API calls Groq API with structured JSON system prompt
4. Returns schema JSON with tables, columns, and foreign key relationships
5. Frontend renders interactive React Flow ER diagram

---

## 🎨 UNIFIED SCHEMA STUDIO (AI + MANUAL VISUAL BUILDER)

**Location:**
- `/dashboard/schema` (Single unified studio — legacy `/generator/manual` automatically redirects here)

**Components:**
- `app/dashboard/schema/page.tsx` & `frontend/app/dashboard/schema/page.tsx` - Unified single studio combining AI Prompt Architect bar with React Flow canvas
- `components/ManualBuilder/BuilderCanvas.tsx` - Interactive React Flow canvas with handles & minimap
- `components/ManualBuilder/TableNode.tsx` - Custom draggable table node with column types, badges, and connection handles
- `components/ManualBuilder/ColumnForm.tsx` - Modal for adding/editing columns (data types, lengths, constraints)
- `components/ManualBuilder/RelationshipForm.tsx` - Modal for connecting tables (1:N, 1:1, N:M with auto junction tables)
- `components/ManualBuilder/TableNameModal.tsx` - Modal for renaming tables
- `components/ManualBuilder/BuilderToolbar.tsx` - Toolbar with Add Table, Connect, Export SQL, Clear, Approve & Deploy
- `lib/hooks/useManualBuilder.ts` - State management hook supporting both manual edits and `loadSchemaTables(aiGeneratedTables)`

**Unified Workflow:**
1. User enters natural language prompt or picks a template in the top AI Architect bar
2. Groq AI generates normalized relational tables and immediately loads them onto the interactive React Flow canvas
3. User freely manipulates the AI-generated schema:
   - Drag tables around to organize layout
   - Click `+ Add Column` or click existing columns to edit types, lengths, defaults, and constraints
   - Drag purple handles between tables to draw foreign keys or create relationships
   - Add new manual tables alongside the AI tables
   - Rename or delete tables
4. 1-click **Approve & Deploy directly to Supabase PostgreSQL** with full connection strings generated

---

## 🚢 MONOREPO GUIDELINES

1. **Shared Code:** Any interfaces or types used by both frontend and backend belong in `shared/`.
2. **Environment Isolation:** Backend keeps `SUPABASE_SERVICE_ROLE_KEY` secret. Frontend only ever accesses `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **Database Drop:** When a database is deleted in the dashboard, the backend automatically issues `DROP TABLE IF EXISTS "table_name" CASCADE;` to keep Supabase clean.
