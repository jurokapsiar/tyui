---
name: input
description: Solid-facing alias for tyui-input guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#input']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/input/SKILL.md
---

# TYUI Solid input

## Intent

Use `@toyu-ui/solid#input` to load Solid setup plus the authoritative `@toyu-ui/elements#input` guidance.

## Correct Usage

```tsx
import { Input } from '@toyu-ui/solid';

<Input name="email" type="email" required>
  Email
</Input>;
```

## Selection Guidance

- Use the `Input` wrapper for single-line text entry in Solid.
- Use `event.detail.value` from typed `onInput` handlers.

## Anti-Patterns

- Do not rely on placeholder text as the only label.
