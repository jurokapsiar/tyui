# Sidebar - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-sidebar`
- Define: `@toyu-ui/define/sidebar`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-sidebar`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: fixed-plus-fluid two-region layout

## Intent

Use Sidebar for a two-region layout where one child has a preferred fixed size and the other child takes the remaining space. It collapses through intrinsic flex wrapping instead of viewport breakpoints.

Use it for navigation plus content, filter panel plus results, metadata plus detail, or media plus body. Do not use it for app-wide drawer behavior, overlay side panels, or arbitrary three-column shells.

## Selection Guidance

- Use when: exactly two primary regions exist and one region has a preferred size.
- Do not use when: the side region opens as an overlay, more than two columns are needed, or both regions should be equal cards.
- Prefer instead: `tyui-grid` for peer columns, `tyui-container` for page rails, dialog/drawer components for overlay side panels.
- Product-level variant preferences: generated design layers may set side width, gap, and collapse threshold through tokens.
- Agent rule: choose Sidebar when the layout sentence reads "filters beside results" or "nav beside content".

## Composition Contract

- Allowed children: exactly two direct children.
- Required parent: none.
- Required child components: none.
- Optional child components: nav, form filters, details, grids, cards.
- Disallowed nested interactive content: none beyond child rules.
- Composition anti-patterns: adding three or more direct children, using CSS order to move navigation after content while DOM says otherwise, using Sidebar for an overlay drawer.
- Child order: first child is the side region; second child is the main/content region.

## API

### Attributes

| Name          | Type                              | Reflects | Default | Notes                                                                             |
| ------------- | --------------------------------- | -------- | ------- | --------------------------------------------------------------------------------- |
| `side`        | `start \| end`                    | yes      | `start` | `end` maps to `flex-direction: row-reverse`; DOM order remains the reading order. |
| `side-size`   | CSS length token or length string | yes      | `18rem` | Preferred side region size.                                                       |
| `content-min` | CSS length token or length string | yes      | `50%`   | Minimum content size before wrap/collapse.                                        |
| `gap`         | `0 \| 1 \| 2 \| 3 \| 4`           | yes      | `3`     | Gap between regions.                                                              |
| `no-stretch`  | `boolean`                         | yes      | `false` | Prevents default cross-axis stretch.                                              |

### Properties

Mirror attributes with typed properties.

### Events

None. Sidebar is layout only.

### Event Semantics

Child events pass through light DOM.

### Slots

| Name    | Description         | Fallback | Slotted Styling Rules                                                |
| ------- | ------------------- | -------- | -------------------------------------------------------------------- |
| default | exactly two regions | none     | first child receives side policy; second child receives fluid policy |

### CSS Parts

None.

### CSS Custom Properties

`--ty-sidebar-size`, `--ty-sidebar-content-min-inline-size`, `--ty-sidebar-gap`, `--ty-layout-gap`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-sidebar` and `.ty-sidebar`:

| Attribute     | CSS Variable                           | Mapping                                                                  |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `side`        | `--ty-sidebar-direction`               | `start` -> `row`; `end` -> `row-reverse`                                 |
| `side-size`   | `--ty-sidebar-size`                    | valid CSS length string; absent uses `18rem`                             |
| `content-min` | `--ty-sidebar-content-min-inline-size` | valid CSS length string; absent uses `50%`                               |
| `gap`         | `--ty-sidebar-gap`                     | `0..4` -> `var(--ty-space-*, fallback)`; invalid values fall back to `3` |
| `no-stretch`  | `--ty-sidebar-align`                   | absent -> `stretch`; present -> `flex-start`                             |

## Behavior

### State Model

- Controlled state: side, side-size, content-min, gap, no-stretch.
- Uncontrolled/default state: start side, 18rem side size, 50 percent content minimum, gap token 3.
- Parent-owned state: page region and available width.
- Child-owned state: semantics, focus, scroll.
- Programmatic update behavior: CSS updates only.

### Focus Model

Sidebar is not focusable. Focus order follows DOM order. Visual `side="end"` must not create a misleading reading order.

### Keyboard Contract

No keyboard behavior. Navigation, filters, and content controls own their own keyboard contracts.

## Layout Contract

- Display: flex.
- Intrinsic size: side child uses preferred flex basis; content child consumes remaining space.
- Shrink policy: content child has `min-inline-size: min(100%, content-min)`; side child can wrap above content when space runs out.
- Wrap policy: wraps to one column when the content minimum cannot fit.
- Flexible slots: second child is fluid.
- Fixed slots: first child has preferred side size.
- Parent owns: page placement and vertical rhythm.
- Component owns: side/content flex relationship and gap.
- Container-query thresholds: no explicit breakpoint; flex wrapping handles collapse.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: children own internal scroll.

### Direct Child Contract

| Child  | Role           | Flex Policy                           | Notes                                                        |
| ------ | -------------- | ------------------------------------- | ------------------------------------------------------------ |
| first  | side region    | `flex-basis: side-size; flex-grow: 1` | Navigation, filters, media, metadata.                        |
| second | content region | `flex-basis: 0; flex-grow: 999`       | Main content; must support `min-inline-size:0` where needed. |

## Styling Contract

### Public Tokens

Use `--ty-sidebar-*` tokens. Design layers may set side size and gap from product layout principles.

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
- ARIA attributes: consumers should use native landmarks inside children when the regions need names.
- Reading order: DOM order must match reading order. Do not use `side="end"` to hide an order problem.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Sidebar adds no interaction.
- Define idempotently through `defineTyuiSidebar`.
- Export `@toyu-ui/elements/sidebar` and `@toyu-ui/define/sidebar`.
- Provide `.ty-sidebar` utility CSS.
- Warn in development when direct child count is not two.
- Do not calculate collapse with JavaScript.

## Examples

### Storybook Examples

```html story title="Filters And Results"
<tyui-sidebar side-size="16rem" content-min="55%" gap="4">
  <aside>
    <h3>Filters</h3>
    <tyui-flex direction="column" gap="2">
      <tyui-checkbox checked>Available</tyui-checkbox>
      <tyui-checkbox>Has owner</tyui-checkbox>
    </tyui-flex>
  </aside>
  <main>
    <tyui-grid min-item-size="12rem">
      <section style="padding:16px;border:1px solid CanvasText;">Result A</section>
      <section style="padding:16px;border:1px solid CanvasText;">Result B</section>
    </tyui-grid>
  </main>
</tyui-sidebar>
```

```html story title="Media And Body"
<tyui-sidebar side-size="12rem" content-min="60%" gap="3">
  <tyui-frame ratio="1/1">
    <div style="display:grid;place-items:center;background:CanvasText;color:Canvas;">Image</div>
  </tyui-frame>
  <tyui-flex direction="column" gap="2">
    <h3>Component preview</h3>
    <p>The body region takes remaining space and wraps below the media when narrow.</p>
    <tyui-cluster>
      <tyui-button appearance="primary">Open</tyui-button>
      <tyui-button>Dismiss</tyui-button>
    </tyui-cluster>
  </tyui-flex>
</tyui-sidebar>
```

### Invalid Examples

```html
<!-- Sidebar accepts exactly two direct children. -->
<tyui-sidebar>
  <aside>Filters</aside>
  <main>Results</main>
  <section>Extra panel</section>
</tyui-sidebar>
```

## Tests

| Requirement            | Setup                                                                    | Action             | Expected Result                                                    |
| ---------------------- | ------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------ |
| Two-region flex works  | Render two children                                                      | Measure widths     | First child uses side size; second fills remaining space.          |
| Wrap collapse works    | Constrain container                                                      | Measure rows       | Content wraps below side region without JS.                        |
| Child count warning    | Render three direct children in dev                                      | Observe console    | Development warning is emitted.                                    |
| No focus stop          | Render focusable children                                                | Press Tab          | Focus enters first focusable child in DOM order.                   |
| `side=end` mapping     | Render `side="end"`                                                      | Read CSS variables | `--ty-sidebar-direction` is `row-reverse`; DOM order is unchanged. |
| Element/utility parity | Compare `.ty-sidebar` with matching CSS variables and element attributes | Read core styles   | Core rules match.                                                  |

## Agent Guidance

- Use Sidebar for two-region fixed-plus-fluid layouts.
- Keep app drawer and overlay behavior out of Sidebar.
- Put landmarks inside children when regions need names.
- Use Grid for more than two peer columns.
