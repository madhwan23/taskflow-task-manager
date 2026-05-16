#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/node/bin:$PATH"

cd "$ROOT"

SECRET_KEY="${SECRET_KEY:-$(python3 - <<'PY'
import secrets
print(secrets.token_urlsafe(48))
PY
)}"

railway init --name taskflow-task-manager --json >/tmp/taskflow-railway-project.json
railway add --database postgres --json >/tmp/taskflow-railway-postgres.json
railway add --service backend --json >/tmp/taskflow-railway-backend.json
railway add --service frontend --json >/tmp/taskflow-railway-frontend.json

railway variable --service backend --set "SECRET_KEY=$SECRET_KEY" --skip-deploys
railway variable --service backend --set "DEBUG=False" --skip-deploys
railway variable --service backend --set "ALLOWED_HOSTS=*" --skip-deploys
railway variable --service backend --set "CORS_ALLOWED_ORIGINS=*" --skip-deploys
railway variable --service backend --set 'DATABASE_URL=${{Postgres.DATABASE_URL}}' --skip-deploys
railway variable --service backend --set "EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend" --skip-deploys

railway up "$ROOT/backend" --path-as-root --service backend --detach
BACKEND_DOMAIN="$(railway domain --service backend --port 8000 | tail -n 1 | tr -d '[:space:]')"

railway variable --service frontend --set "VITE_API_URL=https://$BACKEND_DOMAIN/api" --skip-deploys
railway up "$ROOT/frontend" --path-as-root --service frontend --detach
FRONTEND_DOMAIN="$(railway domain --service frontend --port 4173 | tail -n 1 | tr -d '[:space:]')"

railway variable --service backend --set "CORS_ALLOWED_ORIGINS=https://$FRONTEND_DOMAIN" --skip-deploys
railway variable --service backend --set "ALLOWED_HOSTS=$BACKEND_DOMAIN" --skip-deploys
railway redeploy --service backend

echo "Backend:  https://$BACKEND_DOMAIN"
echo "Frontend: https://$FRONTEND_DOMAIN"
