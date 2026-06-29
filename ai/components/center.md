# Center - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-center`
- Define: `@tyui/define/center`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-center`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: readable measure container

## Intent

Use Center to constrain readable content to a maximum inline measure and center it inside the available space. It is for prose, forms, narrow settings pages, and focused empty states.

Do not use Center for full app shells, card grids, or controls that should size to content. Prefer `tyui-container` for page gutters and wider regions, `tyui-grid` for repeated cards, and natural block flow for unconstrained content.

## Selection Guidance

- Use when: content should be readable and centered with a maximum measure.
- Do not use when: content should fill a dashboard region, wrap as a row, or form repeated columns.
- Prefer instead: `tyui-container` for page width, `tyui-grid` for columns, `tyui-flex` for one-axis arrangement.
- Product-level variant preferences: generated design layers may set default measure and gutter.
- Agent rule: choose Center when the layout question is "how wide should this single column be for reading?"

## Composition Contract

- Allowed children: headings, prose, forms, empty states, simple vertical sections, and component groups.
- Required parent: none.
- Required child components: none.
- Optional child components: `tyui-flex`, `tyui-cluster`, form controls.
- Disallowed nested interactive content: none beyond child rules.
- Composition anti-patterns: wrapping every component in Center, nesting Center inside Center without a specific measure change.

## API

### Attributes

| Name        | Type                              | Reflects | Default | Notes                                                          |
| ----------- | --------------------------------- | -------- | ------- | -------------------------------------------------------------- |
| `measure`   | CSS length token or length string | yes      | `65ch`  | Maximum inline size.                                           |
| `gutter`    | `0 \| 1 \| 2 \| 3 \| 4 \| page`   | yes      | `page`  | Inline padding token.                                          |
| `intrinsic` | `boolean`                         | yes      | `false` | Centers children using flex when content itself should center. |

### Properties

Mirror attributes with typed properties.

### Events

None.

### Event Semantics

Child events pass through light DOM.

### Slots

| Name    | Description      | Fallback | Slotted Styling Rules              |
| ------- | ---------------- | -------- | ---------------------------------- |
| default | centered content | none     | children keep normal document flow |

### CSS Parts

None.

### CSS Custom Properties

`--ty-center-measure`, `--ty-center-gutter`, `--ty-layout-content-measure`, `--ty-page-gutter`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-center` and `.ty-center`:

| Attribute   | CSS Variable          | Mapping                                                                          |
| ----------- | --------------------- | -------------------------------------------------------------------------------- |
| `measure`   | `--ty-center-measure` | valid CSS length string; absent uses `65ch`                                      |
| `gutter`    | `--ty-center-gutter`  | `page` -> `var(--ty-page-gutter, 1rem)`; `0..4` -> `var(--ty-space-*, fallback)` |
| `intrinsic` | `--ty-center-display` | handled by selector; present uses flex centering                                 |

## Behavior

### State Model

- Controlled state: measure, gutter, intrinsic.
- Uncontrolled/default state: readable measure and page gutter tokens.
- Parent-owned state: available width and surrounding layout.
- Child-owned state: document semantics and focus.
- Programmatic update behavior: CSS updates only.

### Focus Model

Center is not focusable. Children keep native tab order.

### Keyboard Contract

No keyboard behavior.

## Layout Contract

- Display: block by default.
- Intrinsic size: constrained by max inline size and gutter.
- Shrink policy: content may shrink to available width.
- Wrap policy: text wraps naturally.
- Flexible slots: default content.
- Fixed slots: none.
- Parent owns: vertical placement and page region.
- Component owns: horizontal centering, readable measure, inline gutter.
- Container-query thresholds: none.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll.

## Styling Contract

### Public Tokens

Use `--ty-center-*`, `--ty-layout-content-measure`, and `--ty-page-gutter`.

### Private Implementation Variables

Private variables use `--_ty-*`.

### Styling State Surface

Attributes and tokens only.

- Forced-colors behavior: none beyond children.
- Reduced-motion behavior: no motion.
- App-variant hooks: host attributes, utility class, public tokens.

## Accessibility

- Role: none by default.
- Accessible name: none.
- ARIA attributes: only add landmark or region semantics when content needs them.
- Reading order: unchanged.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Center adds no interaction.
- Define idempotently through `defineTyuiCenter`.
- Export `@tyui/elements/center` and `@tyui/define/center`.
- Provide `.ty-center` utility CSS.
- Do not use JavaScript measurement.

## Examples

### Storybook Examples

```html story title="Readable Form"
<tyui-center measure="48rem">
  <tyui-flex direction="column" gap="3">
    <h2>Profile</h2>
    <tyui-input label="Name" value="Ada Lovelace"></tyui-input>
    <tyui-input label="Email" value="ada@example.com"></tyui-input>
    <tyui-cluster>
      <tyui-button appearance="primary">Save</tyui-button>
      <tyui-button>Cancel</tyui-button>
    </tyui-cluster>
  </tyui-flex>
</tyui-center>
```

```html story title="Narrow Empty State"
<tyui-center measure="38rem" intrinsic>
  <tyui-flex direction="column" gap="2" align="center">
    <h2>No results</h2>
    <p>Try a different search term.</p>
    <tyui-button>Clear search</tyui-button>
  </tyui-flex>
</tyui-center>
```

### Invalid Examples

```html
<!-- Do not use Center for repeated card grids. -->
<tyui-center>
  <article>Card A</article>
  <article>Card B</article>
</tyui-center>
```

## Tests

| Requirement            | Setup                                                                              | Action              | Expected Result                      |
| ---------------------- | ---------------------------------------------------------------------------------- | ------------------- | ------------------------------------ |
| Measure maps           | Render with `measure="40rem"`                                                      | Read computed style | Max inline size uses 40rem.          |
| Gutters apply          | Render in narrow container                                                         | Measure padding     | Inline padding follows gutter token. |
| No focus stop          | Render input inside Center                                                         | Press Tab           | Focus enters input.                  |
| No shadow DOM          | Render Center                                                                      | Inspect host        | Children remain light DOM.           |
| Element/utility parity | Compare `.ty-center` with matching CSS variables and `tyui-center` with attributes | Read core styles    | Core centering rules match.          |

## Agent Guidance

- Use Center for one readable column.
- Use Container for broader page regions.
- Pair Center with Flex for vertical spacing rather than inventing local margins.
- Do not use Center to align individual controls inside a toolbar.
