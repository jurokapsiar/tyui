# Label — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-label`
- Define: `@tyui/define/label`
- Status: draft
- Native substrate: **native `<label>`** (host renders/upgrades to or wraps a `<label>`)
- Shadow DOM: **no** — a label's whole job is the native `for`/implicit-wrapping association, which a shadow boundary breaks. Render light DOM so `<label for>` reaches the control in the same tree.
- Category: form (supporting)
- Component family: form text
- Pattern type: native label
- Fluent / reference analogue: see API and Accessibility.

## Intent

Provide an accessible name/title for a single form control.
Do **not** use a standalone Label for Checkbox/Switch/Radio — those own their inline label; use the control's own label and let `tyui-field` supply only validation/hint. Do not use Label as generic bold text.

Alternatives: `tyui-field` (label + hint + validation wrapper), control-owned labels.

## Selection Guidance

- Use when: caption one form control and expose required/disabled/size styling.
- Do not use when: generic text, headings, links, or clickable commands.
- Prefer instead: Text for generic copy, Field for complete form field layout.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Click/tap delegates to associated control; required marker is not a separate target.

## Composition Contract

- Allowed children: text and optional required marker only; no nested interactive content.
- Required parent: associated form control or Field.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  | Name | Description |
  | ------- | ----------- |
  | default | label text |
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-label onclick="save()">Save</tyui-label>

## API

### Attributes

| Name       | Type                       | Reflects   | Default   | Notes                                   |
| ---------- | -------------------------- | ---------- | --------- | --------------------------------------- |
| `for`      | `string`                   | yes        | —         | forwarded to native `<label for>`       |
| `required` | `boolean \| string`        | yes (bool) | `false`   | `true` → `*`; string → custom indicator |
| `size`     | `small \| medium \| large` | yes        | `medium`  |                                         |
| `weight`   | `regular \| semibold`      | yes        | `regular` |                                         |
| `disabled` | `boolean`                  | yes        | `false`   | **visual only**                         |

### Properties

Mirror attributes; `htmlFor` alias for `for`. No methods.

### Events

None.

### Slots

| Name    | Description |
| ------- | ----------- |
| default | label text  |

### CSS parts

`required` (the indicator) — exposed so products can restyle the asterisk.

### CSS custom properties

`--ty-label-color`, `--ty-label-font-size`, `--ty-label-font-weight`, `--ty-label-required-color`. Default to semantic tokens.

### Event Semantics

- User-initiated events: None.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: associated form control or Field.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                   | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Native label click/focus behavior only; label is not tabbable. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- Render an actual `<label>` element. `for`/`htmlFor` and click-to-focus/activate are **native** — no JS.
- `required` asterisk and `size`/`weight` are pure CSS + a tiny presentational `<span aria-hidden>` for the indicator.
- No shadow DOM = no label-crossing-boundary problem. This is deliberately the cheapest correct implementation.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Native label click/focus behavior only; label is not tabbable.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: associated form control or Field.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Native label click/focus behavior only; label is not tabbable.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                         | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | -------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Native label click/focus behavior only; label is not tabbable. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior               | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                          | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                    | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Click/tap delegates to associated control; required marker is not a separate target.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A — Label is inline form text.
- Closes on: N/A.
- DOM focus while open: N/A.
- Next Tab behavior: native tab order reaches the associated control, not the label.
- Arrow-key entry behavior: N/A.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: required/disabled styling motion must not alter association semantics.

### Form Contract

- Form-associated: Label associates with the control via for/control relationship; it submits no value.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Label associates with the control via for/control relationship; it submits no value.

### Lifecycle And Cleanup

- External event listeners: Control association and generated ID bookkeeping update on slot/control changes and disconnect cleanly.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: a label is not a focus stop. Clicking it focuses/activates the associated control — **native** behavior, preserved (behavior.md "use native HTML semantics before custom roles").
- **Hit targets**: the label forwards activation to exactly one control; it adds no second action.
- **Native behavior**: native `<label>` editing/association/click semantics kept intact; no scripted focus side effects.
- **State & events**: no events. `disabled` is a reflected visual attribute; it must **not** disable the control (Fluent best practice: disabled control keeps a readable, non-disabled label).
- **Disabled/readonly/loading**: label has no interactive state; documented that disabledness belongs to the control.
- **Motion**: none.

## Layout Contract

- Display: inline/block label text with optional required marker.
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

| Name    | Description |
| ------- | ----------- |
| default | label text  |

## Styling Contract

### Public Tokens

`--ty-label-color`, `--ty-label-font-size`, `--ty-label-font-weight`, `--ty-label-required-color`. Default to semantic tokens.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`required` (the indicator) — exposed so products can restyle the asterisk.

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

- Implicit `label` semantics from native `<label>`.
- Required indicator is `aria-hidden`; requiredness is conveyed on the **control** (`aria-required`/`required`), set by `tyui-field`, not by the asterisk.
- `disabled` styling does not change semantics — disabled state lives on the control.

### Reference Requirements

- **APG reference**: Pattern: N/A. APG has no Label pattern; label behavior is native HTML label behavior and must not be replaced by an ARIA widget.
  - Direct requirements:
    - Label itself is not a focus stop.
    - Label click forwards focus/activation to exactly one associated labelable control.
    - `required` indicator is presentational; required state lives on the control.
    - Label relationships do not cross shadow boundaries unless a containing component documents ARIA mirroring.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Label`.
  - Direct requirements:
    - Label renders as native `label`.
    - `disabled` is visual and should be used sparingly because it does not meet the required contrast ratio.
    - `required` can be boolean or custom content.
    - `size` supports small, medium, large.
    - `weight` supports regular and semibold.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- Disabled label fails contrast by design — spec says use sparingly and only when the control is clearly non-interactive (mirrors Fluent guidance).
- If the associated control lives inside another component's shadow DOM, native `for` cannot cross into it. Contract: either the control is light-DOM, or the wrapping component (`tyui-field`) sets the name via `aria-labelledby`/`aria-label` plumbing it documents.
- `required` is presentation only; never let the asterisk be the sole signal — `tyui-field` must also set `aria-required` on the control.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: inline/block label text with optional required marker remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: required marker has accessible text or is paired with aria-required on control.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: required marker has accessible text or is paired with aria-required on control.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-label for="email" required>Email</tyui-label><input id="email" required />
```

### Invalid

```html
<tyui-label onclick="save()">Save</tyui-label>
```

## Agent Guidance

- **Selection guidance** (`ai/components/label.md`): "Prefer `tyui-field` which composes the label; use bare `tyui-label` only for a custom layout. Never label a checkbox/switch/radio with it."
- **Alternatives map**: `full form row → tyui-field`, `checkbox/radio/switch → control's own label`.
- **Layout ownership**: in horizontal orientation the _parent/field_ owns the label column width (Fluent fixes 33%); the label owns only its text wrapping. Encode `parentOwnsStretching: true`.
- **Token usage**: theme via `--ty-label-*`; reject literal colors/sizes.
- **Anti-patterns to reject**: standalone label on checkbox/switch/radio; using Label as a heading; marking the label disabled while its control is enabled; asterisk-only requiredness.
- **x-design-system metadata**:
  ```json
  {
    "intent": "control-name",
    "focusable": false,
    "accessibility": {
      "associatesWith": "single control",
      "requiredIndicatorIsPresentational": true
    }
  }
  ```
- **Validation gates**: every `tyui-label[for]` must resolve to exactly one control id in the generated tree; flag dangling `for`; flag `required` without matching `aria-required` on the control.

## Tests

### Unit / Contract Tests

| Requirement                                                                                         | Setup                  | Action                                    | Validation                                        |
| --------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Click label focuses matching light-DOM control                                                      | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Dangling `for` validation                                                                           | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Required indicator is hidden from AT but paired with control `aria-required` when Field coordinates | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled label is visual only                                                                       | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| No public events                                                                                    | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Forced-colors required indicator visible beyond color alone                                         | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                               | Setup                                                        | Action                      | Validation                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------ | --------------------------- | ---------------------------------------------------------------------------------------------- |
| APG: Native click association             | Render `tyui-label for="email"` and `<input id="email">`.    | Click the label text.       | Focus moves to the input using native label behavior                                           |
| APG: No focusable label                   | Render a label with text only.                               | Press `Tab`.                | Label is skipped and has no widget role                                                        |
| APG: Single-control association           | Render one label pointing to a missing or duplicate ID.      | Run validation.             | Dangling or ambiguous `for` fails                                                              |
| APG: Required indicator is presentational | Render required label coordinated by Field.                  | Inspect accessibility tree. | Indicator is hidden from AT; the control has `required`/`aria-required`                        |
| Fluent UI: Disabled is visual only        | Render a disabled label for an enabled control.              | Inspect state and contrast. | Validation warns/fails according to policy; control is not silently disabled by the label      |
| Fluent UI: Custom required indicator      | Render `required="***"`.                                     | Inspect markup.             | Custom indicator displays but remains presentational; control required state is separately set |
| Fluent UI: Size and weight tokens         | Render all sizes and weights.                                | Inspect generated CSS.      | Styling uses `--ty-label-*` tokens and does not alter semantics                                |
| Fluent UI: Not generic text               | Generate a heading-like label without an associated control. | Run design validation.      | Validation rejects Label as generic bold text and suggests heading/text component              |

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

| Area        | Required coverage                                                  |
| ----------- | ------------------------------------------------------------------ |
| behavior.md | Native semantics first → real `<label>`, native association/click. |
| behavior.md | One target = one action → forwards to a single control only.       |
| behavior.md | Focus only on explicit action → click focuses control (native).    |
| behavior.md | No undocumented events → emits none.                               |
| behavior.md | Disabled is visual, control owns interactive state.                |
| behavior.md | No motion.                                                         |
