# NASA Athlone

A small monorepo containing the frontend and backend in one repository.

## Structure

```text
.
├── frontend/  # Vite + React + TypeScript
└── backend/   # Reserved for the backend service
```

## Frontend setup

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`. Requests to `/api/*` are proxied to
`http://localhost:3000`, where the backend can run during local development.

Other useful commands:

```bash
npm run build
npm run lint
```

The backend team can add its own runtime and dependency files under `backend/` without
changing the frontend setup.
