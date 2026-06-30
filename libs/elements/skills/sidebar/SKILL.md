---
name: sidebar
description: Use tyui-sidebar for two-region fixed-plus-fluid layouts such as filters beside results or navigation beside content.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/sidebar/tyui-sidebar.ts
  manifest: ../../custom-elements.json
---

# tyui-sidebar

## Intent

Use `tyui-sidebar` for a two-region layout where one child has a preferred fixed size and the other child takes remaining space.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-sidebar side-size="16rem" content-min="55%" gap="4">
  <aside>Filters</aside>
  <main>Results</main>
</tyui-sidebar>
```

## Selection Guidance

- Use Sidebar for filters beside results, navigation beside content, metadata beside detail, or media beside body.
- Use Grid when regions are peer cards or equal columns.
- Use Container for page rails.
- Use dialog or drawer components for overlay side panels.

## Anti-Patterns

- Do not add more than two direct children.
- Do not use Sidebar for overlay drawer behavior.
- Do not use `side="end"` to fix an incorrect DOM reading order.
