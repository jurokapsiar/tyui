# Flex - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-flex`
- Define: `@tyui/define/flex`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none. Children must stay in light DOM so layout applies directly to slotted content.
- Utility class: `.ty-flex`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: one-axis composition

## Intent

Use Flex for one-dimensional layout when children should arrange in a row or column and the parent owns direction, alignment, gap, wrapping, and distribution.

Do not use Flex as a replacement for component internals, data grids, page-width constraints, or two-dimensional card layouts. Prefer `tyui-grid` for responsive card grids, `tyui-cluster` for wrapping action/tag rows, `tyui-container` for page gutters, and `tyui-sidebar` for fixed-plus-fluid regions.

## Selection Guidance

- Use when: content follows one axis, direction may change by design layer, or a parent must align mixed children.
- Do not use when: each item needs responsive column tracks, intrinsic wrapping action-row behavior, or page-level max width.
- Prefer instead: `tyui-cluster` for wrap-first rows, `tyui-grid` for card collections, `tyui-center` for readable single-column content, native block flow for simple vertical document content.
- Product-level variant preferences: generated design layers may set default gap and alignment tokens, but must not force child components to grow unless the container intent requires equal distribution.
- Agent rule: choose Flex only when the layout question is "how do these siblings share one axis?"

## Composition Contract

- Allowed children: any flow content, including TYUI controls, text, cards, and layout primitives.
- Required parent: none.
- Required child components: none.
- Optional child components: any component whose parent may own placement.
- Disallowed nested interactive content: none beyond each child component's own rules.
- Composition anti-patterns: using Flex to create a table, using child inline styles for gaps that the parent should own, setting `flex: 1` on every child by default.
- Nesting: allowed, but nested Flex containers must keep their own layout tokens scoped.

## API

### Attributes

| Name        | Type                                                    | Reflects | Default   | Notes                                                         |
| ----------- | ------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------- |
| `direction` | `row \| row-reverse \| column \| column-reverse`        | yes      | `row`     | Maps to `flex-direction`.                                     |
| `wrap`      | `nowrap \| wrap \| wrap-reverse`                        | yes      | `nowrap`  | Maps to `flex-wrap`.                                          |
| `align`     | `stretch \| start \| center \| end \| baseline`         | yes      | `stretch` | Maps to `align-items`; logical aliases compile to CSS values. |
| `justify`   | `start \| center \| end \| between \| around \| evenly` | yes      | `start`   | Maps to `justify-content`; aliases compile to CSS values.     |
| `gap`       | `0 \| 1 \| 2 \| 3 \| 4`                                 | yes      | `3`       | Maps to spacing tokens.                                       |
| `inline`    | `boolean`                                               | yes      | `false`   | Uses `inline-flex` instead of `flex`.                         |

### Properties

Mirror attributes with typed properties. Boolean `inline` reflects to the host.

### Events

None. Flex is layout only and must not emit user events.

### Event Semantics

- User-initiated events: none.
- Programmatic state changes: changing attributes updates layout only.
- Native events: child events pass through light DOM without interception.
- Cancellation behavior: N/A.

### Slots

| Name    | Description       | Fallback | Slotted Styling Rules                                                                                                 |
| ------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| default | laid-out children | none     | children keep their own semantics; parent may assign flex item policy through public CSS variables or utility classes |

### CSS Parts

None. Flex has no shadow DOM.

### CSS Custom Properties

`--ty-flex-direction`, `--ty-flex-wrap`, `--ty-flex-align`, `--ty-flex-justify`, `--ty-flex-gap`, `--ty-layout-gap`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-flex` and `.ty-flex`:

| Attribute   | CSS Variable          | Mapping                                                                            |
| ----------- | --------------------- | ---------------------------------------------------------------------------------- |
| `direction` | `--ty-flex-direction` | raw valid enum value                                                               |
| `wrap`      | `--ty-flex-wrap`      | raw valid enum value                                                               |
| `align`     | `--ty-flex-align`     | `start` -> `flex-start`, `end` -> `flex-end`, other values pass through            |
| `justify`   | `--ty-flex-justify`   | `start` -> `flex-start`, `end` -> `flex-end`, `between/around/evenly` -> `space-*` |
| `gap`       | `--ty-flex-gap`       | `0..4` -> `var(--ty-space-*, fallback)`; invalid values fall back to `3`           |
| `inline`    | `--ty-flex-display`   | absent -> `flex`; present -> `inline-flex`                                         |

## Behavior

### State Model

- Controlled state: direction, wrap, align, justify, gap, inline.
- Uncontrolled/default state: row, nowrap, stretch, start, spacing token 3.
- Parent-owned state: placement and available size.
- Child-owned state: intrinsic size, semantics, focus, and events.
- Programmatic update behavior: update CSS values without moving focus or recreating children.

### Native Behavior First

- Native element used: custom element with light DOM children.
- Native behavior preserved: document flow, focus order, event propagation, accessible semantics of children.
- Custom behavior added: attribute-to-CSS mapping and tokenized defaults.

### Focus Model

- Focus owner: children only.
- Tabbable elements: Flex itself is not focusable.
- Roving tabindex: N/A.
- Focus-visible treatment: owned by children.

### Keyboard Contract

Flex adds no keyboard behavior. Tab order follows DOM order, including when `direction="row-reverse"` or `direction="column-reverse"`. Do not reorder DOM to create visual order.

## Layout Contract

- Display: `flex` or `inline-flex`.
- Intrinsic size: content-driven.
- Shrink policy: parent does not force children to shrink; flexible children that need shrink must use `min-inline-size: 0`.
- Wrap policy: controlled by `wrap`.
- Flexible slots: default children, if the application assigns flex policy.
- Fixed slots: none.
- Parent owns: external placement, available width, and item distribution.
- Component owns: one-axis arrangement, gap, alignment, and wrapping.
- Container-query thresholds: none in base primitive.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll; parent or child owns overflow.
- Top-layer / popover policy: N/A.

### Item Guidance

| Child Intent          | Recommended Policy                       | Notes                                         |
| --------------------- | ---------------------------------------- | --------------------------------------------- |
| content-sized control | `flex: 0 1 auto`                         | Default for buttons and inputs.               |
| equal-width actions   | parent class or token sets `flex: 1 1 0` | Use only for explicit equal distribution.     |
| shrinking text region | `min-inline-size: 0`                     | Required to prevent overflow in flex layouts. |
| icon or media         | `flex: none`                             | Prevents distortion.                          |

## Styling Contract

### Public Tokens

Use `--ty-flex-*` tokens for primitive defaults and `--ty-layout-gap` as the shared fallback. Design layers may remap tokens; they should not hardcode child selectors.

### Private Implementation Variables

Private variables use `--_ty-*` and are not consumer API.

### Styling State Surface

Attributes are public styling surface. There are no interactive states.

- Forced-colors behavior: no special handling beyond child components.
- Reduced-motion behavior: no motion.
- App-variant hooks: host attributes, utility class, and public tokens.

## Accessibility

- Role: none by default.
- Accessible name: none.
- ARIA attributes: do not add layout roles. Consumers may add landmark or grouping roles only when the content semantics require it.
- Reading order: DOM order remains the accessible order. Visual reverse directions must be used with care.

## Implementation Requirements

- Implement as a native custom element with no framework runtime.
- Do not attach shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Flex adds no interaction.
- Define idempotently through `defineTyuiFlex`.
- Export `@tyui/elements/flex` and `@tyui/define/flex`.
- Provide `.ty-flex` utility CSS with the same behavior as the element.
- Attribute changes must mutate host style or reflected attributes without rebuilding children.
- Use logical alignment aliases: `start` -> `flex-start`, `end` -> `flex-end`, `between` -> `space-between`.

## Examples

### Storybook Examples

```html story title="Row"
<tyui-flex gap="3" align="center">
  <tyui-button appearance="primary">Save</tyui-button>
  <tyui-button>Cancel</tyui-button>
</tyui-flex>
```

```html story title="Column"
<tyui-flex direction="column" gap="2" style="max-inline-size: 320px;">
  <tyui-input label="Name" value="Ada Lovelace"></tyui-input>
  <tyui-input label="Email" value="ada@example.com"></tyui-input>
</tyui-flex>
```

```html story title="Equal Distribution"
<tyui-flex gap="2" style="--demo-action-flex:1 1 0;">
  <tyui-button style="flex:var(--demo-action-flex);">Back</tyui-button>
  <tyui-button appearance="primary" style="flex:var(--demo-action-flex);">Continue</tyui-button>
</tyui-flex>
```

### Invalid Examples

```html
<!-- Do not use visual reverse order when reading order matters. -->
<tyui-flex direction="row-reverse">
  <tyui-button>Step 1</tyui-button>
  <tyui-button>Step 2</tyui-button>
</tyui-flex>
```

## Tests

| Requirement               | Setup                                                                         | Action                   | Expected Result                                     |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------- |
| Attribute mapping works   | Render default Flex                                                           | Set `direction="column"` | Computed `flex-direction` is `column`.              |
| Children remain light DOM | Render buttons inside Flex                                                    | Query children           | Buttons are direct light DOM descendants.           |
| No focus stop             | Render focusable children                                                     | Press Tab                | Focus enters first child, not Flex.                 |
| Child events pass through | Listen on Flex                                                                | Click child button       | Native event bubbles through Flex.                  |
| Shrink guidance works     | Put long text child with `min-inline-size:0`                                  | Constrain width          | Child shrinks without forcing overflow.             |
| Element/utility parity    | Render `.ty-flex` with matching CSS variables and `tyui-flex` with attributes | Compare core styles      | Display, direction, wrap, alignment, and gap match. |

## Agent Guidance

- Use `tyui-flex` for simple one-axis arrangement.
- Use `tyui-cluster` when wrapping is the point of the layout.
- Use `tyui-grid` when items form responsive tracks.
- Do not put component-specific styling in Flex. The primitive arranges children; components own their internals.
