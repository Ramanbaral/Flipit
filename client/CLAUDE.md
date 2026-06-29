# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**FlipIt** — a recommerce (pre-owned goods marketplace) platform frontend. Built with React 19, TypeScript, Vite, and TanStack Router.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # type-check + production build (tsc -b && vite build)
pnpm lint         # ESLint
pnpm format       # Prettier (writes in-place)
pnpm preview      # preview the production build locally
```

No test suite exists yet.

## Architecture

### Routing (TanStack Router — file-based)

Routes live in `src/routes/`. The router plugin (`@tanstack/router-plugin/vite`) scans this directory at build/dev time and **auto-generates `src/routeTree.gen.ts`** — never edit that file manually.

- `src/routes/__root.tsx` — root layout wrapping all routes via `<Outlet />`
- `src/routes/index.tsx` — `/` route
- `src/routes/about.tsx` — `/about` route
- New routes: create a file at `src/routes/<name>.tsx` and export `Route = createFileRoute('/<name>')({...})`

Auto code-splitting is enabled; each route bundle is split automatically.

### Entry points

`src/main.tsx` → `src/App.tsx` (sets up `RouterProvider` with the generated route tree) → routes.

### State & data fetching

- **Zustand** — global client state
- **TanStack Query** — server state / async data fetching
- **Axios** — HTTP client

Neither is wired up to a backend yet; they're declared as dependencies but unused.

### Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin. No `tailwind.config.js` — configuration lives in CSS (`src/index.css`). Design uses a purple/indigo palette.

### Components

Shared UI components go in `src/components/common/`. Feature-specific components should be co-located with their route or in a `src/components/<feature>/` directory.

### Backend

The server lives at `../server/` (Python — `main.py` is present). The original NestJS scaffold was replaced. The client has no API calls wired up yet.
