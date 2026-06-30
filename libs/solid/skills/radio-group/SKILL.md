---
name: radio-group
description: Solid-facing alias for tyui-radio-group guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#radio-group']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/radio-group/SKILL.md
---

# TYUI Solid radio group

## Intent

Use `@toyu-ui/solid#radio-group` to load Solid setup plus the authoritative `@toyu-ui/elements#radio-group` guidance.

## Correct Usage

```tsx
import { Radio, RadioGroup } from '@toyu-ui/solid';

<RadioGroup label="Frequency" name="frequency">
  <Radio value="daily">Daily</Radio>
  <Radio value="weekly">Weekly</Radio>
</RadioGroup>;
```

## Selection Guidance

- Use RadioGroup when the user chooses one option from a small set.
- Use `event.detail.value` from typed change handlers.

## Anti-Patterns

- Do not put non-radio controls in the default slot.
