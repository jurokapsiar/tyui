---
name: container
description: Solid-facing alias for tyui-container guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#container']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/container/SKILL.md
---

# TYUI Solid container

## Intent

Use `@toyu-ui/solid#container` to load Solid setup plus the authoritative `@toyu-ui/elements#container` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiContainer } from '@toyu-ui/solid/define/container';

defineTyuiContainer();

<tyui-container size="wide" gutter="page" />;
```

## Selection Guidance

- Use raw `tyui-container` in TSX for page or section rails.
- Register it through `@toyu-ui/solid/define/container`.

## Anti-Patterns

- Do not use Container to set individual control widths.
