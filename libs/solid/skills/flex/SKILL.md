---
name: flex
description: Solid-facing alias for tyui-flex guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#flex']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/flex/SKILL.md
---

# TYUI Solid flex

## Intent

Use `@toyu-ui/solid#flex` to load Solid setup plus the authoritative `@toyu-ui/elements#flex` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiFlex } from '@toyu-ui/solid/define/flex';

defineTyuiFlex();

<tyui-flex direction="column" gap="3" />;
```

## Selection Guidance

- Use raw `tyui-flex` in TSX for one-axis composition.
- Register it through `@toyu-ui/solid/define/flex`.

## Anti-Patterns

- Do not import registration helpers from `@toyu-ui/define` in normal Solid app code.
