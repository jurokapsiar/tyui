---
name: center
description: Use tyui-center to constrain readable content to a centered measure with tokenized gutters.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/center/tyui-center.ts
  manifest: ../../custom-elements.json
---

# tyui-center

## Intent

Use `tyui-center` to constrain readable content to a maximum inline measure and center it inside the available space.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-center measure="60ch" gutter="page">
  <tyui-flex direction="column" gap="3">
    <h1>Profile</h1>
    <tyui-input label="Display name"></tyui-input>
  </tyui-flex>
</tyui-center>
```

## Selection Guidance

- Use Center for prose, forms, narrow settings pages, and focused empty states.
- Use Container for page or section rails.
- Use Grid or Sidebar when the content has multiple peer regions.
- Use the `intrinsic` attribute when children should also center as a column.

## Anti-Patterns

- Do not wrap every individual control in Center.
- Do not use Center as a card or surface.
- Do not nest Center repeatedly without a specific measure change.
