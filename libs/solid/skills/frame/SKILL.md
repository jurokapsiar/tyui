---
name: frame
description: Solid-facing alias for tyui-frame guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#frame']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/frame/SKILL.md
---

# TYUI Solid frame

## Intent

Use `@toyu-ui/solid#frame` to load Solid setup plus the authoritative `@toyu-ui/elements#frame` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiFrame } from '@toyu-ui/solid/define/frame';

defineTyuiFrame();

<tyui-frame ratio="16/9" fit="cover" />;
```

## Selection Guidance

- Use raw `tyui-frame` in TSX for aspect-ratio media and previews.
- Register it through `@toyu-ui/solid/define/frame`.

## Anti-Patterns

- Do not put complex forms inside Frame.
