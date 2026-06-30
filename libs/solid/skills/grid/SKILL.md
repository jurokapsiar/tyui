---
name: grid
description: Solid-facing alias for tyui-grid guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#grid']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/grid/SKILL.md
---

# TYUI Solid grid

## Intent

Use `@toyu-ui/solid#grid` to load Solid setup plus the authoritative `@toyu-ui/elements#grid` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiGrid } from '@toyu-ui/solid/define/grid';

defineTyuiGrid();

<tyui-grid min-item-size="16rem" gap="4" />;
```

## Selection Guidance

- Use raw `tyui-grid` in TSX for responsive peer cards and panels.
- Register it through `@toyu-ui/solid/define/grid`.

## Anti-Patterns

- Do not use Grid for tabular data.
