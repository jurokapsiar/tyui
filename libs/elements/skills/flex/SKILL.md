---
name: flex
description: Use tyui-flex for one-axis sibling composition with tokenized direction, alignment, wrapping, and gap.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/flex/tyui-flex.ts
  manifest: ../../custom-elements.json
---

# tyui-flex

## Intent

Use `tyui-flex` when sibling content follows one axis and the parent owns direction, wrapping, alignment, justification, and gap.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-flex direction="column" gap="3">
  <h2>Settings</h2>
  <tyui-input label="Name"></tyui-input>
  <tyui-button appearance="primary">Save</tyui-button>
</tyui-flex>
```

## Selection Guidance

- Use Flex for row or column composition of siblings.
- Use Flex when the design may switch direction or wrapping through attributes.
- Use Cluster for wrap-first action rows, chips, and tags.
- Use Grid for repeated peer cards or panels.
- Use native block flow for simple prose.

## Anti-Patterns

- Do not use Flex to create data tables or two-dimensional card grids.
- Do not force every child to `flex: 1` unless equal distribution is the container intent.
- Do not use visual reverse direction to fix incorrect DOM reading order.
