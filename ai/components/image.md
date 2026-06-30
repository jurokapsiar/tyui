# Image — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-image`
- Define: `@toyu-ui/define/image`
- Status: draft
- Native substrate: **native `<img>`**
- Shadow DOM: optional/minimal. A thin shadow root holding one `<img part="img">` is acceptable so `shape`/`fit`/`bordered` styling is encapsulated, but `alt`, `src`, `loading`, native fallback and the broken-image glyph must be forwarded to the real `<img>`. If encapsulation is not needed, render the `<img>` in light DOM (lighter, Oat-preferred).
- Category: presentational
- Component family: media
- Pattern type: native image
- Fluent / reference analogue: see API and Accessibility.

## Intent

Display a photo/illustration with consistent shape/fit/border/shadow treatment.
Do **not** use for icons (use `tyui-icon`) or for decorative CSS backgrounds.

## Selection Guidance

- Use when: render meaningful or decorative images with native loading/fallback behavior.
- Do not use when: icons without labels, interactive image buttons, or responsive art direction beyond contract.
- Prefer instead: Icon for symbolic glyphs, Card media slot for composed content.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: No component pointer action; wrapping control owns any action.

## Composition Contract

- Allowed children: fallback/placeholder content only when image fails or is loading.
- Required parent: none.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  None (content is the image itself). Avoid a default slot — an `<img>` has no children.
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-image src="delete.png" onclick="deleteItem()"></tyui-image>

## API

### Attributes

| Name       | Type                                            | Reflects | Default   | Notes                                 |
| ---------- | ----------------------------------------------- | -------- | --------- | ------------------------------------- |
| `src`      | `string`                                        | →img     | —         | forwarded                             |
| `alt`      | `string`                                        | →img     | —         | forwarded; required unless decorative |
| `block`    | `boolean`                                       | yes      | `false`   | fill container width                  |
| `bordered` | `boolean`                                       | yes      | `false`   | rectangular border                    |
| `shadow`   | `boolean`                                       | yes      | `false`   | elevation                             |
| `fit`      | `none \| center \| contain \| cover \| default` | yes      | `default` | → `object-fit`/positioning            |
| `shape`    | `square \| rounded \| circular`                 | yes      | `square`  | → border-radius                       |
| `loading`  | `lazy \| eager`                                 | →img     | `lazy`    | native                                |

### Properties

Mirror attributes; expose `naturalWidth`/`complete` passthrough getters if needed. No methods.

### Events

Re-expose native `load`/`error` (already bubble? no — `error` does not bubble). Forward as composed `load`/`error` only if a product needs them; otherwise rely on listening to the inner img. Default: **no custom events**.

### Slots

None (content is the image itself). Avoid a default slot — an `<img>` has no children.

### CSS parts

`img` — the native image element.

### CSS custom properties

`--ty-image-radius`, `--ty-image-border-color`, `--ty-image-border-width`, `--ty-image-shadow`. Default to semantic tokens; `shape`/`bordered` remap these.

### Event Semantics

- User-initiated events: Re-expose native `load`/`error` (already bubble? no — `error` does not bubble). Forward as composed `load`/`error` only if a product needs them; otherwise rely on listening to the inner img. Default: **no custom events**.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: none.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                        | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                     | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | No keyboard behavior; image is not focusable unless wrapped by an external control. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                     | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- The browser does everything: loading, decoding, lazy-loading, broken-image fallback, `srcset`/`sizes`. We add only CSS for `shape` (border-radius), `fit` (`object-fit`), `bordered`, `shadow`, `block`.
- Zero JS interaction. `fit` maps directly to `object-fit`; `block` toggles `display:block; inline-size:100%`.
- Fluent's "fallback = native `<img>` fallback" is exactly the native behavior we keep — do not script an error placeholder unless a product opts in.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: No keyboard behavior; image is not focusable unless wrapped by an external control.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: none.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: No keyboard behavior; image is not focusable unless wrapped by an external control.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                              | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | No keyboard behavior; image is not focusable unless wrapped by an external control. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                    | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                               | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                         | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: No component pointer action; wrapping control owns any action.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A — Image is media, not an overlay.
- Closes on: N/A.
- DOM focus while open: N/A.
- Next Tab behavior: image is skipped unless wrapped by an external control.
- Arrow-key entry behavior: N/A.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: loading/fallback visual changes do not alter focus or semantics.

### Form Contract

- Form-associated: Not form-associated; native loading attribute is not busy state.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated; native loading attribute is not busy state.

### Lifecycle And Cleanup

- External event listeners: Native load/error listeners update state and are removed on disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: not focusable (an image is not a control). If an image is a link/button, the _wrapping_ `tyui-link`/`tyui-button` owns focus and action — never put `tabindex` on the image.
- **Hit targets**: image carries no action; one action belongs to a wrapping control.
- **Native behavior**: native `<img>` loading/fallback/`alt` kept fully intact — the canonical behavior.md "preserve native semantics" case.
- **State & events**: no public state; load/error are native. No reflected interactive state.
- **Disabled/readonly/loading**: N/A. ("loading" here is the native lazy attribute, not a busy state.)
- **Motion**: none, except an optional tokenized fade-in on `load`, gated by `prefers-reduced-motion`.

## Layout Contract

- Display: inline/block replaced element with aspect-ratio and object-fit/object-position contract.
- Intrinsic size: documented by CSS tokens and native substrate.
- Shrink policy: shrink only within readable/usable limits; do not collapse interactive targets below minimum.
- Wrap policy: component-specific content may wrap only where layout section or examples show it.
- Minimum target token: use the design-system interactive target token for focusable controls.
- Minimum visual target: preserve hit target even when visual affordance is smaller.
- Flexible slots: content/body/default slots unless API marks them fixed.
- Fixed slots: icons, checkmarks, separators, triggers, and action regions when documented.
- Parent owns: placement in page, grid/list position, and external margins.
- Component owns: internal alignment, gap, padding, state surfaces, and ARIA-owned relationship layout.
- Container-query thresholds: use only when documented in DESIGN metadata.
- Scroll / overflow policy: internal scroll only for documented popup/table/dialog surfaces.
- Top-layer / popover policy: use native Popover/top-layer only for popup components.

### Regions / Slots

None (content is the image itself). Avoid a default slot — an `<img>` has no children.

## Styling Contract

### Public Tokens

`--ty-image-radius`, `--ty-image-border-color`, `--ty-image-border-width`, `--ty-image-shadow`. Default to semantic tokens; `shape`/`bordered` remap these.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`img` — the native image element.

### Styling State Surface

| State                  | Surface                                               | Public | Notes                                                   |
| ---------------------- | ----------------------------------------------------- | ------ | ------------------------------------------------------- |
| Default / variant      | Reflected attributes and public CSS custom properties | Yes    | Variants remap tokens, not duplicated rule blocks.      |
| Focus / hover / active | Native pseudo-classes or host attributes              | Yes    | Focus must remain distinct from hover/selected/pressed. |
| Internal derived state | `data-*` or private variables                         | No     | Private unless explicitly listed in API.                |

- Forced-colors behavior: preserve visible boundaries and text/icon contrast.
- Reduced-motion behavior: honor `prefers-reduced-motion`; motion never decides state.
- App-variant hooks: public tokens and documented parts only.

## Accessibility

- Meaningful image: native `alt="…"` (required for non-decorative).
- Decorative image: `alt=""` (preferred) or `role="presentation"`/`aria-hidden="true"`.
- No "image of"/"picture of" prefixes (Fluent guidance baked into docs).

### Reference Requirements

- **APG reference**: Pattern: N/A. APG has no Image pattern; do not infer a widget role. Image behavior is native `<img>` semantics plus author-provided text alternatives.
  - Direct requirements:
    - Meaningful images expose an accessible name through `alt`.
    - Decorative images opt out with `alt=""`, `role="presentation"`, or `aria-hidden="true"` according to the chosen native rendering.
    - Image is not focusable and carries no action; wrapping Link/Button owns any action.
    - Native load/error/fallback behavior is preserved.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Image`.
  - Direct requirements:
    - `alt` is descriptive, accurate, concise, and context-aware.
    - Do not include redundant prefixes like "image of" or "picture of".
    - Do not repeat information already present on the page.
    - Decorative images are excluded from assistive tools.
    - `block`, `bordered`, `fit`, `shadow`, and `shape` are visual/layout props only.
    - Native `<img>` browser fallback is the failure behavior.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- `fit="none"` can overflow its box — document that the parent owns clipping (`overflow`) and sizing.
- Circular shape assumes a square aspect; with non-square sources combine `shape="circular"` + `fit="cover"`.
- If using shadow DOM, `alt` still works (it's on the inner img) but page CSS can't reach the img except via `::part(img)` — that's the intended public surface.
- Broken `src` shows the native broken-image UI by contract; products wanting a custom placeholder opt in explicitly.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: inline/block replaced element with aspect-ratio and object-fit/object-position contract remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: requires alt for meaningful images; empty alt or aria-hidden for decorative images.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: requires alt for meaningful images; empty alt or aria-hidden for decorative images.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-image src="avatar.png" alt="Adele Vance" shape="circular"></tyui-image>
```

### Invalid

```html
<tyui-image src="delete.png" onclick="deleteItem()"></tyui-image>
```

## Agent Guidance

- **Selection guidance** (`ai/components/image.md`): "Use for content imagery. For interactive images, wrap in `tyui-link`/`tyui-button`; never make the image itself focusable."
- **Alternatives map**: `icon → tyui-icon`, `decorative bg → CSS background`, `avatar → tyui-image shape=circular` (or future `tyui-avatar`).
- **Layout ownership**: component owns shape/fit/intrinsic ratio; **parent owns dimensions and clipping**. DESIGN.md layout policy: images size from `width`/`height` attrs or container, not fixed token geometry (layout.md intrinsic-sizing rule).
- **Token usage**: radius/border/shadow via `--ty-image-*`; reject literal values.
- **Anti-patterns to reject**: missing `alt` on meaningful images; "image of …" alt text; `tabindex` on the image; using Image for icons.
- **x-design-system metadata**:
  ```json
  {
    "intent": "media",
    "focusable": false,
    "accessibility": { "requiresAlt": "unless decorative", "decorativeOptOut": "alt=\"\"" }
  }
  ```
- **Validation gates**: flag generated `tyui-image` without `alt` (and without explicit decorative opt-out); flag focusable images.

## Tests

### Unit / Contract Tests

| Requirement                                           | Setup                  | Action                                    | Validation                                        |
| ----------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Meaningful image requires `alt`                       | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Decorative image uses `alt=""`                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| `loading`, `decoding`, `srcset`, and `sizes` forward  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Native load/error cross the host boundary if shadowed | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| `fit`/`shape` token styling                           | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| No tab stop                                           | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Forced-colors border/focus absence                    | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Design validation rejects icon misuse                 | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                              | Setup                                                                           | Action                              | Validation                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| APG: Meaningful image has alt            | Render a content image without `alt`.                                           | Run accessibility validation.       | Validation fails unless an explicit decorative opt-out is present                                                     |
| APG: Decorative image opt-out            | Render a decorative image.                                                      | Inspect accessibility tree.         | Image has empty alt or equivalent presentation semantics and is skipped by assistive tech                             |
| APG: No image action                     | Render `tyui-image tabindex="0"` or with click handler.                         | Run design validation.              | Validation rejects focusable/clickable image and suggests wrapping Link/Button                                        |
| APG: Native fallback preserved           | Render a broken `src`.                                                          | Observe browser behavior.           | Native broken-image fallback/load error path remains available; component does not invent an inaccessible placeholder |
| Fluent UI: Alt quality lint              | Render images with `alt="image of Allan's avatar"` and duplicate adjacent text. | Run docs/example validation.        | Validation flags redundant wording and duplicated page text                                                           |
| Fluent UI: Fit and shape are visual only | Render all `fit` and `shape` combinations.                                      | Inspect DOM and accessibility tree. | No ARIA role/name changes are introduced by visual props                                                              |
| Fluent UI: Block sizing                  | Render `block` inside a constrained parent.                                     | Measure layout at zoom.             | Image fills container width without fixed token geometry; parent owns dimensions                                      |
| Fluent UI: Fallback path                 | Render invalid `src` with border/shape tokens.                                  | Wait for error.                     | Native fallback appears and any re-dispatched event crosses the host boundary if shadowed                             |

### Visual And Contrast Tests

| Requirement                    | Setup                                                                       | Action                                            | Validation                                                             |
| ------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| Focus/hover/active distinction | Render default, hovered, focused, active/selected/pressed where applicable. | Compare states in normal and forced-colors modes. | Keyboard focus is visible and distinct; contrast is preserved.         |
| Tokenized variants             | Render every documented appearance/size/orientation variant.                | Inspect computed styles.                          | Public tokens drive variants; no literal color dependency is required. |
| Reduced motion                 | Enable `prefers-reduced-motion`.                                            | Trigger state transitions.                        | Motion is removed or simplified without changing logical behavior.     |

### Generated Design / AI Contract Tests

| Requirement            | Setup                                                                | Action                    | Validation                                                                   |
| ---------------------- | -------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| Valid generation       | Ask the generator for the valid use case from Selection Guidance.    | Inspect generated markup. | Output uses allowed children, slots, roles, labels, and target ownership.    |
| Anti-pattern rejection | Ask the generator for the invalid example or overloaded-target case. | Run design validation.    | Validation rejects the misuse and suggests the preferred component.          |
| Reference guardrails   | Ask the generator for a nearby but wrong APG/Fluent pattern.         | Run design validation.    | Validation keeps the documented reference pattern or explicit N/A rationale. |

### Coverage Checklist

| Area        | Required coverage                                                          |
| ----------- | -------------------------------------------------------------------------- |
| behavior.md | Native semantics first → real `<img>`, native load/fallback/alt.           |
| behavior.md | Not focusable; wrapping control owns any action (one target = one action). |
| behavior.md | No undocumented events (native load/error only).                           |
| behavior.md | No interactive state; disabled N/A.                                        |
| behavior.md | Motion optional, reduced-motion safe.                                      |
