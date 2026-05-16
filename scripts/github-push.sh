#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/gh/bin:$PATH"
cd "$ROOT"
git push -u origin main
