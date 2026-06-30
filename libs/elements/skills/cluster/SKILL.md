---
name: cluster
description: Use tyui-cluster for compact wrapping rows of intrinsic items such as actions, tags, chips, and toolbar-like groups.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/cluster/tyui-cluster.ts
  manifest: ../../custom-elements.json
---

# tyui-cluster

## Intent

Use `tyui-cluster` for compact groups of peer items that keep their intrinsic size and wrap to new lines when space runs out.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-cluster gap="2">
  <tyui-button appearance="primary">Save</tyui-button>
  <tyui-button>Cancel</tyui-button>
  <tyui-button appearance="subtle">Reset</tyui-button>
</tyui-cluster>
```

## Selection Guidance

- Use Cluster for action rows, tags, chips, checkbox rows, radio rows, and short metadata groups.
- Use Flex when one-axis distribution, direction, or optional wrapping matters more than wrap-first behavior.
- Use Grid when children should form equal responsive tracks.
- Preserve list markup when the items are a semantic list.

## Anti-Patterns

- Do not use Cluster for table rows or data grids.
- Do not remove list semantics just to get a wrapping row.
- Do not make Cluster responsible for toolbar keyboard behavior.
