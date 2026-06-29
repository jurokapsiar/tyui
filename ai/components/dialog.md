# Dialog — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-dialog` (+ `tyui-dialog-surface`, `tyui-dialog-title`, `tyui-dialog-body`, `tyui-dialog-actions`, `tyui-dialog-trigger`)
- Define: `@tyui/define/dialog`
- Status: draft
- Native substrate: **native `<dialog>`** with `showModal()` (modal/alert) / `show()` (non-modal).
- Shadow DOM: minimal. The host renders a `<dialog part="surface">` plus slots for title/body/actions. Light-dismiss/backdrop/focus-trap/Esc come from the platform, not JS.
- Category: overlay (modal)
- Component family: popup/overlay
- Pattern type: modal dialog or alertdialog
- Fluent / reference analogue: see API and Accessibility.

## Intent

Present a window the user must engage with before continuing (modal), or a focused side task (non-modal), or an interrupting decision (alert).
Do **not** nest dialogs (Fluent anti-pattern); do **not** use for non-blocking status (→ `tyui-message-bar`) or transient hints (→ `tyui-tooltip`).

## Selection Guidance

- Use when: blocking workflow, confirmation, or focused task requiring explicit dismissal.
- Do not use when: brief non-blocking hints, menus, or passive hover content.
- Prefer instead: Popover for non-modal disclosure, Tooltip for descriptions, MessageBar for status.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Backdrop/outside click closes only when explicitly dismissible; actions remain separate targets.

## Composition Contract

- Allowed children: title/body/actions slots; actions are separate controls. Triggers/actions may use native `<button>` or `tyui-button` when `tyui-button` exposes native-equivalent button semantics on the host; native `command`/`commandfor` and `form method="dialog"` behavior require a real button path or a documented `tyui-button` forwarding API.
- Required parent: trigger/controller owns opening; dialog owns modal focus while open.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  `trigger`, `title`, `body`, `actions`, `backdrop` (custom backdrop, `aria-hidden`).
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-dialog><tyui-dialog><p>Nested dialog</p></tyui-dialog></tyui-dialog>

## API

### tyui-dialog

| Name               | Type                          | Reflects | Default | Notes                                  |
| ------------------ | ----------------------------- | -------- | ------- | -------------------------------------- |
| `modal-type`       | `modal \| non-modal \| alert` | yes      | `modal` | drives `showModal` vs `show` + dismiss |
| `open`             | `boolean`                     | yes      | `false` | controlled open state                  |
| `default-open`     | `boolean`                     | no       | `false` | uncontrolled initial                   |
| `inert-trap-focus` | `boolean`                     | yes      | `false` | use native dialog `inert` outside-trap |
| `unmount-on-close` | `boolean`                     | yes      | `true`  | remove surface when closed             |

### Events

- `open-change` — composed; `{ open, type }` where `type` ∈ `triggerClick \| escapeKeyDown \| backdropClick \| closeButton`. Mirrors Fluent's `onOpenChange` (Esc carries the keyboard event). User-initiated only.

### Slots

`trigger`, `title`, `body`, `actions`, `backdrop` (custom backdrop, `aria-hidden`).

### CSS parts

`surface`, `backdrop`, `title`, `body`, `actions`.

### CSS custom properties

`--ty-dialog-background`, `--ty-dialog-radius`, `--ty-dialog-padding`, `--ty-dialog-max-inline-size`, `--ty-dialog-backdrop`, motion duration tokens.

### Event Semantics

- User-initiated events: see Events above, including `open-change` — composed; `{ open, type }` where `type` ∈ `triggerClick \| escapeKeyDown \| backdropClick \| closeButton`. Mirrors Fluent's `onOpenChange` (Esc carries the keyboard event). User-initiated only.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: trigger/controller owns opening; dialog owns modal focus while open.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                                     | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                                                  | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Opening moves focus according to initial-focus policy; modal Tab/Shift+Tab wrap; Escape closes when dismissible. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                                                  | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- Native `<dialog>` gives the **top layer**, `::backdrop`, **focus trap**, **Esc-to-close**, background `inert` (with `inertTrapFocus`/`showModal`), and scroll-blocking — all **for free**. This is the flagship Oat win: a whole class of JS (focus-trap libs, portal, z-index juggling) disappears.
- `modalType`: `modal`/`alert` → `showModal()`; `non-modal` → `show()`. `alert` additionally disables backdrop light-dismiss.
- Open/close wiring uses the **`command`/`commandfor` invoker** (`command="show-modal"` / `command="close"`) when available, falling back to a tiny JS `showModal()/close()` call. Trigger and dialog must resolve ids in the same tree (see quirks).

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Opening moves focus according to initial-focus policy; modal Tab/Shift+Tab wrap; Escape closes when dismissible.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: trigger/controller owns opening; dialog owns modal focus while open.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Opening moves focus according to initial-focus policy; modal Tab/Shift+Tab wrap; Escape closes when dismissible.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                                           | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Opening moves focus according to initial-focus policy; modal Tab/Shift+Tab wrap; Escape closes when dismissible. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                                                 | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                                            | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                                      | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Backdrop/outside click closes only when explicitly dismissible; actions remain separate targets.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: trigger activation, command/commandfor, or programmatic `open=true` using `showModal()` for modal/alert and `show()` for non-modal.
- Closes on: close action, `form method="dialog"`, Escape when allowed, and backdrop click for dismissible modal only.
- DOM focus while open: modal/alert focus stays inside; non-modal allows focus to leave after documented Tab path.
- Next Tab behavior: modal wraps; non-modal proceeds to the next document focus target after the last dialog control.
- Arrow-key entry behavior: N/A except nested composites own their own arrow behavior.
- Outside click / pointerdown behavior: backdrop light-dismiss only when not alert and explicitly dismissible.
- Escape behavior: closes dismissible dialogs and emits `open-change` with escape reason.
- Focus restoration on close: return to invoking trigger unless workflow documents a more logical target.
- Behavior while enter / exit motion is running: logical close happens immediately; content is inert/hidden and focus has already returned.

### Form Contract

- Form-associated: Forms inside dialog use native form semantics; dialog may close on successful submit when configured.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Forms inside dialog use native form semantics; dialog may close on successful submit when configured.

### Lifecycle And Cleanup

- External event listeners: Native cancel/close/backdrop/trigger listeners install on open/connect and are removed on close/disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: on open, focus moves into the dialog — to `autofocus`/first focusable (explicit user action opened it, so this is allowed). Native focus trap keeps Tab inside (modal). On close, focus **returns to the trigger** (native `<dialog>` does this). `non-modal` lets Tab leave after the last element (behavior.md: define next-keyboard-action).
- **Hit targets**: trigger opens; each action button is its own target; the close (×) is a separate labelled button. No overloaded surface click except modal backdrop dismiss (documented).
- **Native behavior**: Esc closes (modal/non-modal), backdrop click closes (modal, not alert), `<form method="dialog">` submit closes with the button's `value` — all native; reflect into `open-change`.
- **Composite widgets**: dialog is a focus scope owner. Nested menus/comboboxes are separate composites; set `aria-modal="false"` so their popups remain reachable.
- **State & events**: `open` reflected; user open/close emits `open-change`; programmatic `open` set updates state but should not double-emit a user event.
- **Disabled/readonly/loading**: a pending async action keeps the dialog open with `aria-busy` on the body; don't disable the whole surface. No readonly.
- **Motion**: surface scale + backdrop fade via tokens, `prefers-reduced-motion`-safe. During exit motion (delayed unmount) the dialog is **logically closed** — focus already returned, content `inert`/`aria-hidden` (behavior.md delayed-unmount rule).

## Layout Contract

- Display: centered top-layer surface with max block/inline size and internal scroll region.
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

`trigger`, `title`, `body`, `actions`, `backdrop` (custom backdrop, `aria-hidden`).

## Styling Contract

### Public Tokens

`--ty-dialog-background`, `--ty-dialog-radius`, `--ty-dialog-padding`, `--ty-dialog-max-inline-size`, `--ty-dialog-backdrop`, motion duration tokens.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`surface`, `backdrop`, `title`, `body`, `actions`.

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

- Native `<dialog>` → `role="dialog"`; `modal-type="alert"` sets `role="alertdialog"`.
- `aria-labelledby` → the title; if no title, require `aria-label`.
- `aria-describedby` → main content for short confirmations; for complex content set it to `undefined` (Fluent) to avoid over-reading.
- When a `Menu`/`Combobox`/`Popover` lives inside, set `aria-modal="false"` on the surface (Fluent/VoiceOver workaround).
- `<dialog>` must contain at least one focusable element (Fluent: never empty/non-focusable).

### Reference Requirements

- **APG reference**: Patterns: [APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and [APG Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) for `modal-type="alert"`.
  - Direct requirements:
    - On open, focus moves to an element inside the dialog; initial focus may be a static `tabindex="-1"` element when content structure needs to be read first.
    - In modal dialog, `Tab` and `Shift+Tab` wrap within the dialog.
    - `Escape` closes the dialog.
    - On close, focus returns to the invoking element unless workflow requires another logical target.
    - Dialog container is `role="dialog"` with `aria-modal="true"` only when outside content is truly inert and visually obscured.
    - Alert dialog uses `role="alertdialog"`, `aria-modal="true"`, a label, and `aria-describedby` pointing to the alert message.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Dialog`.
  - Direct requirements:
    - Structure includes title, content, actions inside a body.
    - Modal dialogs are used sparingly for required/destructive choices.
    - Do not use more than three action buttons.
    - Do not open nested dialogs.
    - Do not use a dialog with no focusable elements.
    - Use `aria-describedby` for short confirmations, but set it undefined for complex form content.
    - If Menu, Combobox, Dropdown, or Popover is inside the dialog, `aria-modal` should be false on the surface for VoiceOver reachability.
    - `modalType` drives modal, non-modal, or alert behavior; alert is not dismissed by backdrop click.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- **Trigger ↔ surface across shadow boundaries**: `command`/`commandfor` and focus return rely on same-tree id resolution and real button support. If the trigger is `tyui-button` or the `<dialog>` is in another root, wire opening via the component's JS trigger API instead of assuming native `commandfor`. Document the chosen mechanism.
- **No nested dialogs** — enforce; suggest wizard/sequential/side-panel instead.
- `aria-describedby` default points at the whole content; for forms set it to `undefined` to avoid the SR reading the entire form (Fluent).
- SSR: with `unmount-on-close=false` the surface stays mounted; native `<dialog>` avoids the React-portal SSR hydration issue Fluent warns about — a genuine advantage of going native.
- `alert` must not light-dismiss (no backdrop close, Esc still allowed per platform but Fluent expects an explicit choice — document the policy).

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: centered top-layer surface with max block/inline size and internal scroll region remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: icons in alert dialogs are decorative unless they add unique warning meaning.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: icons in alert dialogs are decorative unless they add unique warning meaning.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-dialog>
  <tyui-button slot="trigger">Delete file</tyui-button>
  <h2 slot="title">Delete file?</h2>
  <p>This cannot be undone.</p>
  <tyui-button slot="actions">Cancel</tyui-button>
</tyui-dialog>
```

### Invalid

```html
<tyui-dialog
  ><tyui-dialog><p>Nested dialog</p></tyui-dialog></tyui-dialog
>
```

## Agent Guidance

- **Selection guidance** (`ai/components/dialog.md`): "Use modal sparingly for required/destructive decisions; non-modal for side tasks; alert for interruptions. ≤3 action buttons. Never nest dialogs."
- **Alternatives map**: `non-blocking status → tyui-message-bar`, `contextual content → tyui-popover`, `multi-step → wizard in one dialog`, `side task → drawer/panel`.
- **Layout ownership**: dialog owns surface max-inline-size + internal title/body/actions layout; **parent/viewport owns centering (top layer)**. layout.md: `max-inline-size` token + intrinsic height, content scrolls inside.
- **Token usage**: surface/backdrop/motion via `--ty-dialog-*`.
- **Anti-patterns to reject**: nested dialogs; >3 actions; empty/non-focusable dialog; modal for trivial info; missing label when no title; describedby over a complex form.
- **x-design-system metadata**:
  ```json
  {
    "intent": "modal-overlay",
    "nativeElement": "dialog",
    "topLayer": true,
    "accessibility": {
      "focusTrap": "native",
      "returnsFocusToTrigger": true,
      "alertUsesAlertdialog": true,
      "ariaModalFalseWhenNestedPopup": true
    },
    "alternatives": { "status": "tyui-message-bar", "contextual": "tyui-popover" }
  }
  ```
- **Validation gates**: flag nested dialogs; flag >3 actions; flag dialog with no focusable child; flag missing labelledby/aria-label.

## Tests

### Unit / Contract Tests

| Requirement                                                | Setup                  | Action                                    | Validation                                        |
| ---------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| `showModal()` vs `show()` selection                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Esc/backdrop/action close reasons                          | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Alert ignores backdrop close                               | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Focus enters first/autofocus target and returns to trigger | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Non-modal next Tab path                                    | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Form `method="dialog"` return value                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Programmatic `open` is silent                              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Nested popup reachability                                  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                             | Setup                                                                                    | Action                                                                                               | Validation                                                                                                           |
| --------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Keyboard and focus contract             | Render the component in a direct Vite fixture with realistic surrounding focus targets.  | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract.                                     |
| Pointer and target ownership            | Render primary and secondary targets documented by the Composition Contract.             | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.                                        |
| `tyui-button` trigger/action end-to-end | Render `tyui-dialog` with `tyui-button slot="trigger"` and `tyui-button slot="actions"`. | Open with Enter/Space/click; close with Escape and action button.                                    | Dialog opens, traps focus, emits close reason, action buttons work, and focus restores to the `tyui-button` trigger. |

### Accessibility Tests

| Requirement                               | Setup                                                                   | Action                                                           | Validation                                                                                                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APG: Initial focus placement              | Open a modal dialog with short content and one with structured content. | Activate each trigger.                                           | Short dialog focuses the first/autofocus control; structured dialog may focus a static intro/title and omits broad `aria-describedby`                       |
| APG: Modal tab containment                | Open a modal dialog with at least two tabbable elements.                | Press `Tab` and `Shift+Tab` repeatedly.                          | Focus wraps inside the dialog and never moves to inert page content                                                                                         |
| APG: Escape and focus return              | Open from a button, press `Escape`.                                     | Observe focus and events.                                        | Dialog closes, `open-change` reports escape reason, and focus returns to the opener or documented fallback                                                  |
| APG: Alert dialog semantics               | Open `modal-type="alert"`.                                              | Inspect accessibility tree.                                      | Surface exposes `alertdialog`, `aria-modal`, label, and `aria-describedby` for the alert message                                                            |
| Fluent UI: Action count guard             | Render four actions in `tyui-dialog-actions`.                           | Run design validation.                                           | Validation fails and asks for three or fewer actions                                                                                                        |
| Fluent UI: Nested dialog guard            | Render a dialog trigger inside another open dialog.                     | Run validation.                                                  | Nested dialog is rejected with wizard/sequential/panel alternatives                                                                                         |
| Fluent UI: Complex content describedby    | Render a form-heavy dialog body.                                        | Inspect surface attributes.                                      | `aria-describedby` is omitted unless the description is short and linear                                                                                    |
| Fluent UI: Nested popup workaround        | Render a menu/popover inside a modal dialog.                            | Open nested popup under VoiceOver test fixture.                  | Popup is reachable; surface applies the documented `aria-modal=false` workaround when required                                                              |
| Fluent UI: `tyui-button` invoker contract | Render `tyui-button` as dialog trigger and action.                      | Inspect command/JS trigger path, open, close, and restore focus. | The button exposes native-equivalent activation and required ARIA/focus surface; no native `commandfor` assumption is made unless a real button path exists |

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

| Area        | Required coverage                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------- |
| behavior.md | Native semantics first → `<dialog>`, native trap/Esc/backdrop/inert/focus-return.               |
| behavior.md | Focus enters on (user-triggered) open; returns to trigger on close; non-modal next-Tab defined. |
| behavior.md | Separate targets: trigger / actions / close.                                                    |
| behavior.md | Composite: `aria-modal=false` so nested popups stay reachable.                                  |
| behavior.md | User open/close → composed `open-change`; programmatic silent.                                  |
| behavior.md | Pending uses `aria-busy`, not full disable.                                                     |
| behavior.md | Motion tokenized; logically closed during exit; reduced-motion safe.                            |
