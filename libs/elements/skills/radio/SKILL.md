---
name: radio
description: Use tyui-radio only as a radio option coordinated by tyui-radio-group, with native input focus and group-owned selection.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/radio/tyui-radio.ts
  manifest: ../../custom-elements.json
---

# tyui-radio

## Intent

Use `tyui-radio` to represent one option inside `tyui-radio-group`.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-radio-group label="Plan" name="plan" value="team">
  <tyui-radio value="personal">Personal</tyui-radio>
  <tyui-radio value="team">Team</tyui-radio>
</tyui-radio-group>
```

## Focus And Keyboard

`tyui-radio-group` owns value and roving tabindex. The active radio mirrors its
tab stop to the native shadow input so real browser `Tab` enters the group and
arrow keys move focus and selection.

## Selection Guidance

- Use Radio only as an option inside RadioGroup.
- Use RadioGroup for the field label, name, value ownership, and keyboard coordination.
- Use Checkbox for unrelated independent boolean choices.
- Use Select or Combobox for larger option sets.

## Anti-Patterns

- Do not use standalone radio buttons for unrelated boolean choices.
- Do not manage checked state independently when inside a group.
- Do not replace native radio keyboard behavior with app-level key handlers.
