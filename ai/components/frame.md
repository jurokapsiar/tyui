# Frame - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-frame`
- Define: `@tyui/define/frame`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-frame`
- Alias concept: AspectRatio. The public element remains `tyui-frame`; docs may describe the pattern as aspect-ratio framing.
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: aspect-ratio media/content frame

## Intent

Use Frame to reserve a stable aspect ratio for media, previews, charts, thumbnails, and embedded content. It prevents layout shift while letting the parent own width.

Do not use Frame to crop text-heavy cards, create arbitrary fixed heights, or hide overflowing interactive content.

## Selection Guidance

- Use when: one child needs a stable aspect ratio.
- Do not use when: content height should follow text, the child is an unconstrained form, or scrollable overflow is required.
- Prefer instead: natural block flow for text, `tyui-grid` for collections, future media-specific components for image semantics.
- Product-level variant preferences: generated design layers may choose common ratios for cards, avatars, and media previews.
- Agent rule: choose Frame when the layout question is "what ratio should this visual region hold?"

## Composition Contract

- Allowed children: one primary child such as image, video, canvas, iframe, chart, or preview surface.
- Required parent: none.
- Required child components: none.
- Optional child components: `tyui-image`.
- Disallowed nested interactive content: avoid complex focusable content unless it fits and remains usable.
- Composition anti-patterns: placing a full form in Frame, using overflow hidden to mask broken layout, using Frame for text card height equalization.

## API

### Attributes

| Name       | Type                                             | Reflects | Default  | Notes                                                                                         |
| ---------- | ------------------------------------------------ | -------- | -------- | --------------------------------------------------------------------------------------------- |
| `ratio`    | ratio string such as `16/9`, `4/3`, `1/1`        | yes      | `16/9`   | Maps to CSS `aspect-ratio`.                                                                   |
| `fit`      | `cover \| contain \| fill \| scale-down \| none` | yes      | `cover`  | Applies only to direct replaced media children such as `img`, `video`, `iframe`, or `canvas`. |
| `position` | CSS object-position keyword string               | yes      | `center` | Applies only to direct replaced media children.                                               |

### Properties

Mirror attributes with typed properties.

### Events

None.

### Event Semantics

Child media events pass through light DOM.

### Slots

| Name    | Description  | Fallback | Slotted Styling Rules        |
| ------- | ------------ | -------- | ---------------------------- |
| default | framed child | none     | direct child fills the frame |

### CSS Parts

None.

### CSS Custom Properties

`--ty-frame-ratio`, `--ty-frame-fit`, `--ty-frame-position`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-frame` and `.ty-frame`:

| Attribute  | CSS Variable          | Mapping                                                           |
| ---------- | --------------------- | ----------------------------------------------------------------- |
| `ratio`    | `--ty-frame-ratio`    | ratio string; `16/9` normalizes to `16 / 9`; absent uses `16 / 9` |
| `fit`      | `--ty-frame-fit`      | valid enum value; invalid values fall back to `cover`             |
| `position` | `--ty-frame-position` | raw CSS object-position value; absent uses `center`               |

## Behavior

### State Model

- Controlled state: ratio, fit, position.
- Uncontrolled/default state: 16:9 cover center.
- Parent-owned state: inline size and placement.
- Child-owned state: media semantics, loading behavior, alt text.
- Programmatic update behavior: CSS updates only.

### Focus Model

Frame is not focusable. Focusable child content keeps its own focus behavior.

### Keyboard Contract

No keyboard behavior.

## Layout Contract

- Display: block.
- Intrinsic size: block size derives from inline size and aspect ratio.
- Shrink policy: shrinks with parent inline size.
- Wrap policy: N/A.
- Flexible slots: one default child.
- Fixed slots: none.
- Parent owns: width and placement.
- Component owns: aspect ratio, overflow clipping, child fill behavior.
- Container-query thresholds: none.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: hidden by default; do not place scrollable content inside Frame.

## Styling Contract

### Public Tokens

Use `--ty-frame-*` tokens for ratio, fit, and position. Product design layers may set media ratios by component composition.

### Private Implementation Variables

Private variables use `--_ty-*`.

### Styling State Surface

Attributes and tokens only.

- Forced-colors behavior: none beyond child.
- Reduced-motion behavior: no motion added.
- App-variant hooks: host attributes, utility class, public tokens.

## Accessibility

- Role: none by default.
- Accessible name: none.
- ARIA attributes: do not add media semantics. The child image/video/iframe owns accessible name and role.
- Reading order: unchanged.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Frame adds no interaction.
- Define idempotently through `defineTyuiFrame`.
- Export `@tyui/elements/frame` and `@tyui/define/frame`.
- Provide `.ty-frame` utility CSS.
- Use CSS `aspect-ratio`; do not calculate height in JavaScript.
- Apply child fill rules only to direct children.

## Examples

### Storybook Examples

```html story title="Image Frame"
<tyui-frame ratio="16/9" fit="cover" style="max-inline-size:420px;">
  <img
    src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="%23d7e8ff"/><circle cx="460" cy="120" r="76" fill="%2379a7ff"/><rect x="72" y="196" width="496" height="80" rx="22" fill="%23233548"/></svg>'
    alt="Abstract workspace preview"
  />
</tyui-frame>
```

```html story title="Square Preview"
<tyui-frame ratio="1/1" style="max-inline-size:240px;background:CanvasText;">
  <div style="display:grid;place-items:center;color:Canvas;">Preview</div>
</tyui-frame>
```

### Invalid Examples

```html
<!-- Do not use Frame to force text cards to equal heights. -->
<tyui-frame ratio="4/3">
  <p>Long text that should define its own height instead of being clipped.</p>
</tyui-frame>
```

## Tests

| Requirement            | Setup                                                                  | Action              | Expected Result                           |
| ---------------------- | ---------------------------------------------------------------------- | ------------------- | ----------------------------------------- |
| Ratio maps             | Render `ratio="1/1"`                                                   | Measure box         | Width and height match.                   |
| Child fills            | Render image child                                                     | Read computed style | Direct child fills inline and block size. |
| No focus stop          | Render focusable child                                                 | Press Tab           | Focus enters child, not Frame.            |
| Overflow policy        | Render oversized media                                                 | Inspect layout      | Media clips without layout shift.         |
| Element/utility parity | Compare `.ty-frame` with matching CSS variables and element attributes | Read core styles    | Core frame rules match.                   |

## Agent Guidance

- Use Frame for visual media ratios.
- Use Grid to arrange many Frames.
- Keep alt text and media semantics on the child element.
- Do not put forms or dense interactive surfaces in Frame.
