# 🏟️ Sports Articles Monorepo

A production-style full-stack application built with **Next.js**, **Apollo GraphQL**, and **Prisma**.  
The project demonstrates **server-side rendering**, **infinite pagination**, GraphQL caching strategies, and a clean **monorepo architecture**.

---

## ✨ Features

- 📄 Server-side rendered list of sports articles (SEO friendly)
- ♾️ Infinite pagination using **Load more**
- 📰 Article details page
- ✏️ Full CRUD: create, edit, delete articles
- 🔐 Soft delete support via `deletedAt`
- 🚀 Apollo Client cache handling with `fetchMore`
- 🎨 UI built with **Material UI**
- 📦 Monorepo structure powered by **pnpm workspaces**

---

## 🧱 Tech Stack

### Frontend

- Next.js (Pages Router)
- TypeScript
- Apollo Client
- Material UI
- Server-side rendering with `getServerSideProps`

### Backend

- Node.js + Express
- Apollo Server (GraphQL)
- Prisma ORM
- PostgreSQL
- Zod for input validation

### Tooling

- pnpm (workspaces)
- ESLint
- Prettier

---

## 📁 Project Structure

```text
sports-articles-monorepo/
├─ apps/
│  ├─ frontend/        # Next.js application
│  └─ backend/         # GraphQL API (Apollo + Prisma)
├─ package.json
├─ pnpm-workspace.yaml
└─ README.md

---

## ⚙️ Environment Variables

### Backend (`apps/backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sports_articles
PORT=4000

### Frontend (apps/frontend/.env.local)
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

---

## 🚀 Getting Started

### 1️⃣ Install dependencies
```bash
pnpm install

### 2️⃣ Setup database
```text
cd apps/backend
```bash
pnpm prisma migrate dev
pnpm prisma db seed
### 3️⃣ Run the project
```bash
pnpm dev
```text
Frontend → http://localhost:3000
```text
GraphQL API → http://localhost:4000/graphql

---

## 🧹 Code Quality

### Format code
```bash
pnpm format

### Lint code
```bash
pnpm lint

---

## 📌 Notes
### Image URLs are optional and not validated beyond basic checks
### Unsplash demo URLs may return 404 — image rendering is intentionally non-blocking
### Hooks rules are respected (no conditional hooks)

## 🧠 What This Project Demonstrates
### Real-world GraphQL pagination
### Apollo cache normalization & merging
### SSR + client hydration
### Clean separation of concerns (frontend / backend)
### Production-style project structure

---

## 👤 Author
```text
Vasyl Haida
Full-Stack / Frontend Engineer