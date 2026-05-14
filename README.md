# The Syndicate Protocol — Frontend

Premium mob-themed daily habit tracker built with React + TypeScript + Vite.

## Stack

- **React 18** + **TypeScript** (strict)
- **Vite** — build tool
- **TailwindCSS** — utility-first styling (dark gold/black theme)
- **TanStack Query** — server state, caching, mutations
- **Zustand** — auth state (persisted refresh token)
- **Axios** — HTTP client with JWT auto-refresh interceptor
- **React Router v6** — client-side routing
- **Recharts** — bar charts, donut charts
- **React Hot Toast** — notifications
- **Lucide React** — icons
- **React Hook Form** — form handling

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit VITE_API_BASE_URL if your backend runs on a different port
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```
   App runs at http://localhost:5173

4. **Backend required**
   The backend must be running at the URL configured in `.env`.
   Default: `http://localhost:8000/api/v1`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` | Backend API base URL |

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Authentication |
| `/register` | New account + habit seed |
| `/dashboard` | Daily habit tracking (main page) |
| `/analytics` | Weekly performance charts |
| `/habits` | Habit CRUD management |
| `/settings` | Profile management |

## Project Structure

```
src/
├── types/          # TypeScript interfaces
├── stores/         # Zustand stores (auth)
├── lib/            # axios client, utility functions
├── services/       # API service layer (one file per resource)
├── hooks/          # React Query hooks (one file per resource)
├── pages/          # Route-level page components
└── components/
    ├── ui/         # Reusable primitives (Button, Input, Card, etc.)
    ├── layout/     # AppLayout, Sidebar, ProtectedRoute
    ├── dashboard/  # Dashboard-specific components
    ├── analytics/  # Analytics charts
    └── habits/     # Habit management components
```

## Build

```bash
npm run build
npm run preview
```
