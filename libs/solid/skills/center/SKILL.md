---
name: center
description: Solid-facing alias for tyui-center guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#center']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/center/SKILL.md
---

# TYUI Solid center

## Intent

Use `@toyu-ui/solid#center` to load Solid setup plus the authoritative `@toyu-ui/elements#center` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiCenter } from '@toyu-ui/solid/define/center';

defineTyuiCenter();

<tyui-center measure="60ch" gutter="page" />;
```

## Selection Guidance

- Use raw `tyui-center` in TSX for readable centered regions.
- Register it through `@toyu-ui/solid/define/center`.

## Anti-Patterns

- Do not use Center as a card or surface.
