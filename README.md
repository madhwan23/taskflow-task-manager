# TaskFlow Team Task Manager

A production-ready full-stack team task manager built with Django REST Framework and React. It includes JWT auth, role-based access, project/task management, dashboard analytics, activity logs, file attachment API support, seed data, and Railway deployment files.

## Stack

- Backend: Django, DRF, SimpleJWT, Django ORM, SQLite locally, PostgreSQL via `DATABASE_URL`
- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Context API, Recharts
- Deployment: Railway-ready `railway.json`, `Procfile`, env examples

## Local Setup

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Demo users:

- Admin: `admin` / `Admin@12345`
- Member: `neha` / `Member@12345`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

This workspace also includes a local Node.js runtime in `.tools/node`. If system `node` is not installed, use:

```bash
./scripts/run-frontend.sh
```

Run the backend with:

```bash
./scripts/run-backend.sh
```

## GitHub And Railway Helpers

This workspace includes local CLI installs for GitHub and Railway. Use these helpers if your shell does not know `gh`, `railway`, or `node`:

```bash
./scripts/github-login.sh
./scripts/github-push.sh
./scripts/railway-login.sh
./scripts/railway-deploy.sh
```

## Roles

- Admins can create, edit, and delete projects; manage members; create and assign tasks; update any task.
- Members can view assigned projects, view assigned tasks, and update their assigned task status.

## Railway Deployment

### Backend Service

Set root directory to `backend` and add environment variables:

```env
SECRET_KEY=your-production-secret
DEBUG=False
ALLOWED_HOSTS=your-backend.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend.railway.app
DATABASE_URL=${{Postgres.DATABASE_URL}}
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

Railway will run migrations and collect static files using `backend/railway.json`.

### Frontend Service

Set root directory to `frontend` and add:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

Run `npm run build` during deployment and serve with Vite preview through the included Railway config.

## Useful Commands

```bash
python manage.py createsuperuser
python manage.py seed_demo
python manage.py test
```

## Project Structure

```text
backend/
  apps/
    authentication/
    projects/
    tasks/
    dashboard/
    common/
  config/
frontend/
  src/
    api/
    components/
    context/
    layouts/
    pages/
docs/
```
