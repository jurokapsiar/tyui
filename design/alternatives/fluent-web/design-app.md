# Fluent Web Component Application

## Source Inputs

- `design/alternatives/fluent-web/DESIGN.md`
- Fluent UI React Storybook at `https://storybooks.fluentui.dev/react/`
- `ai/components/button.md`
- `ai/components/input.md`
- `spec/styling.md`
- `spec/layout.md`
- `spec/agentic-ui-design.md`

## Generated Outputs

- `theme.css`: semantic and primitive `--ty-*` token assignments for the Fluent Web design root.
- `component-variants.css`: component-level mappings for Button/Input and app-owned composition helpers.
- `tokens.resolved.json`: resolved design-token values and CSS variable mapping.
- `patterns.md`: application composition guidance.
- `context.json`: machine-readable design context.
- `llms.txt`: discovery index for coding agents.

## Activation

```ts
import '@tyui/design-fluent-web/theme.css';
import '@tyui/design-fluent-web/component-variants.css';
```

```html
<body data-design-system="fluent-web" data-color-scheme="light"></body>
```

`data-color-scheme="dark"` is supported by the generated token layer for preview and app shells.

## Intent To Component Map

| Intent                      | Preferred Component / Pattern | Variant                                     | Notes                                                              |
| --------------------------- | ----------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| Primary command             | `tyui-button`                 | `appearance="primary" shape="rounded"`      | Use once per local task.                                           |
| Standard command            | `tyui-button`                 | default appearance                          | Neutral filled surface with border.                                |
| Toolbar command             | `tyui-button`                 | `appearance="subtle"` or `transparent`      | Use in dense command rows.                                         |
| Destructive warning context | app text + `tyui-button`      | primary only when confirming                | Use danger text at app level; no danger button variant exists yet. |
| Standard text entry         | `tyui-input`                  | `appearance="outline"`                      | Default forms and dialogs.                                         |
| Dense editable setting      | `tyui-input`                  | `class="ty-fluent-input-underline"`         | Fluent-owned compact underline variant for settings/table editing. |
| Search in app chrome        | `tyui-input`                  | `appearance="filled-lighter" type="search"` | Pair with `contentBefore` search icon.                             |
| Panel/card surface          | `.ty-fluent-panel`            | optional `data-elevation="raised"`          | App-owned surface until a card component exists.                   |
| Command row                 | `.ty-fluent-toolbar`          | N/A                                         | Uses flex, wrapping, and 8px gaps.                                 |
| Form layout                 | `.ty-fluent-form-grid`        | N/A                                         | Uses grid for repeated field groups.                               |

## App Variants

### Fluent Primary Button

Implemented with:

- `appearance="primary"`
- `--ty-button-background`
- `--ty-button-background-hover`
- `--ty-button-background-active`
- `--ty-button-foreground`
- `--ty-button-border-color`

No parts or private selectors are used.

### Fluent Secondary Button

Implemented with the default or `secondary` appearance:

- white/neutral surface
- neutral stroke
- neutral foreground
- subtle hover and pressed fills

No parts or private selectors are used.

### Fluent Toolbar Button

Implemented with `appearance="subtle"` or `appearance="transparent"` for dense command rows. Use icon-only buttons only with an accessible name.

### Fluent Input

Implemented with public `--ty-input-*` tokens and the documented `control` part. The design uses no private selectors. All Fluent input variants render a brand underline on focus; the underline expands from center over the feedback duration. The `.ty-fluent-input-underline` class is only the resting compact underline variant.

## Composition Patterns

### Settings Panel

```html
<section class="ty-fluent-panel">
  <header class="ty-fluent-toolbar">
    <h2 class="ty-fluent-title">Notification settings</h2>
    <tyui-button appearance="primary">Save</tyui-button>
  </header>
  <div class="ty-fluent-form-grid">
    <tyui-input placeholder="Display name"></tyui-input>
    <tyui-input type="email" placeholder="Email"></tyui-input>
  </div>
</section>
```

### Command Bar

Use a flex toolbar with one primary command and neutral/subtle commands. Keep command text short; move lower-priority actions into menus when a menu component exists.

### Search And Action

Use `tyui-input type="search" appearance="filled-lighter"` with a leading icon and a primary button. Do not put a clickable button inside Input slots.

## Accessibility Policy

- Preserve visible focus indicators.
- Inputs need labels or accessible names; placeholders are not labels.
- Icon-only buttons require an accessible name.
- Disabled controls use disabled foreground/stroke tokens rather than opacity alone.
- Invalid inputs use red border/indicator plus app-owned helper text.
- Forced-colors mode maps all surfaces and focus indicators to system colors.
- Reduced motion removes control feedback transitions.

## Generated Styling Boundaries

This design bundle uses only:

- `[data-design-system='fluent-web']`
- `[data-color-scheme]`
- public `--ty-*` tokens
- component host attributes
- documented component parts through `::part()`
- app-owned classes prefixed with `ty-fluent-`

It does not target private shadow DOM classes, private `--_ty-*` variables, or undocumented parts.

## Library Gaps

- A `tyui-card` or `tyui-surface` component would formalize Fluent panel/card surfaces.
- A `tyui-field` component would provide labels, validation messages, and descriptions around inputs.
- A menu/split-button component is needed to fully cover Fluent Button Storybook patterns.
- A progress/loading affordance is needed before Fluent loading button stories can be represented directly.
