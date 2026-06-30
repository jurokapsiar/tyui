---
name: input
description: Use and integrate the tyui-input custom element for accessible single-line text entry without confusing base component features with design-system variants.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/input/tyui-input.ts
  manifest: ../../custom-elements.json
---

# tyui-input

## Intent

Use `tyui-input` for short single-line text entry such as names, email addresses,
search terms, telephone numbers, URLs, passwords, and numeric text.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Registration

```ts
import { defineTyuiInput } from '@toyu-ui/define/input';

defineTyuiInput();
```

## Correct Usage

```html
<label for="email">Email</label>
<tyui-input id="email" name="email" type="email" required></tyui-input>
```

## Design-System Variants

The base component owns neutral appearances only. Product or design-system
layers may add visual variants through public tokens, host classes, and
documented parts. For example, Fluent's focused underline is a Fluent design
layer feature, not a base `appearance` value.

## Selection Guidance

- Use Input for short single-line text entry.
- Use a textarea component, when available, for multiline text.
- Use Select, Combobox, RadioGroup, or Checkbox when the user chooses from known options.
- Use Field or a visible native label to provide the accessible label.
- Keep design-system-specific visuals in the design layer rather than adding base appearances.

## Anti-Patterns

- Do not rely on placeholder as the only label.
- Do not put buttons, links, or other focusable controls in content slots.
- Do not invent unsupported input appearances; use design-layer classes for
  product-specific visuals.
