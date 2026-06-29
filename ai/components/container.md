# Container - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-container`
- Define: `@tyui/define/container`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-container`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: page or region width constraint

## Intent

Use Container to set page or region width, inline gutters, and horizontal centering. It gives application screens a stable content rail without turning individual components into page-layout owners.

Do not use Container for readable prose measure, one-axis alignment, or card grids. Prefer `tyui-center`, `tyui-flex`, or `tyui-grid` for those jobs.

## Selection Guidance

- Use when: a page, section, or major region needs max width and gutters.
- Do not use when: one component needs internal padding or an action row needs wrapping.
- Prefer instead: `tyui-center` for a narrow readable column, `tyui-grid` for repeated panels, plain block flow inside an already constrained region.
- Product-level variant preferences: generated design layers may map container size names to product breakpoints or content rails.
- Agent rule: choose Container when the layout question is "what horizontal rail does this section live on?"

## Composition Contract

- Allowed children: sections, headings, layouts, forms, grids, and component groups.
- Required parent: none.
- Required child components: none.
- Optional child components: all layout primitives.
- Disallowed nested interactive content: none beyond child rules.
- Composition anti-patterns: using Container inside every card, using Container to set a button width, nesting containers without a named rail change.

## API

### Attributes

| Name     | Type                               | Reflects | Default | Notes                                             |
| -------- | ---------------------------------- | -------- | ------- | ------------------------------------------------- |
| `size`   | `narrow \| medium \| wide \| full` | yes      | `wide`  | Maps to max inline size tokens.                   |
| `gutter` | `0 \| 1 \| 2 \| 3 \| 4 \| page`    | yes      | `page`  | Inline padding token.                             |
| `bleed`  | `boolean`                          | yes      | `false` | Edge-to-edge mode: removes max width and gutters. |

### Properties

Mirror attributes with typed properties.

### Events

None.

### Event Semantics

Child events pass through light DOM.

### Slots

| Name    | Description                | Fallback | Slotted Styling Rules          |
| ------- | -------------------------- | -------- | ------------------------------ |
| default | constrained region content | none     | children keep their own layout |

### CSS Parts

None.

### CSS Custom Properties

`--ty-container-max-inline-size`, `--ty-container-gutter`, `--ty-container-narrow`, `--ty-container-medium`, `--ty-container-wide`, `--ty-page-gutter`.

Default rail token fallbacks: `--ty-container-narrow` -> `42rem`, `--ty-container-medium` -> `60rem`, `--ty-container-wide` -> `72rem`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-container` and `.ty-container`:

| Attribute | CSS Variable                     | Mapping                                                                          |
| --------- | -------------------------------- | -------------------------------------------------------------------------------- |
| `size`    | `--ty-container-max-inline-size` | `narrow/medium/wide` -> named rail token with fallback; `full` -> `none`         |
| `gutter`  | `--ty-container-gutter`          | `page` -> `var(--ty-page-gutter, 1rem)`; `0..4` -> `var(--ty-space-*, fallback)` |
| `bleed`   | `--ty-container-gutter`          | present -> `0`; `size="full"` still keeps gutters unless `bleed` is present      |

## Behavior

### State Model

- Controlled state: size, gutter, bleed.
- Uncontrolled/default state: wide content rail with page gutter.
- Parent-owned state: vertical placement and app shell.
- Child-owned state: semantics, spacing inside region.
- Programmatic update behavior: CSS updates only.

### Focus Model

Container is not focusable. Children keep native focus order.

### Keyboard Contract

No keyboard behavior.

## Layout Contract

- Display: block.
- Intrinsic size: inline size is `100%` constrained by `max-inline-size`; `size="full"` removes max width but keeps gutters, while `bleed` removes max width and gutters.
- Shrink policy: shrinks to viewport/container with gutters.
- Wrap policy: natural child wrapping.
- Flexible slots: default content.
- Fixed slots: none.
- Parent owns: page shell and vertical rhythm around Container.
- Component owns: max width, inline gutters, horizontal centering.
- Container-query thresholds: none.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll.

## Styling Contract

### Public Tokens

Use `--ty-container-*` tokens and `--ty-page-gutter`. Design layers may set container rails from `DESIGN.md`.

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
- ARIA attributes: consumers may add landmark roles to sections when appropriate.
- Reading order: unchanged.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Container adds no interaction.
- Define idempotently through `defineTyuiContainer`.
- Export `@tyui/elements/container` and `@tyui/define/container`.
- Provide `.ty-container` utility CSS.
- Do not use viewport-specific JavaScript.

## Examples

### Storybook Examples

```html story title="Page Section"
<tyui-container size="wide">
  <tyui-flex direction="column" gap="4">
    <h2>Settings</h2>
    <tyui-grid min-item-size="18rem">
      <section style="padding:16px;border:1px solid CanvasText;">Account</section>
      <section style="padding:16px;border:1px solid CanvasText;">Security</section>
      <section style="padding:16px;border:1px solid CanvasText;">Billing</section>
    </tyui-grid>
  </tyui-flex>
</tyui-container>
```

```html story title="Full Bleed Region"
<tyui-container bleed gutter="4" style="background:CanvasText;color:Canvas;padding-block:24px;">
  <h2>Full-width announcement</h2>
</tyui-container>
```

### Invalid Examples

```html
<!-- Do not use Container to size a single control. -->
<tyui-container size="narrow">
  <tyui-button>Save</tyui-button>
</tyui-container>
```

## Tests

| Requirement            | Setup                                                                      | Action                        | Expected Result                                         |
| ---------------------- | -------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------- |
| Size maps              | Render `size="medium"`                                                     | Read computed max inline size | Uses medium token.                                      |
| Full keeps gutters     | Render `size="full"`                                                       | Read CSS variables            | Max inline size is none and gutter remains page gutter. |
| Bleed removes gutters  | Render with `bleed`                                                        | Read CSS variables            | Max inline size is none and gutter is `0`.              |
| Gutters apply          | Render in narrow viewport                                                  | Measure padding               | Inline gutter remains.                                  |
| No focus stop          | Render focusable child                                                     | Press Tab                     | Focus enters child.                                     |
| Element/utility parity | Compare `.ty-container` with matching CSS variables and element attributes | Read core styles              | Core rules match.                                       |

## Agent Guidance

- Use Container for page and section rails.
- Use Center for readable measure inside a Container.
- Do not solve component spacing by adding Container around controls.
- Put app shell decisions in `DESIGN.md` / `design-app.md`, then map them to Container tokens.
