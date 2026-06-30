---
name: setup
description: Set up TYUI custom elements for Solid, including registration, JSX typing, wrappers, and typed custom events.
license: Apache-2.0
requires: ['@toyu-ui/elements#components']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: src/index.ts
---

# TYUI Solid setup

## Intent

Use `@toyu-ui/solid` when a Solid app wants typed JSX ergonomics for TYUI custom
elements. The implementation remains in `@toyu-ui/elements`.

## Registration

Register only the elements you use:

```ts
import { defineTyuiButton } from '@toyu-ui/solid/define/button';

defineTyuiButton();
```

Use `defineTyuiElements()` only for demos or apps where eager registration of
all elements is acceptable.

## JSX Usage

```tsx
<tyui-button appearance="primary" on:click={save}>
  Save
</tyui-button>
```

Thin wrappers may improve prop names or event typing, but they must not fork
behavior from the underlying custom element.

## Anti-Patterns

- Do not reimplement TYUI behavior in Solid wrappers.
- Do not use Solid signals inside `@toyu-ui/elements`.
- Do not register all elements in a library module that should tree-shake.
