# Team Task Manager — Frontend (SY)

Light, modern React frontend built with Vite + Tailwind CSS. State is managed with Redux Toolkit.

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- The backend running (see `../backend/README.md`)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the example and point it at the backend:

   ```bash
   cp .env.example .env
   ```

   Default value used in this variant:

   ```
   VITE_API_BASE_URL=http://localhost:8001/api
   ```

## Run

Dev server (hot reload):

```bash
npm run dev
```

App opens at http://localhost:5174

Production build:

```bash
npm run build
npm run preview
```

The build output goes to `dist/`.

## Project structure

```
src/
  api/          API client + per-domain calls
  components/   Reusable UI pieces and layout
  pages/        Route-level screens
  store/        Redux slices (auth, projects, tasks, users)
  utils/        Small helpers (dates, errors, token storage)
```

## Default admin (after seeding)

- Email: `sarah@example.com`
- Password: `sy-password-123`
