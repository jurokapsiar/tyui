# ProgressBar — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-progress-bar`
- Define: `@toyu-ui/define/progress-bar`
- Status: draft
- Native substrate: **native `<progress>`** (determinate). Indeterminate also uses `<progress>` with no `value`, restyled.
- Shadow DOM: minimal. Shadow root holds one `<progress part="bar">` (or a track `<div part="track">` + `<div part="bar">` when `<progress>` styling proves too limited — see quirks). Status semantics stay native.
- Category: status / loading
- Component family: status/loading
- Pattern type: native/ARIA progressbar
- Fluent / reference analogue: see API and Accessibility.

## Intent

Show determinate or indeterminate progress of a single operation.
Do **not** use for an interactive value (→ `tyui-slider`) or for one-word status. Pair with `tyui-field` for a description/validation message (Fluent guidance).

## Selection Guidance

- Use when: task progress or indeterminate loading state.
- Do not use when: scalar measurements unrelated to progress, live alert messages, or decorative loading dots.
- Prefer instead: MessageBar for status text, Meter-like component for scalar measurements.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: No pointer action.

## Composition Contract

- Allowed children: optional label/value text outside or slotted; bar itself has no interactive children.
- Required parent: region/task that owns pending work.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  None (label/description live in `tyui-field`).
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-progress-bar onclick="cancel()" value="40"></tyui-progress-bar>

## API

### Attributes

| Name        | Type                                   | Reflects  | Default   | Notes                |
| ----------- | -------------------------------------- | --------- | --------- | -------------------- |
| `value`     | `number (0..max)`                      | →progress | —         | omit ⇒ indeterminate |
| `max`       | `number`                               | →progress | `1`       |                      |
| `thickness` | `medium \| large`                      | yes       | `medium`  | CSS height           |
| `shape`     | `square \| rounded`                    | yes       | `rounded` | CSS radius           |
| `color`     | `brand \| error \| warning \| success` | yes       | `brand`   | token remap          |

### Properties

`value`, `max` (numbers). No methods.

### Events

None. Progress changes are programmatic; per behavior.md, programmatic state change emits no user-facing event.

### Slots

None (label/description live in `tyui-field`).

### CSS parts

`bar` (filled portion / native progress value), `track` (background, if using the div fallback).

### CSS custom properties

`--ty-progress-track`, `--ty-progress-bar-color`, `--ty-progress-thickness`, `--ty-progress-radius`. `color` remaps `--ty-progress-bar-color`.

### Event Semantics

- User-initiated events: None. Progress changes are programmatic; per behavior.md, programmatic state change emits no user-facing event.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: region/task that owns pending work.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                         | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                      | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | No keyboard behavior; progress bar is not focusable. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                      | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- Native `<progress>` gives `role="progressbar"`, `aria-valuenow/min/max` mapping, and the indeterminate state **for free** — Oat's "platform is the component."
- Determinate: set `value` + `max` on `<progress>`. Indeterminate: omit `value`; animation via CSS keyframes gated by `prefers-reduced-motion`.
- The only JS is reflecting `value`/`max` to the inner element. No measurement loop.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: No keyboard behavior; progress bar is not focusable.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: region/task that owns pending work.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: No keyboard behavior; progress bar is not focusable.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                               | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ---------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | No keyboard behavior; progress bar is not focusable. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior     | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                          | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: No pointer action.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A — ProgressBar is inline status, not an overlay.
- Closes on: N/A.
- DOM focus while open: N/A; progress bar is not focusable.
- Next Tab behavior: skipped in sequential focus.
- Arrow-key entry behavior: N/A.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: indeterminate/value animation never changes progress semantics.

### Form Contract

- Form-associated: Not form-associated; required/readonly disabled do not apply.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated; required/readonly disabled do not apply.

### Lifecycle And Cleanup

- External event listeners: No external listeners unless value polling/animation observers are implemented; those stop on disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: not focusable, not in tab order (it's status, not a control).
- **Hit targets**: no action; never make a progress bar clickable.
- **Native behavior**: native `<progress>` semantics preserved; no role override.
- **State & events**: `value`/`max` update silently; `aria-busy` on the surrounding region (owned by the consumer, not the bar) for pending content (behavior.md loading rule).
- **Disabled/readonly/loading**: this **is** the loading indicator. behavior.md "loading/status must expose meaningful status semantics" → satisfied by native `role="progressbar"`. No disabled state.
- **Motion**: indeterminate animation is decorative and must have a `prefers-reduced-motion` fallback (Fluent ships a reduced-motion gradient + recommends a text status). Determinate transitions on `value` are tokenized.

## Layout Contract

- Display: block/inline bar with track and indicator; parent owns label placement.
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

None (label/description live in `tyui-field`).

## Styling Contract

### Public Tokens

`--ty-progress-track`, `--ty-progress-bar-color`, `--ty-progress-thickness`, `--ty-progress-radius`. `color` remaps `--ty-progress-bar-color`.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`bar` (filled portion / native progress value), `track` (background, if using the div fallback).

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

- Native `role="progressbar"` from `<progress>`; `aria-valuenow/min/max` derived from `value`/`max` (determinate). Indeterminate `<progress>` correctly omits `aria-valuenow`.
- Accessible name comes from the associated `tyui-field`/`aria-label`/`aria-labelledby` (a progressbar has no intrinsic label).
- Reduced-motion indeterminate: Fluent recommends a `Field` validation/hint message so non-animated users still get status — surface this as a contract note.

### Reference Requirements

- **APG reference**: Pattern: N/A. APG has no ProgressBar pattern in the referenced pattern index; do not substitute Meter because Meter represents a scalar measurement, not task progress.
  - Direct requirements:
    - Use native `<progress>` or an equivalent `role="progressbar"` only if native styling is insufficient.
    - Determinate progress exposes current value, min, and max; indeterminate progress omits current value.
    - ProgressBar is status, not an interactive control, so it is not focusable and has no keyboard behavior.
    - The operation must have an accessible name/description outside the bar.
- **Fluent UI reference**: Source component: Fluent UI React v9 `ProgressBar`.
  - Direct requirements:
    - Use indeterminate progress when total units are unknown.
    - Provide a clear description of the progress operation; do not use a single-word description.
    - Show text above and/or below the bar, not to the left or right.
    - Combine steps of one operation into one bar and do not rewind progress to show new steps.
    - Use Field validation/hint text for indeterminate ProgressBar when reduced motion is active.
    - `value` is between `0` and `max` with default `max=1`; undefined value means indeterminate.
    - `indeterminateMotion` can be customized or disabled.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- `<progress>` cross-browser styling needs vendor pseudo-elements (`::-webkit-progress-value`, `::-moz-progress-bar`). If the design needs effects those can't express (e.g. custom indeterminate sweep with arrow), fall back to `<div role="progressbar">` track+bar — **but** then you must set `aria-valuenow/min/max` and `aria-busy` manually. Document which path the component takes; prefer native `<progress>`.
- Fluent's `value` is a **fraction 0–1** by default (max=1), unlike HTML `<progress>` defaulting max=1 too — align the scales; document that `value` is `0..max`.
- Reduced-motion users lose the indeterminate animation → require an accompanying text status (via `tyui-field`).
- Do not "rewind" progress (Fluent anti-pattern).

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: block/inline bar with track and indicator; parent owns label placement remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: visible percentage text should match aria-valuenow.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: visible percentage text should match aria-valuenow.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-progress-bar value="40" max="100" aria-label="Upload progress"></tyui-progress-bar>
```

### Invalid

```html
<tyui-progress-bar onclick="cancel()" value="40"></tyui-progress-bar>
```

## Agent Guidance

- **Selection guidance** (`ai/components/progress-bar.md`): "Use for progress of one operation; always give it an accessible name via `tyui-field`. Indeterminate when total is unknown."
- **Alternatives map**: `interactive value → tyui-slider`, `spinner/short wait → tyui-spinner`, `multi-step → single bar, not rewound`.
- **Layout ownership**: component owns thickness/track; **parent owns width** (typically full-width). layout.md intrinsic rule: width from container, height from `thickness` token.
- **Token usage**: color/thickness via `--ty-progress-*`; reject literal colors; color must not be the only status signal (pair with text).
- **Anti-patterns to reject**: focusable/clickable progress; role override; indeterminate bar with no text fallback under reduced motion; single-word description; rewinding progress.
- **x-design-system metadata**:
  ```json
  {
    "intent": "status",
    "focusable": false,
    "accessibility": {
      "nativeRole": "progressbar",
      "needsAccessibleName": true,
      "reducedMotionRequiresTextStatus": true
    }
  }
  ```
- **Validation gates**: flag `tyui-progress-bar` without an associated label/field; flag color-only status; flag `tabindex`.

## Tests

### Unit / Contract Tests

| Requirement                                                       | Setup                  | Action                                    | Validation                                        |
| ----------------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Determinate value/max reflection and native `position`            | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Indeterminate has no `value`                                      | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Accessible name required                                          | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Not tabbable                                                      | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Programmatic updates silent                                       | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Reduced-motion fallback includes text/status guidance             | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Forced-colors visible track/value                                 | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Design validation rejects color-only/focusable/clickable progress | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                        | Setup                                                    | Action                                     | Validation                                                                            |
| ---------------------------------- | -------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| APG: Determinate semantics         | Render `value="0.5" max="1"` with a Field label.         | Inspect accessibility tree.                | Progressbar exposes name and correct value range; no extra focus stop exists          |
| APG: Indeterminate semantics       | Render with no `value`.                                  | Inspect attributes and accessibility tree. | Internal `<progress>` has no `value`; no `aria-valuenow` is emitted                   |
| APG: Meter substitution guard      | Generate a task-upload progress indicator.               | Run design validation.                     | Generator uses ProgressBar, not Meter, for task completion                            |
| APG: No interactivity              | Render `tabindex` or click handler on ProgressBar.       | Run validation and press Tab.              | Validation rejects focus/click behavior; cancellation must be a separate button       |
| Fluent UI: Description quality     | Render a progress bar labelled only "Loading".           | Run design validation.                     | Validation rejects single-word description and asks for operation-specific text       |
| Fluent UI: Reduced-motion fallback | Enable reduced motion and render indeterminate progress. | Inspect visible status text and animation. | Animation is removed or reduced; Field hint/validation text still communicates status |
| Fluent UI: No rewind               | Simulate values 0.8, 0.2 for one operation.              | Observe state updates.                     | Validation flags rewinding unless a new operation identity is documented              |
| Fluent UI: Text placement          | Render description beside the bar.                       | Run layout validation.                     | Validation suggests text above/below according to Fluent guidance                     |

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

| Area        | Required coverage                                               |
| ----------- | --------------------------------------------------------------- |
| behavior.md | Native semantics first → `<progress>`, `role=progressbar` free. |
| behavior.md | Not focusable; no action.                                       |
| behavior.md | Loading/status semantics exposed (native).                      |
| behavior.md | Programmatic updates emit no events.                            |
| behavior.md | Motion decorative + reduced-motion fallback (text status).      |
| behavior.md | Disabled/readonly N/A, documented.                              |
