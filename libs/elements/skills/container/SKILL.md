---
name: container
description: Use tyui-container to constrain page or section width with named rails and tokenized gutters.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/container/tyui-container.ts
  manifest: ../../custom-elements.json
---

# tyui-container

## Intent

Use `tyui-container` to create a page or section rail that controls maximum inline size and horizontal gutter.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-container size="wide" gutter="page">
  <tyui-grid min-item-size="18rem" gap="4"></tyui-grid>
</tyui-container>
```

## Selection Guidance

- Use Container for page shells, section rails, dashboard content bounds, and full-width page regions.
- Use Center for readable single-column content.
- Use Frame for aspect-ratio media.
- Use `bleed` only when content intentionally reaches the container edge.

## Anti-Patterns

- Do not use Container to set a button or input width.
- Do not use card padding as page gutters.
- Do not nest containers without a named rail change.
