---
name: grid
description: Use tyui-grid for responsive peer-card and panel collections that auto-fit columns from container width.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/grid/tyui-grid.ts
  manifest: ../../custom-elements.json
---

# tyui-grid

## Intent

Use `tyui-grid` for repeated peer items that should form responsive columns from the container width and a minimum item size.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-grid min-item-size="14rem" gap="4">
  <section>Alpha</section>
  <section>Beta</section>
  <section>Gamma</section>
</tyui-grid>
```

## Selection Guidance

- Use Grid for cards, tiles, metric panels, image groups, and settings panels.
- Use Cluster for compact wrapping action rows and tags.
- Use Flex for one-axis composition.
- Use table or data-grid components for tabular data with row and column relationships.

## Anti-Patterns

- Do not use Grid for data tables or keyboard-navigable ARIA grids.
- Do not use dense visual reordering when DOM order must match reading order.
- Do not calculate columns in JavaScript.
