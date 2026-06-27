---
name: setup
description: Set up TYUI custom elements for Solid, including registration, JSX typing, wrappers, and typed custom events.
license: Apache-2.0
requires: ['@tyui/elements#button', '@tyui/elements#input']
metadata:
  type: framework
  library: '@tyui/solid'
  library_version: '0.0.0'
  framework: solid
  source: src/index.ts
---

# TYUI Solid setup

## Intent

Use `@tyui/solid` when a Solid app wants typed JSX ergonomics for TYUI custom
elements. The implementation remains in `@tyui/elements`.

## Registration

Register only the elements you use:

```ts
import { defineTyuiButton } from '@tyui/define/button';

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
- Do not use Solid signals inside `@tyui/elements`.
- Do not register all elements in a library module that should tree-shake.
