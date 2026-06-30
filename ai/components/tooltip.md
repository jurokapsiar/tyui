# Tooltip — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-tooltip`
- Define: `@toyu-ui/define/tooltip`
- Status: draft
- Native substrate: **HTML Popover API** (`popover="manual"`) surface positioned with **CSS Anchor Positioning**; the trigger is the wrapped interactive control. The relationship to the trigger is wired with native `aria-describedby`/`aria-labelledby`.
- Shadow DOM: minimal. Host renders a `<div popover="manual" part="content" role="tooltip">`; the trigger is the slotted child.
- Category: overlay (passive, non-interactive hint)
- Component family: popup description
- Pattern type: tooltip
- Fluent / reference analogue: see API and Accessibility.

## Intent

Show a short text hint about an **interactive** control on hover/focus.
Do **not** put interactive content in a tooltip (→ `tyui-popover` with an expand button). Do **not** attach a tooltip to a static, non-focusable element (icons → `tyui-info-label`). Do **not** use it as the full-text alternative for truncated text.

## Selection Guidance

- Use when: brief supplemental description for an existing trigger.
- Do not use when: interactive content, required form help, rich popovers, or hover-only controls.
- Prefer instead: Popover for interactive/rich content, Field hint for persistent help.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Hover may show/hide but must not move focus or activate anything.

## Composition Contract

- Allowed children: plain text/phrasing content only; no focusable descendants in the tooltip content. The owning trigger may be a native `<button>` or a `tyui-button` only when `tyui-button` exposes native-equivalent focus, accessible-name, disabled, and Enter/Space behavior on the host or provides an API for the tooltip to wire `aria-describedby`/`aria-labelledby` to the real focusable control.
- Required parent: owning trigger control.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  `default` (trigger), `content` (rich tooltip text alternative to the attribute).
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-tooltip><button>Click me</button></tyui-tooltip>

## API

### tyui-tooltip

| Name           | Type                                   | Reflects | Default  | Notes                          |
| -------------- | -------------------------------------- | -------- | -------- | ------------------------------ |
| `content`      | `string` (or `content` slot)           | —        | —        | **required** hint text         |
| `relationship` | `label \| description \| inaccessible` | yes      | —        | **required**; sets aria wiring |
| `appearance`   | `normal \| inverted`                   | yes      | `normal` | styling                        |
| `with-arrow`   | `boolean`                              | yes      | `false`  | anchor-positioned arrow        |
| `positioning`  | property                               | —        | `above`  | → CSS anchor area              |
| `show-delay`   | number                                 | —        | `250`    | ms                             |
| `hide-delay`   | number                                 | —        | `250`    | ms                             |
| `visible`      | `boolean`                              | yes      | `false`  | controlled visibility          |

### Events

- `visible-change` — composed; `{ visible }` (+ optional keyboard event ref). Fires on hover/focus show & hide. User/timing-initiated.

### Slots

`default` (trigger), `content` (rich tooltip text alternative to the attribute).

### CSS parts

`content`, `arrow`.

### CSS custom properties

`--ty-tooltip-background`, `--ty-tooltip-foreground`, `--ty-tooltip-radius`, `--ty-tooltip-padding`, `--ty-tooltip-max-inline-size`, `--ty-tooltip-arrow-size`. `inverted` remaps colors.

### Event Semantics

- User-initiated events: - `visible-change` — composed; `{ visible }` (+ optional keyboard event ref). Fires on hover/focus show & hide. User/timing-initiated.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: owning trigger control.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                    | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                                 | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Trigger focus shows tooltip after delay; Escape dismisses; tooltip itself never receives focus. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                                 | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- The surface is a `popover="manual"` element in the **top layer** with **anchor positioning** — no portal, no z-index, no JS positioner in the common case.
- The only JS is the **show/hide timing** (hover/focus in with `show-delay`, out with `hide-delay`) and dismissing on Esc — a tiny controller, because tooltips are inherently timing-driven and the platform has no declarative hover-tooltip primitive.
- Accessibility wiring (`aria-describedby` vs `aria-labelledby`) is set on the trigger via `relationship` — native attributes, no scripted AT hacks.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Trigger focus shows tooltip after delay; Escape dismisses; tooltip itself never receives focus.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: owning trigger control.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Trigger focus shows tooltip after delay; Escape dismisses; tooltip itself never receives focus.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                          | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Trigger focus shows tooltip after delay; Escape dismisses; tooltip itself never receives focus. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                                | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                           | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                     | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Hover may show/hide but must not move focus or activate anything.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: trigger focus or hover after delay; may also open programmatically for testing.
- Closes on: trigger blur, pointer leave after delay, Escape, or trigger removal.
- DOM focus while open: focus remains on the trigger; tooltip never receives focus.
- Next Tab behavior: Tab moves away from trigger and closes tooltip.
- Arrow-key entry behavior: N/A.
- Outside click / pointerdown behavior: pointer outside trigger/tooltip hover region closes when hover-open.
- Escape behavior: closes tooltip without moving focus from trigger.
- Focus restoration on close: N/A because focus never leaves trigger.
- Behavior while enter / exit motion is running: tooltip is inaccessible/undiscoverable once logically closed.

### Form Contract

- Form-associated: Not form-associated; for required help prefer Field hint/description.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated; for required help prefer Field hint/description.

### Lifecycle And Cleanup

- External event listeners: Trigger focus/blur/mouse/pointer, aria-describedby, and show/hide timers clean up on disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: the tooltip **never takes focus** (behavior.md: passive disclosure must not steal focus). It shows on trigger hover **or** trigger focus, and the surface itself is not a tab stop. Esc hides it while keeping focus on the trigger.
- **Hit targets**: the tooltip adds no action; it only annotates the trigger's single action. Hover shows the hint (allowed preview), never selects/dismisses/navigates.
- **Native behavior**: trigger is a native interactive control; tooltip layers description/label via native ARIA attributes.
- **State & events**: `visible` reflected; show/hide emits `visible-change`. Programmatic `visible` set should reflect without spurious duplicate events.
- **Disabled/readonly/loading**: a disabled trigger generally won't receive hover/focus; for an icon button that must still explain itself when disabled, use `disabled-focusable` so focus (and thus the tooltip) still works. No readonly/loading.
- **Motion**: fade only, fast, reduced-motion safe. Timing (`show-delay`/`hide-delay`) is behavior, not decoration — must remain even under reduced motion. During hide it is logically gone immediately (not interactive).

## Layout Contract

- Display: anchored lightweight surface with collision handling; does not affect document flow.
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

`default` (trigger), `content` (rich tooltip text alternative to the attribute).

## Styling Contract

### Public Tokens

`--ty-tooltip-background`, `--ty-tooltip-foreground`, `--ty-tooltip-radius`, `--ty-tooltip-padding`, `--ty-tooltip-max-inline-size`, `--ty-tooltip-arrow-size`. `inverted` remaps colors.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`content`, `arrow`.

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

- Surface: `role="tooltip"`.
- `relationship` (REQUIRED): `label` → trigger gets `aria-labelledby`/`aria-label` (use for icon-only buttons); `description` → trigger gets `aria-describedby`; `inaccessible` → no wiring (content must be available elsewhere).
- Trigger must be a genuinely focusable interactive control (button/link/field) — never a bare icon/`tabindex` hack (Fluent).

### Reference Requirements

- **APG reference**: Pattern: [APG Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/). Note: APG marks this pattern as work in progress and without task force consensus; use only the stable requirements that are explicit in the page.
  - Direct requirements:
    - Tooltip appears when the trigger receives keyboard focus or mouse hover, typically after a small delay.
    - Tooltip dismisses on Escape, mouse out, or trigger blur depending on how it was invoked.
    - Focus stays on the triggering element while the tooltip is displayed.
    - Tooltip does not receive focus; a hover surface with focusable elements is a non-modal dialog/popover instead.
    - Tooltip container has `role="tooltip"`.
    - Trigger references the tooltip with `aria-describedby` for description behavior.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Tooltip`.
  - Direct requirements:
    - Tooltips wrap interactive controls such as buttons, links, form fields, and gridcells.
    - Static icons use InfoLabel; do not add `tabindex` to static content just to host a tooltip.
    - Tooltip is not for interactive content; use expand/collapse button plus Popover if interaction is needed.
    - Tooltip is not a full-text alternative for truncated content.
    - `relationship` is required: `label`, `description`, or `inaccessible`.
    - `label` sets trigger label for icon-only controls; `description` supplements a visible label; `inaccessible` sets no ARIA and is allowed only when text is available elsewhere.
    - `showDelay` and `hideDelay` default to 250 ms; `visible`/`onVisibleChange` can control visibility.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- **Tooltip ≠ accessible name fallback for truncation** — explicitly disallowed (Fluent). For truncated text use a real expand/title mechanism.
- **Static icons**: do not attach a tooltip to a non-interactive icon or add `tabindex` to make it work → use `tyui-info-label` (a labelled button + popover). Encode this redirect.
- **`relationship` is required and consequential**: `label` overrides the trigger's accessible name (good for icon-only), `description` supplements it; choosing wrong harms SR users. Validate it is always set.
- **Top-layer + shadow**: `aria-describedby`/`labelledby` must reference an id reachable from the trigger; if trigger is light-DOM and surface is in shadow, expose the id via the host or render the surface light-DOM. Document (shared overlay convention).
- Only one tooltip visible at a time (manual popover semantics help here).

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: anchored lightweight surface with collision handling; does not affect document flow remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: no interactive media; icons in trigger must still provide accessible name.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: no interactive media; icons in trigger must still provide accessible name.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-tooltip content="Saves changes" relationship="description">
  <tyui-button>Save</tyui-button>
</tyui-tooltip>
```

### Invalid

```html
<tyui-tooltip><button>Click me</button></tyui-tooltip>
```

## Agent Guidance

- **Selection guidance** (`ai/components/tooltip.md`): "Attach only to focusable interactive controls. Use `relationship=label` for icon-only buttons, `description` for supplementary hints. Keep text short and non-interactive. For static icons use `tyui-info-label`."
- **Alternatives map**: `interactive content → tyui-popover`, `static icon info → tyui-info-label`, `truncated text → title/expand, not tooltip`.
- **Layout ownership**: tooltip owns padding/arrow/max-inline-size; **placement owned by anchor positioning** relative to the trigger.
- **Token usage**: colors via `--ty-tooltip-*`; `inverted` for higher contrast.
- **Anti-patterns to reject**: tooltip on a static/non-focusable element; `tabindex` added to an icon just to host a tooltip; interactive content inside; missing `relationship`; tooltip as truncation fallback.
- **x-design-system metadata**:
  ```json
  {
    "intent": "hint",
    "focusable": false,
    "nativeApi": "popover(manual) + anchor-positioning",
    "accessibility": {
      "relationshipRequired": true,
      "triggerMustBeInteractive": true,
      "neverStealsFocus": true
    },
    "alternatives": { "interactive": "tyui-popover", "iconInfo": "tyui-info-label" }
  }
  ```
- **Validation gates**: flag tooltip without `relationship`; flag tooltip on non-interactive/`tabindex`-hacked trigger; flag interactive content inside; flag tooltip used for truncation.

## Tests

### Unit / Contract Tests

| Requirement                                                 | Setup                  | Action                                    | Validation                                        |
| ----------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| `relationship=label\|description\|inaccessible` ARIA wiring | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Existing trigger ARIA value preservation/merge              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Hover/focus show delays and hide delay with fake timers     | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Esc hides without moving focus                              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Tooltip never tabbable                                      | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled-focusable trigger path                             | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Interactive content validation                              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Reduced-motion still preserves timing                       | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                      | Setup                                                                                                            | Action                                                                                               | Validation                                                                                                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard and focus contract      | Render the component in a direct Vite fixture with realistic surrounding focus targets.                          | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract.                                                                                  |
| Pointer and target ownership     | Render primary and secondary targets documented by the Composition Contract.                                     | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.                                                                                     |
| `tyui-button` trigger end-to-end | Render `tyui-tooltip content="Saves" relationship="description"><tyui-button>Save</tyui-button></tyui-tooltip>`. | Tab to the button, wait show delay, hover, press Escape, then blur.                                  | Tooltip relationship attaches to the accessible button, visible state changes without moving focus, Escape hides it, and disabled-focusable behavior is explicit. |

### Accessibility Tests

| Requirement                                    | Setup                                                                   | Action                          | Validation                                                                                                                 |
| ---------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| APG: Focus invocation                          | Focus an icon button with `relationship="label"`.                       | Wait `show-delay`.              | Tooltip becomes visible while DOM focus remains on the button                                                              |
| APG: Escape dismissal                          | Show tooltip from keyboard focus.                                       | Press `Escape`.                 | Tooltip hides; focus remains on the trigger                                                                                |
| APG: Hover invocation                          | Hover trigger, then move pointer to tooltip and out.                    | Observe timers.                 | Tooltip stays open while pointer is over trigger or tooltip and hides after configured delay                               |
| APG: Non-focusable surface                     | Render tooltip with a link in content.                                  | Run validation and press Tab.   | Validation rejects interactive content; tooltip surface is never tabbable                                                  |
| APG: ARIA relationship                         | Render `relationship="description"`.                                    | Inspect trigger attributes.     | Trigger references tooltip content with `aria-describedby`/equivalent without clobbering existing descriptions             |
| Fluent UI: Relationship required               | Render Tooltip without `relationship`.                                  | Run validation.                 | Validation fails and requires label, description, or inaccessible with rationale                                           |
| Fluent UI: Static icon redirect                | Render tooltip around a non-focusable icon or a `tabindex`-hacked span. | Run validation.                 | Validation rejects it and suggests InfoLabel                                                                               |
| Fluent UI: Label relationship                  | Render icon-only button with `relationship="label"`.                    | Inspect accessible name.        | Button name comes from tooltip content without requiring tooltip focus                                                     |
| Fluent UI: Description relationship            | Render visible-label button with `relationship="description"`.          | Inspect accessible description. | Tooltip supplements the existing name and preserves prior description tokens                                               |
| Fluent UI: `tyui-button` relationship contract | Render `tyui-button` tooltip trigger with existing `aria-describedby`.  | Show/hide by focus and hover.   | Tooltip appends/preserves description tokens on the accessible button surface and never requires private shadow DOM access |
| Fluent UI: Truncation misuse                   | Generate tooltip solely to reveal clipped text.                         | Run design validation.          | Validation rejects it and suggests real expand/title/content strategy                                                      |

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

| Area        | Required coverage                                                        |
| ----------- | ------------------------------------------------------------------------ |
| behavior.md | Passive disclosure never steals focus; surface not a tab stop.           |
| behavior.md | Shows on hover/focus; Esc hides, focus stays on trigger.                 |
| behavior.md | Annotates one trigger; hover never selects/dismisses.                    |
| behavior.md | Native interactive trigger + native aria-describedby/labelledby wiring.  |
| behavior.md | Show/hide → composed `visible-change`; programmatic set non-duplicating. |
| behavior.md | disabled-focusable keeps hint reachable when needed.                     |
| behavior.md | Motion minimal; timing preserved under reduced motion.                   |
