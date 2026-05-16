#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$ROOT/.tools/gh/bin:$PATH"
gh auth login --hostname github.com --web --git-protocol https
