================================================================================
TEAM TASK MANAGER
================================================================================

A full-stack team task management application for organizing work across
projects. Teams can sign up, spin up projects, invite members with admin or
member roles, and track tasks end-to-end with status, priority, assignees,
and due dates. A dashboard surfaces what matters at a glance — total work,
what's in progress, what's done, and what's overdue — while project views
let you filter tasks by status to stay focused.


--------------------------------------------------------------------------------
WHAT'S IN THIS FOLDER
--------------------------------------------------------------------------------

  team-task-manager/
    backend/    FastAPI + MongoDB API
    frontend/   React + Vite app (Tailwind, Redux Toolkit)


--------------------------------------------------------------------------------
FEATURES
--------------------------------------------------------------------------------

  - Email + password authentication with JWT
  - Roles: admin and member (role-based permissions enforced on the server)
  - Projects with members (add / remove, with admin/member project roles)
  - Tasks with title, description, status (todo / in_progress / done),
    priority (low / medium / high), assignee and due date
  - Dashboard with stat tiles (total / in progress / done / overdue) and
    recent tasks
  - Filter project tasks by status


--------------------------------------------------------------------------------
TECH STACK
--------------------------------------------------------------------------------

  Frontend  : React 18, Vite, Tailwind CSS, Redux Toolkit, react-hook-form,
              zod, axios, lucide-react
  Backend   : FastAPI, Motor (MongoDB), Pydantic v2, python-jose,
              passlib (bcrypt)
  Database  : MongoDB


--------------------------------------------------------------------------------
REQUIREMENTS
--------------------------------------------------------------------------------

  - Python   3.12+
  - Node.js  18+ and npm 9+
  - MongoDB  6+ running locally (default: mongodb://localhost:27017)


--------------------------------------------------------------------------------
RUNNING LOCALLY
--------------------------------------------------------------------------------

Start MongoDB first (default: mongodb://localhost:27017), then start the
backend, then the frontend.


1. BACKEND (FastAPI, port 8001)
-------------------------------

From backend/:

    # Create and activate a virtualenv
    python3.12 -m venv .venv
    source .venv/bin/activate

    # Install dependencies
    pip install -r requirements.txt

    # Copy env template and edit if needed
    cp .env.example .env

Set at minimum in backend/.env:

    MONGODB_URI=mongodb://localhost:27017
    MONGODB_DB_NAME=team_task_manager
    JWT_SECRET=<some-long-random-string>
    PORT=8001
    CLIENT_ORIGIN=http://localhost:5174

Run the API:

    uvicorn app.main:app --reload --port 8001

  - Health check : http://localhost:8001/health
  - API base     : http://localhost:8001/api


2. FRONTEND (React + Vite, port 5174)
-------------------------------------

From frontend/:

    # Install dependencies
    npm install

    # Copy env template and point it at the backend
    cp .env.example .env

Set in frontend/.env:

    VITE_API_BASE_URL=http://localhost:8001/api

Run the dev server (hot reload):

    npm run dev

App opens at http://localhost:5174.

Production build:

    npm run build
    npm run preview

The build output goes to dist/.


--------------------------------------------------------------------------------
URLS
--------------------------------------------------------------------------------

  - Frontend  : http://localhost:5174
  - API base  : http://localhost:8001/api
  - Health    : http://localhost:8001/health


--------------------------------------------------------------------------------
PROJECT LAYOUT
--------------------------------------------------------------------------------

Backend (backend/app/):

    app/
      api/endpoints/   Route handlers (auth, users, projects, tasks)
      api/dependencies.py
      config/          Settings + security helpers
      database/        Mongo client + indexes
      models/          Shared types
      schemas/         Pydantic request/response models
      services/        Business logic
      main.py          App factory

Frontend (frontend/src/):

    src/
      api/          API client + per-domain calls
      components/   Reusable UI pieces and layout
      pages/        Route-level screens
      store/        Redux slices (auth, projects, tasks, users)
      utils/        Small helpers (dates, errors, token storage)


--------------------------------------------------------------------------------
DEPLOYMENT
--------------------------------------------------------------------------------

  - Backend  : Railway / any container host. Uses Procfile and railway.json
               with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
               Python runtime pinned in runtime.txt (3.12.7).
  - Frontend : Vercel. vercel.json rewrites all routes to /index.html for
               SPA routing. Build output: dist/.
