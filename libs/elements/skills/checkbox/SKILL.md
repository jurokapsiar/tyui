---
name: checkbox
description: Use and integrate the tyui-checkbox custom element for independent boolean choices and avoid radio or command-button misuse.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/checkbox/tyui-checkbox.ts
  manifest: ../../custom-elements.json
---

# tyui-checkbox

## Intent

Use `tyui-checkbox` for an independent yes/no or on/off choice.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-checkbox name="notifications" value="enabled">Email notifications</tyui-checkbox>
```

## Selection Guidance

- Use checkbox for independent choices.
- Use radio group when exactly one option must be chosen from a set.
- Use a switch component, when available, for immediate setting toggles.

## Anti-Patterns

- Do not use checkbox as a command button.
- Do not use checkbox for mutually exclusive options.
- Do not hide the label without providing an accessible name.
