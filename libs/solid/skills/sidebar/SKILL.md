---
name: sidebar
description: Solid-facing alias for tyui-sidebar guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#sidebar']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/sidebar/SKILL.md
---

# TYUI Solid sidebar

## Intent

Use `@toyu-ui/solid#sidebar` to load Solid setup plus the authoritative `@toyu-ui/elements#sidebar` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiSidebar } from '@toyu-ui/solid/define/sidebar';

defineTyuiSidebar();

<tyui-sidebar side-size="16rem" content-min="55%" />;
```

## Selection Guidance

- Use raw `tyui-sidebar` in TSX for two-region fixed-plus-fluid layout.
- Register it through `@toyu-ui/solid/define/sidebar`.

## Anti-Patterns

- Do not use Sidebar for overlay drawer behavior.
