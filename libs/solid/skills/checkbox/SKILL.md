---
name: checkbox
description: Solid-facing alias for tyui-checkbox guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#checkbox']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/checkbox/SKILL.md
---

# TYUI Solid checkbox

## Intent

Use `@toyu-ui/solid#checkbox` to load Solid setup plus the authoritative `@toyu-ui/elements#checkbox` guidance.

## Correct Usage

```tsx
import { Checkbox } from '@toyu-ui/solid';

<Checkbox name="updates" value="yes">
  Send updates
</Checkbox>;
```

## Selection Guidance

- Use Checkbox for independent boolean choices in Solid.
- Use RadioGroup and Radio for mutually exclusive choices.

## Anti-Patterns

- Do not use Checkbox as a command button.
