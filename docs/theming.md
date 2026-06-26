# Theming

TYUI components should expose styling through stable Web Component APIs:

- CSS custom properties for tokens and values.
- CSS parts for structural styling hooks.
- Shadow DOM internals only when they are intentionally public through `part`.

Component styles should work without global CSS. Global design tokens can be layered on top by setting custom properties on `:root`, a theme container, or individual elements.

## Current Button Hooks

`tyui-button` exposes:

- `::part(button)`
- `--tyui-button-background`
- `--tyui-button-border`
- `--tyui-button-radius`
- `--tyui-button-color`
- `--tyui-button-gap`
- `--tyui-button-min-height`
- `--tyui-button-padding`
- `--tyui-button-pressed-background`
- `--tyui-button-pressed-color`
