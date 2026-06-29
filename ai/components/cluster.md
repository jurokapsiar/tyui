# Cluster - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-cluster`
- Define: `@tyui/define/cluster`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-cluster`
- Alias concept: Wrap. The public element remains `tyui-cluster`; docs may describe the pattern as wrap layout.
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: wrapping row composition

## Intent

Use Cluster for compact groups of peer items that should stay content-sized and wrap to additional lines when space runs out: action rows, toolbar groups, tag lists, checkbox rows, radio rows, and small metadata chips.

Do not use Cluster for equal-width card grids, vertical forms, page gutters, or layouts where visual order differs from DOM order.

## Selection Guidance

- Use when: items form a row, wrapping is acceptable, and each child keeps its intrinsic size.
- Do not use when: children need equal columns, a single vertical stack, or fixed sidebar behavior.
- Prefer instead: `tyui-flex wrap="wrap"` when you need custom one-axis distribution, `tyui-grid` for tracks, `tyui-container` for page bounds.
- Product-level variant preferences: generated design layers may set dense or spacious gaps.
- Agent rule: choose Cluster when the sentence contains "row of actions", "tags", "chips", "wrap when narrow", or "toolbar-like group".

## Composition Contract

- Allowed children: controls, tags, links, badges, inline media, and short text groups.
- Required parent: none.
- Required child components: none.
- Optional child components: `tyui-button`, `tyui-checkbox`, `tyui-radio`, `tyui-badge`, `tyui-link`.
- Disallowed nested interactive content: none beyond children.
- Composition anti-patterns: using Cluster for table rows or navigation lists where list semantics are required.
- List semantics: when items form a semantic list, use `<ul class="ty-cluster">` or allow a future list-compatible primitive rather than removing list semantics.

## API

### Attributes

| Name      | Type                                            | Reflects | Default  | Notes                       |
| --------- | ----------------------------------------------- | -------- | -------- | --------------------------- |
| `align`   | `start \| center \| end \| baseline \| stretch` | yes      | `center` | Cross-axis alignment.       |
| `justify` | `start \| center \| end \| between`             | yes      | `start`  | Main-axis distribution.     |
| `gap`     | `0 \| 1 \| 2 \| 3 \| 4`                         | yes      | `2`      | Row and column gap token.   |
| `row-gap` | `0 \| 1 \| 2 \| 3 \| 4`                         | yes      | `gap`    | Optional line gap override. |

### Properties

Mirror attributes with typed properties.

### Events

None. Cluster is layout only.

### Event Semantics

Child events pass through light DOM. Cluster must not intercept activation, focus, or form events.

### Slots

| Name    | Description         | Fallback | Slotted Styling Rules                                                      |
| ------- | ------------------- | -------- | -------------------------------------------------------------------------- |
| default | wrapping peer items | none     | each child keeps intrinsic size unless app applies an explicit item policy |

### CSS Parts

None.

### CSS Custom Properties

`--ty-cluster-gap`, `--ty-cluster-row-gap`, `--ty-cluster-align`, `--ty-cluster-justify`, `--ty-layout-gap`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-cluster` and `.ty-cluster`:

| Attribute | CSS Variable           | Mapping                                                                    |
| --------- | ---------------------- | -------------------------------------------------------------------------- |
| `align`   | `--ty-cluster-align`   | `start` -> `flex-start`, `end` -> `flex-end`, other values pass through    |
| `justify` | `--ty-cluster-justify` | `start` -> `flex-start`, `end` -> `flex-end`, `between` -> `space-between` |
| `gap`     | `--ty-cluster-gap`     | `0..4` -> `var(--ty-space-*, fallback)`; invalid values fall back to `2`   |
| `row-gap` | `--ty-cluster-row-gap` | `0..4` -> `var(--ty-space-*, fallback)`; absent uses `gap`                 |

## Behavior

### State Model

- Controlled state: align, justify, gap, row-gap.
- Uncontrolled/default state: center aligned, start justified, gap token 2.
- Parent-owned state: width and placement.
- Child-owned state: intrinsic size, semantics, focus, events.
- Programmatic update behavior: CSS updates only.

### Focus Model

Cluster is not focusable. Children keep DOM-order tabbing. Wrapping must not create a roving tabindex pattern.

### Keyboard Contract

Cluster adds no keyboard behavior. Toolbars or composite widgets must implement their own keyboard contracts and may use Cluster only as an internal layout technique.

## Layout Contract

- Display: flex.
- Intrinsic size: content-driven.
- Shrink policy: children keep intrinsic width by default; long-text children need `min-inline-size: 0` if they should shrink.
- Wrap policy: always wraps.
- Flexible slots: default children only by explicit app policy.
- Fixed slots: none.
- Parent owns: available width and vertical placement.
- Component owns: wrapping, gap, alignment.
- Container-query thresholds: none.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll.

### Item Guidance

| Child Intent   | Recommended Policy                      | Notes                                         |
| -------------- | --------------------------------------- | --------------------------------------------- |
| action button  | content-sized                           | Common action-row pattern.                    |
| tag/chip/badge | content-sized                           | Wraps naturally.                              |
| search input   | `min-inline-size` plus `flex:1 1 12rem` | Use only when the row needs a flexible input. |
| icon-only tool | content-sized                           | Keep target-size token intact.                |

## Styling Contract

### Public Tokens

Use `--ty-cluster-*` tokens. Design layers may map those to product spacing tokens.

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
- ARIA attributes: do not add ARIA for layout.
- Semantic groups: if items need a group name, consumers may add `role="group"` plus `aria-label` or wrap the Cluster in a named region.
- List semantics: preserve native list markup when order/count matters.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Cluster adds no interaction.
- Define idempotently through `defineTyuiCluster`.
- Export `@tyui/elements/cluster` and `@tyui/define/cluster`.
- Provide `.ty-cluster` utility CSS.
- Map alignment aliases to valid CSS values.
- Keep child DOM stable.

## Examples

### Storybook Examples

```html story title="Action Row"
<tyui-cluster gap="2">
  <tyui-button appearance="primary">Save</tyui-button>
  <tyui-button>Cancel</tyui-button>
  <tyui-button appearance="subtle">Reset</tyui-button>
</tyui-cluster>
```

```html story title="Wrapping Tags"
<tyui-cluster gap="1" aria-label="Selected filters">
  <tyui-button size="small" shape="rounded">Design</tyui-button>
  <tyui-button size="small" shape="rounded">Accessibility</tyui-button>
  <tyui-button size="small" shape="rounded">Testing</tyui-button>
  <tyui-button size="small" shape="rounded">Tokens</tyui-button>
</tyui-cluster>
```

```html story title="Flexible Search Row"
<tyui-cluster gap="2" align="center">
  <tyui-input label="Search" style="flex:1 1 14rem;min-inline-size:0;"></tyui-input>
  <tyui-button appearance="primary">Search</tyui-button>
</tyui-cluster>
```

### Invalid Examples

```html
<!-- Do not remove list semantics for a real list. -->
<tyui-cluster>
  <span>One</span>
  <span>Two</span>
</tyui-cluster>
```

## Tests

| Requirement               | Setup                                                                               | Action              | Expected Result                         |
| ------------------------- | ----------------------------------------------------------------------------------- | ------------------- | --------------------------------------- |
| Wraps by default          | Render several buttons in narrow container                                          | Measure rows        | Items wrap without horizontal overflow. |
| Alignment maps            | Set `align="end"`                                                                   | Read computed style | `align-items` is `flex-end`.            |
| No focus stop             | Render focusable children                                                           | Press Tab           | Focus moves to first child.             |
| Child events pass through | Listen on Cluster                                                                   | Click child         | Event bubbles.                          |
| Element/utility parity    | Render `.ty-cluster` with matching CSS variables and `tyui-cluster` with attributes | Compare core styles | Display, wrap, and gap match.           |

## Agent Guidance

- Use Cluster for action rows and wrapping inline groups.
- Use Flex when the axis can be row or column and wrapping is optional.
- Use Grid when the design calls for repeated columns.
- Do not make Cluster responsible for toolbar keyboard behavior.
