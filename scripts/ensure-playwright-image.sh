#!/usr/bin/env bash
set -euo pipefail

IMAGE="${TYUI_PLAYWRIGHT_IMAGE:-tyui-playwright:local}"

if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  scripts/build-playwright-image.sh
fi
