---
name: radio
description: Solid-facing alias for tyui-radio guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#radio']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/radio/SKILL.md
---

# TYUI Solid radio

## Intent

Use `@toyu-ui/solid#radio` to load Solid setup plus the authoritative `@toyu-ui/elements#radio` guidance.

## Correct Usage

```tsx
import { Radio, RadioGroup } from '@toyu-ui/solid';

<RadioGroup label="Plan" name="plan">
  <Radio value="team">Team</Radio>
</RadioGroup>;
```

## Selection Guidance

- Use Radio only inside RadioGroup.
- Use Checkbox for independent boolean choices.

## Anti-Patterns

- Do not manage Radio checked state outside the group.
