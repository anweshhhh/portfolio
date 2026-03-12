#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$ROOT/docs/architecture/mermaid.config.json"
PUPPETEER_CONFIG="$ROOT/docs/architecture/puppeteer-config.json"

for slug in tracecase securityq webhook ratelimiter clob; do
  npx -y @mermaid-js/mermaid-cli \
    --configFile "$CONFIG" \
    --puppeteerConfigFile "$PUPPETEER_CONFIG" \
    --backgroundColor transparent \
    --scale 2 \
    -i "$ROOT/docs/architecture/${slug}.mmd" \
    -o "$ROOT/assets/projects/${slug}/architecture.svg"
done
