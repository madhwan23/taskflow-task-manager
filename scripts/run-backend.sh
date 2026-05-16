#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../backend"
source ../.venv/bin/activate
python manage.py runserver 127.0.0.1:8000
