# 🏗️ Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                      │
│                                                                │
│  ┌──────────────┐     ┌────────────────┐    ┌───────────────┐  │
│  │  AI Prompt   │     │  Interactive   │    │ My Databases  │  │
│  │   (Prompt)   │     │   React Flow   │    │  (History &   │  │
│  │              │     │    Diagram     │    │  Credentials) │  │
│  └──────┬───────┘     └────────▲───────┘    └───────▲───────┘  │
└─────────┼──────────────────────┼────────────────────┼──────────┘
          │                      │                    │
          ▼                      │                    │
┌────────────────────────────────┼────────────────────┼──────────┐
│                        BACKEND (Express)            │          │
│                                │                    │          │
│  ┌──────────────┐              │            ┌───────┴───────┐  │
│  │ Groq Service │              │            │ Database Svc  │  │
│  │(qwen3.8-27b) │              │            │  (Deploy &    │  │
│  └──────┬───────┘              │            │  Drop Tables) │  │
│         │                      │            └───────┬───────┘  │
└─────────┼──────────────────────┼────────────────────┼──────────┘
          │                      │                    │
          ▼                      │                    ▼
┌──────────────────┐             │            ┌──────────────────┐
│     Groq API     │             │            │     Supabase     │
│   (LLM Server)   │             │            │    PostgreSQL    │
└──────────────────┘             │            └──────────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │    SHARED (@shared)       │
                   │ • Schema & Groq Types     │
                   │ • Constants & Routes      │
                   │ • SQL Identifiers & Valid │
                   └───────────────────────────┘
```

## Workspaces Isolation

- **Frontend (`/frontend`)**:
  - Contains user-facing UI, page layouts, React Flow canvas, forms, and client session guards.
  - Interacts with backend API routes (`/api/...`).
  - Accesses Supabase client only via the public publishable anon key.

- **Backend (`/backend`)**:
  - Keeps the secret service role key secure on the server.
  - Direct execution of PostgreSQL DDL through `sql` RPC function.
  - Direct connection with Groq SDK using the `GROQ_API_KEY`.

- **Shared (`/shared`)**:
  - Ensures type-safety across both ends of the wire.
  - Exports TypeScript interfaces for schemas, tables, columns, API routes, and validation routines.
