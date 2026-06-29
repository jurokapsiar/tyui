# Layout Architecture

The design system supplies constraints and relationships; content and available space determine the final layout. Rather than a product theme defining fixed button heights, toolbar widths, or breakpoint-specific layouts, it defines spacing, minimum target sizes, preferred proportions, and wrapping thresholds. The browser then resolves the actual size.

Flexbox is especially suitable because its sizing algorithm starts from items' intrinsic sizes and then distributes available space.

## App-Level vs Component-Level Layout

A product `DESIGN.md` owns the spatial character of an application: page rhythm, gutters, safe areas, density posture, dashboard composition, shell regions, and the amount of negative space that should remain visible. This layout spec owns the reusable library contract: primitives, component internals, slot shrink behavior, token names, and the boundary between parent composition and child intrinsic sizing.

| Concern                                                  | App-Level `DESIGN.md`      | Component-Level Contract                |
| -------------------------------------------------------- | -------------------------- | --------------------------------------- |
| Page gutters, safe areas, page max width                 | Owns                       | Provides token names and primitives     |
| Product spatial mood: dense, spacious, calm, editorial   | Owns                       | Maps density to constraints             |
| App shell, navigation, dashboard, and form-page patterns | Owns                       | Provides reusable pattern docs          |
| Parent composition decisions                             | Owns per screen or pattern | Defines supported policies              |
| Component padding, internal gap, minimum target size     | References product tokens  | Owns implementation                     |
| Slot shrink and wrapping behavior                        | Does not override          | Owns per component                      |
| Container-query threshold policy                         | May choose overrides       | Documents defaults and mechanism        |
| Global scroll regions and app stacking policy            | Owns app shell             | Owns overlays and internal scroll areas |

The product can say "this dashboard uses generous gutters and card grouping." It must not redefine that a button's label slot shrinks, that a leading icon is `flex: none`, or that a dialog body owns its internal scroll region. Those are component contracts.

`design-app.md` may translate product spatial intent into app-specific composition guidance:

- preferred primitives for common layouts (`Flex` for one-axis groups, `Cluster` for action rows, `Grid` for metric cards)
- default gap and gutter tokens for app regions
- when to use equal distribution versus content-sized controls
- which component combinations form approved product patterns
- which desired layouts require new library primitives or documented component hooks

It must still validate those choices against the library's layout contracts.

## 1. Tokens Define Constraints, Not Fixed Geometry

**Avoid:**

```css
--ty-button-width: 120px;
--ty-button-height: 32px;
```

**Prefer:**

```css
--ty-control-min-block-size: 2rem;
--ty-control-padding-inline: 0.75rem;
--ty-control-padding-block: 0.375rem;
--ty-control-max-inline-size: 100%;
```

The component then adapts to translated text, larger fonts, user zoom, different icons, product density, and available container width:

```css
[part='control'] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ty-control-gap);

  min-block-size: var(--ty-control-min-block-size);
  max-inline-size: 100%;
  padding: var(--ty-control-padding-block) var(--ty-control-padding-inline);
}
```

The token system sets the visual character, but content remains authoritative.

## 2. Component Internals Should Be Intrinsically Sized

A button should size itself from its icon, label, gap, border, and padding:

```css
[part='control'] {
  display: inline-flex;
  inline-size: fit-content;
  min-inline-size: min-content;
  max-inline-size: 100%;
}
```

For the label, `min-inline-size: 0` is critical—it allows the flex child to shrink and prevents the component from overflowing a narrow container:

```css
[part='label'] {
  min-inline-size: 0;
  overflow-wrap: anywhere;
}
```

## 3. Expose Flex Behavior as Semantic Layout Tokens

The product theme can define how controls behave in composition:

```css
:root {
  --ty-control-grow: 0;
  --ty-control-shrink: 1;
  --ty-control-basis: auto;
}

:host {
  flex: var(--ty-control-grow) var(--ty-control-shrink) var(--ty-control-basis);
}
```

Use this sparingly. In most cases, the **parent layout**—not the child component—should decide whether a component grows. The preferred division:

```css
tyui-button {
  /* owns intrinsic appearance */
}
tyui-toolbar {
  /* owns arrangement of buttons */
}
```

## 4. Headless Layout Primitives

The component library includes a small number of layout primitives. Each ships as a custom element for the primary documented API and as a CSS utility for low-level use. Both forms use the same tokens and layout contracts.

See [`spec/styling.md`](./styling.md) for the styling surface, cascade layers, and override rules. Layout primitive rules are light-DOM utilities and must emit into the public `utilities` layer from the declared document order:

```css
@layer reset, tokens, product-theme, components, product-components, utilities, overrides;
```

No layout primitive may create a global undeclared layer such as `ty.layout`. Product CSS that needs to beat primitive layout rules uses the declared `overrides` layer.

Required v1 primitives:

| Primitive               | Primary element    | Utility class   | Purpose                            |
| ----------------------- | ------------------ | --------------- | ---------------------------------- |
| `Flex`                  | `<tyui-flex>`      | `.ty-flex`      | One-dimensional row/column layout  |
| `Grid`                  | `<tyui-grid>`      | `.ty-grid`      | Auto-fit responsive grid           |
| `Center`                | `<tyui-center>`    | `.ty-center`    | Horizontally centered content      |
| `Container`             | `<tyui-container>` | `.ty-container` | Page or region width constraint    |
| `Frame` / `AspectRatio` | `<tyui-frame>`     | `.ty-frame`     | Aspect-ratio container             |
| `Cluster` / `Wrap`      | `<tyui-cluster>`   | `.ty-cluster`   | Horizontal group that wraps        |
| `Sidebar`               | `<tyui-sidebar>`   | `.ty-sidebar`   | Fixed-plus-fluid two-column layout |

`Switcher` is a useful intrinsic-layout pattern but is not required in v1. Add it later if product patterns need explicit column-to-row switching beyond `Flex`, `Cluster`, and container-query composition.

### Element and Utility Parity

The custom element and utility class forms share the same CSS custom properties. The element form owns attribute normalization; the utility class form only consumes CSS.

| Author input                        | Element mapping                                         | Utility consumption                                                   |
| ----------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| `<tyui-flex direction="column">`    | sets `--ty-flex-direction: column`                      | `.ty-flex` consumes `--ty-flex-direction` if the author sets it       |
| `<tyui-flex gap="2">`               | sets `--ty-flex-gap: var(--ty-space-2, 0.5rem)`         | `.ty-flex` consumes `--ty-flex-gap` if the author sets it             |
| `<tyui-flex align="start">`         | maps `start` to `flex-start` and sets `--ty-flex-align` | `.ty-flex` consumes `--ty-flex-align` if the author sets it           |
| `<tyui-grid min-item-size="18rem">` | sets `--ty-grid-min-item-size: 18rem`                   | `.ty-grid` consumes `--ty-grid-min-item-size` if the author sets it   |
| `<tyui-sidebar side="end">`         | sets `--ty-sidebar-direction: row-reverse`              | `.ty-sidebar` consumes `--ty-sidebar-direction` if the author sets it |

Supported gap values are `0`, `1`, `2`, `3`, and `4`, matching `--ty-space-0` through `--ty-space-4`. Do not document or generate `gap="5"`, `gap="6"`, or `gap="inherit"` until the token scale and element mapping support them. Invalid gap values fall back to each primitive's default.

Layout primitives must not set `container-type`. Container queries belong in app composition CSS or composite component contracts, where the structural breakpoint and affected regions can be named.

### Flex

For one-axis composition. Use `direction`, `wrap`, `align`, `justify`, and `gap` attributes or matching CSS custom properties rather than one-off layout classes:

```css
.ty-flex,
tyui-flex {
  display: flex;
  flex-direction: var(--ty-flex-direction, row);
  flex-wrap: var(--ty-flex-wrap, nowrap);
  align-items: var(--ty-flex-align, stretch);
  justify-content: var(--ty-flex-justify, flex-start);
  gap: var(--ty-flex-gap, var(--ty-space-3));
}
```

### Cluster / Wrap

For toolbars, action groups, tags, and button rows. Items wrap when they no longer fit—no viewport breakpoint required:

```css
.ty-cluster,
tyui-cluster {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ty-cluster-gap, var(--ty-space-2));
}
```

### Grid

Responds to the container, content, and configured minimum card size—not a hardcoded screen width:

```css
.ty-grid,
tyui-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, var(--ty-grid-min-item-size, 16rem)), 1fr)
  );
  gap: var(--ty-grid-gap, var(--ty-space-4));
}
```

### Center

```css
.ty-center,
tyui-center {
  box-sizing: content-box;
  margin-inline: auto;
  max-inline-size: var(--ty-center-measure, var(--ty-layout-content-measure, 65ch));
  padding-inline: var(--ty-center-gutter, var(--ty-page-gutter, 1rem));
}
```

### Container

```css
.ty-container,
tyui-container {
  box-sizing: border-box;
  inline-size: min(100%, var(--ty-container-max-inline-size, 72rem));
  margin-inline: auto;
  padding-inline: var(--ty-container-gutter, var(--ty-page-gutter, 1rem));
}
```

### Frame / AspectRatio

```css
.ty-frame,
tyui-frame {
  aspect-ratio: var(--ty-frame-ratio, 16 / 9);
  display: block;
  overflow: hidden;
}

.ty-frame > *,
tyui-frame > * {
  block-size: 100%;
  inline-size: 100%;
}

.ty-frame > img,
.ty-frame > video,
.ty-frame > iframe,
.ty-frame > canvas,
tyui-frame > img,
tyui-frame > video,
tyui-frame > iframe,
tyui-frame > canvas {
  object-fit: var(--ty-frame-fit, cover);
  object-position: var(--ty-frame-position, center);
}
```

### Sidebar

```css
.ty-sidebar,
tyui-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ty-sidebar-gap, var(--ty-layout-gap, 1rem));
}

.ty-sidebar > :first-child,
tyui-sidebar > :first-child {
  flex-basis: var(--ty-sidebar-size, 18rem);
  flex-grow: 1;
}

.ty-sidebar > :last-child,
tyui-sidebar > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: min(100%, var(--ty-sidebar-content-min-inline-size, 50%));
}
```

## 5. Container Queries for Structural Mode Changes

Intrinsic sizing handles most cases. Container queries are appropriate when a component genuinely needs a structural mode change. This is superior to viewport media queries because the same component behaves correctly in a full page, a sidebar, a dialog, or a dashboard tile:

```css
tyui-toolbar {
  container-type: inline-size;
}

@container (inline-size < 28rem) {
  [part='actions'] {
    flex-direction: column;
    align-items: stretch;
  }

  [part='actions'] > tyui-button {
    inline-size: 100%;
  }
}
```

Container-query thresholds are documented in each component or primitive contract. CSS custom properties cannot be used in query conditions, so thresholds are build-time design parameters in v1. A generated design bundle may override thresholds by emitting product CSS from `DESIGN.md` / `design-app.md`. Runtime threshold mutation is out of v1 scope.

## 6. Density Modifies Spacing, Not Intrinsic Sizing

A theme adjusts padding, gaps, radius, typography, and minimum target size. It does not fix block size. Components can still grow when text wraps, when the user increases font size, or when an icon is larger:

```css
[data-density='compact'] {
  --ty-control-padding-inline: 0.5rem;
  --ty-control-padding-block: 0.25rem;
  --ty-control-gap: 0.25rem;
  --ty-control-min-block-size: 1.75rem;
}

[data-density='touch'] {
  --ty-control-padding-inline: 1rem;
  --ty-control-padding-block: 0.625rem;
  --ty-control-gap: 0.5rem;
  --ty-control-min-block-size: 2.75rem;
}
```

**Avoid:** `block-size: var(--ty-control-height);`
**Prefer:** `min-block-size: var(--ty-control-min-block-size);`

## 7. Fluid but Bounded Values with `clamp()`

Some values can adapt continuously between a minimum, preferred relationship, and maximum—without a sequence of breakpoint overrides:

```css
:root {
  --ty-page-gutter: clamp(1rem, 0.5rem + 2vi, 3rem);
  --ty-section-gap: clamp(1.5rem, 1rem + 2vi, 4rem);
  --ty-heading-size: clamp(1.5rem, 1.2rem + 1.2vi, 2.5rem);
}
```

For reusable embedded components, prefer container-relative units where supported:

```css
--ty-card-padding: clamp(0.75rem, 4cqi, 1.5rem);
```

## 8. Component Sizing vs. Composition Sizing

This distinction is critical.

**Component owns:**

- Internal padding
- Icon-label gap
- Minimum interaction target
- Label wrapping
- Intrinsic minimum and preferred size
- Internal alignment

**Parent layout owns:**

- Whether the component stretches
- How siblings divide space
- Wrapping
- Ordering
- Available width
- Horizontal vs. vertical composition

A button should not globally contain `flex: 1`. Instead, a button group decides the distribution policy:

```css
tyui-button-group[distribution='equal'] > tyui-button {
  flex: 1 1 0;
}

tyui-button-group[distribution='content'] > tyui-button {
  flex: 0 1 auto;
}
```

This keeps the component reusable in unrelated contexts.

## 9. Composite Components

Composite components own explicit internal layout contracts while using the same intrinsic layout model internally:

- Dialog owns header, body, and footer regions; the body owns internal scroll containment.
- Card owns media, header, body, and actions slots; parent layouts own card placement in grids or lists.
- Form layout is primarily an app composition pattern; individual form controls own label/control internals only when they are composite components.
- Table and data-grid own row, cell, header, and overflow rules.
- Popover and menu own placement constraints, max block size, overflow behavior, and dismissal affordances.

Each composite component document must state:

- Slots and regions.
- Which regions are flexible.
- Which region, if any, scrolls.
- Minimum and maximum inline/block constraints.
- Which sizing and spacing tokens apply.
- What the parent layout owns.

## 10. Overlays, Stacking, and Scroll

Prefer native top-layer APIs for overlays:

- Use `<dialog>` where dialog semantics fit.
- Use the Popover API for popovers, menus, tooltips, and combobox popups where browser support and semantics fit.
- Use tokenized z-index only for non-top-layer surfaces.
- Avoid global z-index ladders as the primary overlay architecture.

Components own internal scroll containment. The app shell owns page-level scroll regions. Overlay component contracts must document max block size, overflow behavior, focus containment, dismissal behavior, and whether the component uses the top layer.

```css
:root {
  --ty-z-index-raised: 1;
  --ty-z-index-sticky: 10;
  --ty-z-index-overlay: 100;
}
```

These z-index tokens are for non-top-layer surfaces only. Top-layer components should rely on the browser's top layer rather than competing z-index values.

## 11. Logical Dimensions Everywhere

To keep the design system adaptable across writing directions, use logical properties. Avoid baking `left`, `right`, `width`, and `height` into low-level design tokens unless the concept is genuinely physical:

```css
padding-inline: var(--ty-control-padding-inline);
padding-block: var(--ty-control-padding-block);

margin-inline-start: var(--ty-space-2);

min-inline-size: 0;
max-inline-size: 100%;
```

## 12. Slotted Content Participates Naturally

A custom element should not assume its label is a fixed string. Icons remain stable; text is allowed to shrink or wrap:

```css
[part='control'] {
  display: inline-flex;
  align-items: center;
  gap: var(--ty-button-gap);
}

[part='content'] {
  min-inline-size: 0;
}

::slotted([slot='start']),
::slotted([slot='end']) {
  flex: none;
}

::slotted(:not([slot])) {
  min-inline-size: 0;
}
```

## 13. Intrinsic Variants Express Policy, Not Pixels

Rather than exposing pixel sizes, expose layout intent:

```html
<tyui-button fit="content">…</tyui-button>
<tyui-button fit="container">…</tyui-button>
<tyui-button nowrap>…</tyui-button>
```

```css
:host([fit='content']) {
  inline-size: fit-content;
}
:host([fit='container']) {
  display: block;
  inline-size: 100%;
}
:host([nowrap]) [part='label'] {
  white-space: nowrap;
}
```

The parent still owns whether to select these policies. `fit="container"` is an opt-in contract made available by the component; it is not a global declaration that the component should always stretch. Use it when the surrounding pattern calls for full-width controls, such as stacked mobile form actions.

## 14. Token Model Reference

```css
:root {
  /* Visual tokens */
  --ty-control-radius: 0.375rem;
  --ty-control-border-width: 1px;

  /* Intrinsic internal sizing */
  --ty-control-padding-inline: 0.75rem;
  --ty-control-padding-block: 0.375rem;
  --ty-control-gap: 0.5rem;
  --ty-control-min-block-size: 2rem;

  /* Content constraints */
  --ty-control-min-inline-size: min-content;
  --ty-control-max-inline-size: 100%;

  /* Composition */
  --ty-layout-gap: 1rem;
  --ty-layout-min-column-size: 16rem;
  --ty-layout-sidebar-size: 18rem;
  --ty-layout-content-measure: 65ch;
}
```

Platform themes change these parameters. The theme changes the design language; intrinsic layout keeps it resilient.

## The Governing Principle

Every component and layout is a negotiation among:

```
content's intrinsic size
+ design-system constraints
+ available container space
+ user preferences
= final used size
```

The product defines bounds and relationships, not final pixels. Layout changes stay almost entirely inside CSS—no framework re-renders, no JavaScript measurement loops.
