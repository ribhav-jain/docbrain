# rag-mind

A RAG-powered knowledge engine that lets users upload documents and get accurate, citation-backed answers through an intelligent AI chat interface.

The project combines an Express API + Postgres (with pgvector) backend and a React + Vite frontend. It lets users upload documents, create vector indexes, and query an AI-powered chat interface that can return citation-backed answers.

- Document ingestion and chunking.
- Vector storage (pgvector) and nearest-neighbour search for retrieval.
- An LLM provider (OpenAI / other) as the final answer generator.
- A modern React UI to upload files, manage knowledge bases, and interact with chat.

---

## Features

- Upload and manage documents (PDF/DOCX/TXT).
- Vectorize documents and store embeddings (1536-dimension vectors by default — OpenAI-style).
- Simple chat UI that demonstrates how to combine retrieval + generation (RAG).
- User session management using Postgres-backed sessions (Replit OIDC blueprint integration).
- Example settings UI to choose LLM and embedding models (client-side mock configuration).

## Tech stack

- Node.js + Express (server)
- React + Vite (client)
- Postgres (recommended: Neon) with pgvector
- Drizzle ORM + drizzle-kit for migrations and schema
- Replit-friendly configuration and scripts (optional)

---

## Getting started (developer)

These instructions assume you're working at the repository root.

Prerequisites

- Node.js (v18+ recommended; the project uses features that work well on Node 20)
- npm (or yarn, pnpm)
- A Postgres database with the pgvector extension (Neon/Postgres). You will need a DATABASE_URL pointing to it.

Recommended environment variables

Create a .env file (or set environment variables in your shell) with the following keys:

- DATABASE_URL — Postgres connection string (required)
- SESSION_SECRET — random string to sign sessions (required for session store)
- REPL_ID — (optional) Replit OIDC client id if deploying to Replit and using Replit Auth
- ISSUER_URL — (optional) OIDC issuer URL (defaults to Replit's OIDC endpoint)
- PORT — (optional) server port (defaults to 5000)
- OPENAI_API_KEY — (optional) if you configure OpenAI-based providers for embeddings / LLM calls

Example `.env` (do NOT check secrets into source control):

DATABASE_URL=postgres://user:pass@host:5432/mydb
SESSION_SECRET=replace-with-a-strong-secret
OPENAI_API_KEY=sk-...

Note (Windows PowerShell): to run a single command with env vars you can use `$env:NAME = 'value'; npm run dev` or configure them in your environment.

Install dependencies

```bash
npm install
```

Dev server (development)

The project runs the server and serves the Vite client in middleware mode so you can use a single dev command.

```bash
npm run dev
```

This starts the app on http://localhost:5000 by default (PORT environment variable overrides the default).

If you only want to run the client (dev-only):

```bash
npm run dev:client
```

Build & production

Build the client and bundle the server into `dist`:

```bash
npm run build
```

Start the production server (after building):

```bash
npm run start
```

Developer utilities

- TypeScript check: `npm run check`
- Push DB schema (drizzle): `npm run db:push`

---

## Database

This project uses Drizzle ORM and expects a Postgres-compatible database. Document chunks store an `embedding` column as a pgvector vector with 1536 dimensions (compatible with OpenAI embeddings). You should provision a database (Neon or Postgres + pgvector) and ensure `DATABASE_URL` is set.

## Deployment

Build (see Build & production), ensure your environment variables are set, and run `npm run start` on a host that supports Node.js. Make sure your production Postgres has the pgvector extension and your session table is created for sessions to work.

---

## Where to look in the code

- Server entry: `server/index.ts`
- API routes and setup: `server/routes.ts` and `server/replitAuth.ts`
- DB & ORM: `server/db.ts`, `shared/schema.ts`
- Client app: `client/src/` — main UI and pages
- Build pipeline: `script/build.ts` and `package.json` scripts
