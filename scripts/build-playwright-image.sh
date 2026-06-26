#!/usr/bin/env bash
set -euo pipefail

IMAGE="${TYUI_PLAYWRIGHT_IMAGE:-tyui-playwright:local}"

docker build \
  -f pipelines/playwright.Dockerfile \
  -t "$IMAGE" \
  .
