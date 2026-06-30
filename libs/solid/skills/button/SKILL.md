---
name: button
description: Solid-facing alias for tyui-button guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#button']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/button/SKILL.md
---

# TYUI Solid button

## Intent

Use `@toyu-ui/solid#button` to load Solid setup plus the authoritative `@toyu-ui/elements#button` guidance.

## Correct Usage

```tsx
import { Button } from '@toyu-ui/solid';

<Button appearance="primary">Save</Button>;
```

## Selection Guidance

- Use the `Button` wrapper for ordinary Solid app code.
- Use raw `tyui-button` only when direct custom-element access is needed.

## Anti-Patterns

- Do not duplicate button behavior in a Solid wrapper.
