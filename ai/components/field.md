# Field — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-field`
- Define: `@tyui/define/field`
- Status: draft
- Native substrate: composition of native `<label>` + the slotted control + native text nodes for hint/validation. Wiring is done with **native `id`/`for`/`aria-describedby`/`aria-errormessage`**.
- Shadow DOM: **no (light DOM)** — Field's entire purpose is to associate a label/description with a control via id references. Those references **cannot cross a shadow boundary**, so Field must live in light DOM and arrange light-DOM children. This is the decisive case where shadow DOM is the wrong tool.
- Category: form layout / association
- Component family: form field wrapper
- Pattern type: native label/description/error wiring; alert only for announced validation
- Fluent / reference analogue: see API and Accessibility.

## Intent

Add a label, optional hint, and a validation message to a **single** form control.
Do **not** put multiple controls in one Field (the label associates with one control). Do **not** use the Field label for Checkbox/Switch/Radio — those own their label; Field still supplies hint/validation.

## Selection Guidance

- Use when: label, hint, validation message, and layout for one native form control.
- Do not use when: standalone text blocks, generic layout, or replacing the inner control semantics.
- Prefer instead: Label for standalone label, MessageBar for page-level status.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Clicking label focuses associated control; helper text is not interactive unless slotted as a separate link/control.

## Composition Contract

- Allowed children: one label, one control slot, optional hint/error/validation message.
- Required parent: form or layout container; field owns relationships for its control.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  | Name | Description |
  | ------------ | --------------------------------------- |
  | `label` | label text (or use `label` attr) |
  | default | the single control |
  | `hint` | helper text |
  | `validation` | validation message (icon auto by state) |
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-field><input><input></tyui-field>

## API

### Attributes

| Name               | Type                                  | Reflects | Default                               | Notes                           |
| ------------------ | ------------------------------------- | -------- | ------------------------------------- | ------------------------------- |
| `orientation`      | `vertical \| horizontal`              | yes      | `vertical`                            | label beside (33% col) vs above |
| `size`             | `small \| medium \| large`            | yes      | `medium`                              | label size                      |
| `required`         | `boolean`                             | yes      | `false`                               | adds `*` + `aria-required`      |
| `validation-state` | `none \| success \| warning \| error` | yes      | `error` when message set, else `none` | drives icon/color/alert         |

### Properties

`label`, `hint`, `validationMessage`, `validationState` (also settable as slots). No methods beyond an internal `wire()` on slot change.

### Events

None public (it's structural). It does not emit on validation change — the consumer owns validity (behavior.md: programmatic state emits nothing).

### Slots

| Name         | Description                             |
| ------------ | --------------------------------------- |
| `label`      | label text (or use `label` attr)        |
| default      | the single control                      |
| `hint`       | helper text                             |
| `validation` | validation message (icon auto by state) |

### CSS parts

`label`, `hint`, `validation`, `validation-icon`, `required-indicator`.

### CSS custom properties

`--ty-field-gap`, `--ty-field-label-size`, `--ty-field-label-col` (default `33%` horizontal), `--ty-field-validation-color-error/-warning/-success`.

### Event Semantics

- User-initiated events: None public (it's structural). It does not emit on validation change — the consumer owns validity (behavior.md: programmatic state emits nothing).
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: form or layout container; field owns relationships for its control.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                           | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                        | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Keyboard belongs to the slotted native control; field does not intercept editing keys. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                        | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- No widget here — Field is structure + ARIA wiring. The lightest correct implementation is light-DOM composition, letting native `<label for>` and `aria-describedby` do the association with zero JS state.
- The only logic: generate ids, set `aria-describedby`/`aria-errormessage`/`aria-invalid`/`aria-required` on the slotted control, and toggle the validation row's `role`.
- `orientation`, `size` = CSS grid/flex. Fluent fixes the horizontal label column at 33% — replicate with a layout token.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Keyboard belongs to the slotted native control; field does not intercept editing keys.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: form or layout container; field owns relationships for its control.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Keyboard belongs to the slotted native control; field does not intercept editing keys.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                 | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Keyboard belongs to the slotted native control; field does not intercept editing keys. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                       | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                  | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                            | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Clicking label focuses associated control; helper text is not interactive unless slotted as a separate link/control.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A — Field is inline form structure.
- Closes on: N/A.
- DOM focus while open: N/A.
- Next Tab behavior: native tab order reaches the associated control, not helper/error text.
- Arrow-key entry behavior: belongs to the slotted control.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: belongs to the slotted control.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: validation/help motion must not move focus or alter form state.

### Form Contract

- Form-associated: Field itself is not submitted; it propagates name/required/disabled/invalid relationships to the control where applicable.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Field itself is not submitted; it propagates name/required/disabled/invalid relationships to the control where applicable.

### Lifecycle And Cleanup

- External event listeners: Slotchange/ID relationship work updates label, description, and validation wiring and disconnects on removal.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: Field is not focusable and never moves focus. Clicking the label focuses the control (native `for`). Per behavior.md, focus only on explicit action.
- **Hit targets**: Field wraps exactly one control = one primary target. Do not stuff extra interactive elements as the labelled child (a second control breaks the association).
- **Native behavior**: relies on native label association and native control validation (`:invalid`, `validity`) — adds ARIA description/error wiring on top, no scripted focus side effects.
- **Composite widgets**: Field is a _labelling container_, not a roving composite. For Checkbox/Radio/Switch it must **not** add its own label (behavior.md "ignore events from nested composites it does not own"); it only supplies hint/validation.
- **State & events**: validation-state is reflected; the alert row appears via `role="alert"` so SR users hear error/warning. No events emitted.
- **Disabled/readonly/loading**: when the control is disabled, the **label stays non-disabled/readable** (Fluent rule). Field forwards no disabledness; the control owns it.
- **Motion**: validation message appearance may use a tokenized, reduced-motion-safe transition; motion must not delay the `alert` announcement.

## Layout Contract

- Display: grid/flex label-control-message stack; orientation controls label placement.
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

| Name         | Description                             |
| ------------ | --------------------------------------- |
| `label`      | label text (or use `label` attr)        |
| default      | the single control                      |
| `hint`       | helper text                             |
| `validation` | validation message (icon auto by state) |

## Styling Contract

### Public Tokens

`--ty-field-gap`, `--ty-field-label-size`, `--ty-field-label-col` (default `33%` horizontal), `--ty-field-validation-color-error/-warning/-success`.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`label`, `hint`, `validation`, `validation-icon`, `required-indicator`.

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

- Label ↔ control: native `for`/`id` (control must be light-DOM or expose an id the field can target).
- Hint: `aria-describedby`.
- Validation message: `aria-errormessage` + `role="alert"` for `error`/`warning` (announced); `success`/`none` use `aria-describedby`, no alert.
- `required` → `aria-required="true"` on the control + visual `*` on the label.
- `error` → `aria-invalid="true"` on the control.

### Reference Requirements

- **APG reference**: Pattern: N/A for Field itself. APG has no Field pattern. Conditional validation messages map to [APG Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) only for error/warning announcements.
  - Direct requirements:
    - Field does not create a widget role or keyboard model.
    - Label/control association uses native label and ARIA relationships in the same DOM scope.
    - Error/warning validation messages use `role="alert"` only when they are important updates and must not move keyboard focus.
    - Validation alerts must be present or updated in a way that screen readers announce reliably; they must not auto-dismiss quickly.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Field`.
  - Direct requirements:
    - Use Field to add label and validation message to form controls, and to label unlabeled controls like ProgressBar.
    - Avoid including both `validationMessage` and `hint`.
    - Do not add multiple controls as a child of one Field.
    - Do not use Field's label with Checkbox; checkbox owns its label.
    - Required appends an indicator and sets `aria-required` on the child.
    - Horizontal orientation places the label beside the input while hint/validation remain below the field component, with a 33 percent label column.
    - Disabled inner controls should not make the label disabled or unreadable.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- **Shadow boundary is fatal here**: if the control is inside another component's shadow root, `for`/`aria-describedby` ids won't resolve. Contract: the labelled control must be light-DOM, or must expose a way for the field to set its accessible name/description (documented hook). This is why Field itself is light-DOM.
- Avoid both `hint` and `validationMessage` simultaneously (Fluent guidance) — when both exist, `aria-describedby` should list hint then error, and the spec should warn.
- Default `validation-state` becomes `error` automatically when a message is set — make that explicit so a neutral message isn't announced as an error.
- Checkbox-in-Field: label must come from the checkbox; Field's `label` slot is suppressed for those controls.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: grid/flex label-control-message stack; orientation controls label placement remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: icons in labels/messages need text equivalents if meaningful.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: icons in labels/messages need text equivalents if meaningful.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-field label="Email" hint="Use your work address"><input type="email" required /></tyui-field>
```

### Invalid

```html
<tyui-field><input /><input /></tyui-field>
```

## Agent Guidance

- **Selection guidance** (`ai/components/field.md`): "Wrap every standalone form control in `tyui-field` to supply label/hint/validation. One control per field. Use it (without its label) to add validation to a `tyui-progress-bar` or to a checkbox."
- **Alternatives map**: `checkbox/radio/switch label → control's own label`, `icon-only info → tyui-tooltip/InfoLabel`.
- **Layout ownership**: Field owns label/hint/validation arrangement and (horizontal) the 33% label column; **parent owns field width and stacking**. layout.md: stacked horizontal fields align via the shared label-column token.
- **Token usage**: spacing/validation colors via `--ty-field-*`; validation color must be paired with icon + text (never color-only).
- **Anti-patterns to reject**: multiple controls in one Field; Field label on checkbox/switch/radio; both hint and validationMessage; disabled label over an enabled control; control nested in shadow DOM unreachable by `for`.
- **x-design-system metadata**:
  ```json
  {
    "intent": "form-field",
    "focusable": false,
    "wrapsControls": 1,
    "accessibility": {
      "associationMechanism": "for/aria-describedby/aria-errormessage",
      "requiresLightDomControl": true
    }
  }
  ```
- **Validation gates**: flag Field with ≠1 labelled control; flag unresolved `for`/`aria-describedby`; flag color-only validation; flag Field label used on checkbox/radio/switch.

## Tests

### Unit / Contract Tests

| Requirement                                                      | Setup                  | Action                                    | Validation                                        |
| ---------------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| `for` focuses the control                                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Hint and validation ID token merging preserves consumer ARIA     | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Error sets `aria-invalid`/`aria-errormessage` and `role="alert"` | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Success/warning semantics                                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Control replacement cleanup                                      | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Checkbox/radio label anti-pattern validation                     | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Horizontal label column token and 400% zoom wrapping             | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                             | Setup                                                         | Action                                        | Validation                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| APG: No widget role                     | Render Field around one input.                                | Inspect accessibility tree.                   | Field does not expose a composite/widget role; the input owns focus and editing                               |
| APG: Native label association           | Render label, hint, and input with generated IDs.             | Click the label and inspect input attributes. | Click focuses the control; `aria-describedby` includes hint and preserves author tokens                       |
| APG: Error alert semantics              | Set `validation-state="error"` with a new validation message. | Update the message text.                      | Message has `role="alert"`, input has `aria-invalid`, and focus remains on the input                          |
| APG: Non-error message is not alert     | Set `validation-state="success"` or `none`.                   | Inspect validation row.                       | Message is described text, not an alert, unless state is warning/error                                        |
| Fluent UI: One-control rule             | Render Field with two controls.                               | Run contract validation.                      | Validation fails and asks for separate fields or a future group component                                     |
| Fluent UI: Hint plus validation warning | Render both hint and validation message.                      | Run validation.                               | Spec warns or fails according to severity; ARIA order is deterministic if both are allowed by author override |
| Fluent UI: Checkbox label exception     | Render Field with label plus Checkbox child.                  | Run validation.                               | Field label is rejected/suppressed; checkbox's own label remains source of name                               |
| Fluent UI: Horizontal layout            | Render horizontal Field at narrow width and 400 percent zoom. | Inspect layout.                               | Label column uses the documented token and content wraps without hiding hint/validation                       |

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

| Area        | Required coverage                                                             |
| ----------- | ----------------------------------------------------------------------------- |
| behavior.md | Native semantics first → native `for`/`aria-describedby`/`aria-errormessage`. |
| behavior.md | One target = one action (single control per field).                           |
| behavior.md | Focus only on explicit action (label click focuses control).                  |
| behavior.md | Composite rule: defers labelling to checkbox/radio/switch.                    |
| behavior.md | Error/warning announced via `role=alert`; no spurious events.                 |
| behavior.md | Disabled control keeps readable label.                                        |
| behavior.md | Motion reduced-motion safe, never blocks announcement.                        |
