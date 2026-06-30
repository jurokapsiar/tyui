---
name: radio-group
description: Use and integrate tyui-radio-group for mutually exclusive choices, including value ownership, keyboard behavior, and form participation.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/radio-group/tyui-radio-group.ts
  manifest: ../../custom-elements.json
---

# tyui-radio-group

## Intent

Use `tyui-radio-group` when the user must choose exactly one option from a small
set.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-radio-group label="Notification frequency" name="frequency" required>
  <tyui-radio value="daily">Daily</tyui-radio>
  <tyui-radio value="weekly">Weekly</tyui-radio>
  <tyui-radio value="never">Never</tyui-radio>
</tyui-radio-group>
```

## Keyboard Contract

- `Tab` enters the checked enabled radio, or the first enabled radio.
- Arrow keys move focus and selection, wrapping and skipping disabled radios.
- `Space` selects the focused radio.

## Selection Guidance

- Use RadioGroup when the user chooses exactly one option from a small set.
- Use Checkbox for independent boolean choices or multi-select checklists.
- Use Select or Combobox for long option lists, async options, or compact forms.
- Keep only `tyui-radio` choices in the default slot.

## Anti-Patterns

- Do not place non-radio interactive elements in the default slot.
- Do not use radio group for multi-select choices.
- Do not create custom roving tabindex outside the group.
