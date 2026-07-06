#!/usr/bin/env bash
# Codex Cloud maintenance: quick coordination checks on cached-container resume.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Codex Cloud coordination maintenance"

test -f docs/EFFORT-LOG.md && echo "Effort-log mirror: OK" || echo "Effort-log mirror: MISSING"
test -f scripts/slack-sync.sh && chmod +x scripts/slack-sync.sh && echo "Slack helper: OK" || echo "Slack helper: MISSING"

if [ -n "${SLACK_BOT_TOKEN:-}" ] && [ -f scripts/slack-sync.sh ]; then
  bash scripts/slack-sync.sh test >/dev/null 2>&1 && echo "Slack bot token: OK" || echo "Slack bot token: check failed"
else
  echo "Slack bot token: not set"
fi

echo "==> Maintenance complete"
