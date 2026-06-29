# Badge — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-badge`
- Define: `@tyui/define/badge`
- Status: draft
- Native substrate: `<span>` (host itself; no inner control)
- Shadow DOM: **no** — Badge is pure decoration. A shadow root + `<slot>` buys nothing and only adds a boundary that label text must cross. Style the host directly (Oat-style classless/contextual CSS via `:host`).
- Category: presentational (non-interactive)
- Component family: display/status decoration
- Pattern type: presentational inline decoration
- Fluent / reference analogue: see API and Accessibility.

## Intent

Use to decorate another element with a short count, status, or label ("6", "New", "•").
Do **not** use when the information must be independently focusable or read on its own — badges are not in the tab order and are announced only as inline text of their host control. Convey the meaning on the parent (`aria-label`) instead.

Alternatives: counter/status text inside a `Field`, `tyui-message-bar` for surface-level status.

## Selection Guidance

- Use when: short counts, status words, or icon dots attached to an already-labelled control.
- Do not use when: standalone focusable information, live status, or actionable counters.
- Prefer instead: inline status text, Field helper text, or MessageBar.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: No pointer action on the badge; parent owns any click target.

## Composition Contract

- Allowed children: short text plus optional icon only; no interactive descendants.
- Required parent: optional labelled control that owns the action and accessible name.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  | Name | Description |
  | ------- | ------------------------------ |
  | default | count/label text |
  | `icon` | optional leading/trailing icon |
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-badge tabindex="0" onclick="openInbox()">6</tyui-badge>

## API

### Attributes

| Name            | Type                                                                                    | Reflects | Default    | Notes                            |
| --------------- | --------------------------------------------------------------------------------------- | -------- | ---------- | -------------------------------- |
| `appearance`    | `filled \| ghost \| outline \| tint`                                                    | yes      | `filled`   | remaps tokens only               |
| `color`         | `brand \| danger \| important \| informative \| severe \| subtle \| success \| warning` | yes      | `brand`    | must not be sole meaning carrier |
| `shape`         | `circular \| rounded \| square`                                                         | yes      | `circular` |                                  |
| `size`          | `tiny \| extra-small \| small \| medium \| large \| extra-large`                        | yes      | `medium`   |                                  |
| `icon-position` | `before \| after`                                                                       | yes      | `before`   | CSS order flip                   |

### Properties

Mirror the attributes (string/enums). No imperative methods.

### Events

None. Badge emits nothing (behavior.md: no events without documented intent).

### Slots

| Name    | Description                    |
| ------- | ------------------------------ |
| default | count/label text               |
| `icon`  | optional leading/trailing icon |

### CSS parts

None needed (no shadow DOM). Style via the element type + `[slot=icon]`.

### CSS custom properties

`--ty-badge-background`, `--ty-badge-foreground`, `--ty-badge-border-color`, `--ty-badge-radius`, `--ty-badge-size`, `--ty-badge-padding-inline`. Each defaults to TYUI semantic tokens such as `var(--ty-color-surface)` and `var(--ty-color-text)`; variants remap these, never duplicate rule blocks (styles.md "variants should remap tokens").

### Event Semantics

- User-initiated events: None. Badge emits nothing (behavior.md: no events without documented intent).
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: optional labelled control that owns the action and accessible name.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                         | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                      | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | No component keyboard handling; Tab skips the badge and lands on the owning control. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                      | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- The host **is** the badge. `display: inline-flex`, intrinsic size from content.
- No JS behavior at all in the common case — it is a styled box. This is the leanest possible component and the model the rest of the library should aspire to.
- Icon + text are slotted as plain light-DOM children; `iconPosition` is a host attribute that flips `flex-direction`/order in CSS, not JS.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: No component keyboard handling; Tab skips the badge and lands on the owning control.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: optional labelled control that owns the action and accessible name.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: No component keyboard handling; Tab skips the badge and lands on the owning control.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                               | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | No component keyboard handling; Tab skips the badge and lands on the owning control. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                     | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                          | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: No pointer action on the badge; parent owns any click target.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A — Badge is never a popup or overlay.
- Closes on: N/A.
- DOM focus while open: N/A.
- Next Tab behavior: Tab skips the badge and reaches the owning control or next page target.
- Arrow-key entry behavior: N/A.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: motion is decorative only and never creates interactive overlay state.

### Form Contract

- Form-associated: Not form-associated; disabled/readonly/loading do not apply to the badge itself.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated; disabled/readonly/loading do not apply to the badge itself.

### Lifecycle And Cleanup

- External event listeners: No external listeners; optional slotchange validation only if semantics are derived from slotted content.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: never focusable; never receives or moves focus. No `tabindex`.
- **Hit targets**: Badge carries no action. If a count must be actionable (e.g. "6 unread → open inbox"), the _parent control_ owns that single action; the badge stays decorative. Never wrap a badge around a second interactive target.
- **Native behavior**: it is literally a styled native `<span>` host — nothing to reimplement.
- **State & events**: no public state, no events. Color/shape are reflected host attributes (visual state via attributes per behavior.md).
- **Disabled/readonly/loading**: N/A. A disabled host control styles its own badge via inherited tokens; the badge has no disabled mode.
- **Motion**: none by default. A count change may use a tokenized, `prefers-reduced-motion`-gated transition; motion must never imply interactivity.

## Layout Contract

- Display: inline-flex intrinsic pill/dot; parent owns placement such as avatar or button overlay.
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

| Name    | Description                    |
| ------- | ------------------------------ |
| default | count/label text               |
| `icon`  | optional leading/trailing icon |

## Styling Contract

### Public Tokens

`--ty-badge-background`, `--ty-badge-foreground`, `--ty-badge-border-color`, `--ty-badge-radius`, `--ty-badge-size`, `--ty-badge-padding-inline`. Each defaults to TYUI semantic tokens such as `var(--ty-color-surface)` and `var(--ty-color-text)`; variants remap these, never duplicate rule blocks (styles.md "variants should remap tokens").

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

None needed (no shadow DOM). Style via the element type + `[slot=icon]`.

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

| Case                                 | Markup                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------- |
| Text badge (default)                 | no role; treated as inline text of host control                             |
| Icon-only / color-only               | `role="img"` + `aria-label="…"` (REQUIRED — meaning must not be color-only) |
| Decorative duplicate of visible info | `aria-hidden="true"`                                                        |

### Reference Requirements

- **APG reference**: Pattern: N/A. APG has no Badge pattern; do not map Badge to Alert because APG Alert is for brief, important messages that are announced without moving focus. Badge remains inline/presentational unless the author explicitly exposes icon-only or color-only meaning as an image.
  - Direct requirements:
    - Default Badge has no widget role, no `tabindex`, and no activation behavior.
    - Icon-only or color-only meaning is exposed through the parent accessible name/description or `role="img"` plus `aria-label` on the badge.
    - Important status that must be announced uses `tyui-message-bar`, not Badge.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Badge`.
  - Direct requirements:
    - Badges should not receive focus; badge information is surfaced as part of the associated control.
    - Custom icons need alternative text unless purely presentational.
    - Color must not be the sole carrier of meaning.
    - Badge text is short: small counts, labels, or status only.
    - Supported API mirrors `appearance`, `color`, `shape`, `size`, and `iconPosition`.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- Color-only badges (the "unread dot") are an accessibility trap — the spec must force `role="img"` + `aria-label`, or require the meaning on the parent's accessible name.
- Long text is unsupported by contract; the spec caps content and lets it truncate rather than wrap into a pill blob.
- Because there is no shadow DOM, page CSS can reach the badge — acceptable for decoration, but document that the public styling API is the token set, not arbitrary selectors.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: inline-flex intrinsic pill/dot; parent owns placement such as avatar or button overlay remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: optional icon is decorative unless it carries the entire visible meaning, then provide a text equivalent.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: optional icon is decorative unless it carries the entire visible meaning, then provide a text equivalent.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<button aria-label="Inbox, 6 unread"><tyui-badge>6</tyui-badge> Inbox</button>
```

### Invalid

```html
<tyui-badge tabindex="0" onclick="openInbox()">6</tyui-badge>
```

## Agent Guidance

How the agentic pipeline (`DESIGN.md` + `custom-elements.json` + `ai/components/badge.md` + `llms.txt`) should treat Badge:

- **Selection guidance**: "Use `tyui-badge` only as a child decoration of another labelled control. It is never a standalone interactive element." Add to `ai/components/badge.md` Intent + Invalid-examples.
- **Alternatives map** (`x-design-system.alternatives`): `actionable → host control + aria-label`, `surface-status → tyui-message-bar`, `progress → tyui-progress-bar`.
- **Layout ownership**: component owns intrinsic size + padding; parent owns placement (often absolute/`floatingAction` slot of a card or overlaid on an avatar). DESIGN.md layout policy should state badges do not stretch (`parentOwnsStretching: false`, intrinsic only).
- **Token usage**: agent must theme via `--ty-badge-*` / semantic color tokens, never literal colors — feed this into the lint rule "reject literal color on badge."
- **Anti-patterns to reject**: focusable badge (`tabindex`), `onClick` on badge, color as sole status signal, long text.
- **x-design-system metadata**:
  ```json
  {
    "intent": "decoration",
    "focusable": false,
    "accessibility": {
      "requiresAccessibleName": "when icon-only or color-only",
      "allowsInteractiveChildren": false
    }
  }
  ```
- **Validation gates**: flag any generated `tyui-badge` with event handlers, `tabindex`, or color-only meaning without `aria-label`/parent label.

## Tests

### Unit / Contract Tests

| Requirement                                                          | Setup                  | Action                                    | Validation                                        |
| -------------------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Registration and default attributes                                  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Every appearance/shape/size reflects to host and uses `--ty-badge-*` | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Badge is never tabbable                                              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Color-only or icon-only status requires an accessible name           | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Forced-colors preserves text/border contrast                         | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Generated design validation rejects interactive/color-only misuse    | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                                     | Setup                                                                | Action                                                      | Validation                                                                                                                                |
| ----------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| APG: Badge is not an APG widget                 | Render `<tyui-badge>6</tyui-badge>` inside a focusable Inbox button. | Press `Tab` through the page.                               | Focus lands on the button, never the badge; badge has no `role="button"`, `role="alert"`, or `tabindex`                                   |
| APG: Color-only status has a text equivalent    | Render an unread-dot badge with no visible text.                     | Inspect generated markup and accessible name of the parent. | Either parent name/description includes the status or the badge has `role="img"` and a non-empty `aria-label`; otherwise validation fails |
| APG: Announced status is routed away from Badge | Ask the generator for an important dynamic status badge.             | Validate the generated component choice.                    | Generator selects `tyui-message-bar` or inline status text instead of adding alert semantics to Badge                                     |
| Fluent UI: Fluent no-focus rule                 | Render all sizes and appearances with and without icons.             | Sequentially press `Tab`.                                   | No badge enters the tab order and no badge emits activation events                                                                        |
| Fluent UI: Meaningful icon is named             | Render a badge with an icon and no visible text.                     | Run accessibility validation.                               | Validation requires icon alt text or a parent label that includes the icon meaning                                                        |
| Fluent UI: Color is not the only signal         | Render `color="success"` and `color="warning"` badges.               | Inspect visible and accessibility output.                   | Each status is paired with text/hidden text/parent label; color-only output fails                                                         |
| Fluent UI: Short text constraint                | Render a badge with a long sentence.                                 | Run contract validation.                                    | Generator flags the content as misuse and suggests inline text or MessageBar                                                              |

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
| behavior.md | Focus moves only on explicit action → badge never takes focus.             |
| behavior.md | One target = one action → badge holds no action; parent owns it.           |
| behavior.md | Native semantics first → styled native span host, no scripted interaction. |
| behavior.md | Composite rules → N/A (leaf).                                              |
| behavior.md | No events without documented intent → emits none.                          |
| behavior.md | Disabled/readonly/loading → N/A, documented.                               |
| behavior.md | Motion decorates only, reduced-motion safe.                                |
