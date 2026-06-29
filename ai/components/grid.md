# Grid - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-grid`
- Define: `@tyui/define/grid`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-grid`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: responsive two-dimensional collection layout

## Intent

Use Grid for repeated peer items that should form responsive columns from the container width and an item minimum size: cards, tiles, metric panels, image groups, and settings panels.

Do not use Grid for tabular data, one-axis action rows, or arbitrary page shells. Prefer native table/data-grid components for data, `tyui-cluster` for wrapping action rows, and `tyui-sidebar` for two-region layouts.

## Selection Guidance

- Use when: each item is a peer, columns should auto-fit, and the parent owns gaps and minimum item width.
- Do not use when: rows and columns carry data relationships, cells need headers, or keyboard grid navigation is required.
- Prefer instead: `tyui-table` or future `tyui-data-grid` for data, `tyui-flex` for one axis, `tyui-container` for page width.
- Product-level variant preferences: generated design layers may set `min-item-size` by content type.
- Agent rule: choose Grid when the layout question is "how many columns fit here?"

## Composition Contract

- Allowed children: cards, panels, images, form sections, and other block-level peer items.
- Required parent: none.
- Required child components: none.
- Optional child components: `tyui-card`, `tyui-image`, form sections.
- Disallowed nested interactive content: none beyond child rules.
- Composition anti-patterns: using Grid for data tables, creating fake rows with visual order, hiding overflow instead of allowing wrapping.

## API

### Attributes

| Name            | Type                                | Reflects | Default   | Notes                                                                           |
| --------------- | ----------------------------------- | -------- | --------- | ------------------------------------------------------------------------------- |
| `min-item-size` | CSS length token or length string   | yes      | `16rem`   | Minimum track size before wrapping.                                             |
| `gap`           | `0 \| 1 \| 2 \| 3 \| 4`             | yes      | `4`       | Row and column gap.                                                             |
| `row-gap`       | `0 \| 1 \| 2 \| 3 \| 4`             | yes      | `gap`     | Optional row gap override.                                                      |
| `align`         | `stretch \| start \| center \| end` | yes      | `stretch` | Maps to `align-items`.                                                          |
| `justify`       | `stretch \| start \| center \| end` | yes      | `stretch` | Maps to `justify-items`.                                                        |
| `dense`         | `boolean`                           | yes      | `false`   | Maps to `grid-auto-flow: dense`; use only when visual reordering is acceptable. |

### Properties

Mirror attributes with typed properties.

### Events

None. Grid is layout only.

### Event Semantics

Child events pass through light DOM. Grid must not implement keyboard grid behavior.

### Slots

| Name    | Description | Fallback | Slotted Styling Rules                             |
| ------- | ----------- | -------- | ------------------------------------------------- |
| default | grid items  | none     | children are grid items; parent owns track sizing |

### CSS Parts

None.

### CSS Custom Properties

`--ty-grid-min-item-size`, `--ty-grid-gap`, `--ty-grid-row-gap`, `--ty-grid-align`, `--ty-grid-justify`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-grid` and `.ty-grid`:

| Attribute       | CSS Variable              | Mapping                                                                  |
| --------------- | ------------------------- | ------------------------------------------------------------------------ |
| `min-item-size` | `--ty-grid-min-item-size` | valid CSS length string; absent uses `16rem`                             |
| `gap`           | `--ty-grid-gap`           | `0..4` -> `var(--ty-space-*, fallback)`; invalid values fall back to `4` |
| `row-gap`       | `--ty-grid-row-gap`       | `0..4` -> `var(--ty-space-*, fallback)`; absent uses `gap`               |
| `align`         | `--ty-grid-align`         | valid enum value                                                         |
| `justify`       | `--ty-grid-justify`       | valid enum value                                                         |
| `dense`         | `--ty-grid-auto-flow`     | absent -> `row`; present -> `row dense`                                  |

## Behavior

### State Model

- Controlled state: min-item-size, gap, row-gap, align, justify, dense.
- Uncontrolled/default state: auto-fit columns with `16rem` minimum.
- Parent-owned state: available inline size.
- Child-owned state: intrinsic block size and semantics.
- Programmatic update behavior: update CSS values without reparenting children.

### Focus Model

Grid itself is not focusable. Tab order follows DOM order, not visual column position. Interactive grid keyboard behavior belongs to data-grid/table components, not this primitive.

### Keyboard Contract

No keyboard behavior. Arrow keys remain owned by child controls or composite components inside grid items.

## Layout Contract

- Display: grid.
- Intrinsic size: block size from items; inline size from parent.
- Track policy: `repeat(auto-fit, minmax(min(100%, var(--ty-grid-min-item-size)), 1fr))`.
- Shrink policy: tracks shrink to container width before wrapping; children should set `min-inline-size: 0` when their content may shrink.
- Wrap policy: automatic track wrapping.
- Flexible slots: all default children as grid items.
- Fixed slots: none.
- Parent owns: available width and placement.
- Component owns: track creation, gap, item alignment.
- Container-query thresholds: none; CSS grid auto-fit handles the response.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll; parent owns horizontal scroll if content cannot shrink.

## Styling Contract

### Public Tokens

Use `--ty-grid-*` tokens. Design layers may set different minimum item sizes for dashboards, forms, and galleries.

### Private Implementation Variables

Private variables use `--_ty-*`.

### Styling State Surface

Attributes and public tokens only.

- Forced-colors behavior: none beyond children.
- Reduced-motion behavior: no motion.
- App-variant hooks: host attributes, utility class, public tokens.

## Accessibility

- Role: none by default.
- Accessible name: none.
- ARIA attributes: do not add `role="grid"` to this primitive.
- Reading order: DOM order is the accessible order. Avoid `dense` when visual order must match reading order.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Grid adds no interaction and does not implement ARIA grid behavior.
- Define idempotently through `defineTyuiGrid`.
- Export `@tyui/elements/grid` and `@tyui/define/grid`.
- Provide `.ty-grid` utility CSS.
- Use CSS Grid auto-fit; do not calculate columns in JavaScript.
- Do not add ARIA grid semantics.

## Examples

### Storybook Examples

```html story title="Auto Fit Cards"
<tyui-grid min-item-size="14rem" gap="4">
  <section style="padding:16px;border:1px solid CanvasText;">Alpha</section>
  <section style="padding:16px;border:1px solid CanvasText;">Beta</section>
  <section style="padding:16px;border:1px solid CanvasText;">Gamma</section>
  <section style="padding:16px;border:1px solid CanvasText;">Delta</section>
</tyui-grid>
```

```html story title="Settings Panels"
<tyui-grid min-item-size="18rem" gap="3">
  <tyui-flex direction="column" gap="2">
    <strong>Account</strong>
    <tyui-input label="Display name" value="Ada"></tyui-input>
  </tyui-flex>
  <tyui-flex direction="column" gap="2">
    <strong>Notifications</strong>
    <tyui-checkbox checked>Email updates</tyui-checkbox>
  </tyui-flex>
</tyui-grid>
```

```html story title="Centered Items"
<tyui-grid min-item-size="10rem" align="start" justify="center" gap="2">
  <tyui-button>One</tyui-button>
  <tyui-button>Two</tyui-button>
  <tyui-button>Three</tyui-button>
</tyui-grid>
```

### Invalid Examples

```html
<!-- Do not use layout Grid for tabular data. -->
<tyui-grid>
  <div>Name</div>
  <div>Status</div>
  <div>Ada</div>
  <div>Active</div>
</tyui-grid>
```

## Tests

| Requirement            | Setup                                                                          | Action                         | Expected Result                        |
| ---------------------- | ------------------------------------------------------------------------------ | ------------------------------ | -------------------------------------- |
| Auto-fit works         | Render four items                                                              | Resize container               | Column count changes without JS.       |
| Min item size maps     | Set `min-item-size="20rem"`                                                    | Read computed grid template    | Tracks respect 20rem minimum.          |
| No grid role           | Render Grid                                                                    | Inspect accessibility tree/DOM | Host has no ARIA grid role by default. |
| DOM order stays stable | Render interactive children                                                    | Press Tab                      | Focus follows DOM order.               |
| Element/utility parity | Compare `.ty-grid` with matching CSS variables and `tyui-grid` with attributes | Read core styles               | Core grid rules match.                 |

## Agent Guidance

- Use `tyui-grid` for peer cards and panels.
- Do not use it for data with headers or arrow-key cell navigation.
- Set `min-item-size` from content, not viewport width.
- Keep item semantics inside the child elements.
