# MessageBar — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-message-bar` (+ optional `tyui-message-bar-group`)
- Define: `@tyui/define/message-bar`
- Status: draft
- Native substrate: semantic `<div>` container with an ARIA live role; icon, body, and actions are slotted native elements (`tyui-button` for actions, `tyui-link` for inline links).
- Shadow DOM: minimal. Shadow root holds the layout grid (icon / body / actions) with `part`s and `<slot>`s. The live-region role sits on the host (or an inner wrapper) so announcements work.
- Category: status / notification
- Component family: status surface
- Pattern type: alert/status depending on intent
- Fluent / reference analogue: see API and Accessibility.

## Intent

Communicate persistent, surface-or-app-level status (info/success/warning/error) that the user should notice but not necessarily act on immediately, and that persists until resolved/dismissed.
Do **not** use for transient toasts (→ `tyui-toast`), for inline field validation (→ `tyui-field`), or for blocking decisions (→ `tyui-dialog`).

## Selection Guidance

- Use when: page/region-level status, warning, error, or success message.
- Do not use when: inline validation for one control, badge counts, or modal confirmations.
- Prefer instead: Field validation for form errors, Dialog for blocking decisions, Badge for decorative counts.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Dismiss and actions are separate targets; clicking message body does nothing.

## Composition Contract

- Allowed children: icon, title/body text, optional actions, optional dismiss target.
- Required parent: page/section/container announcing status.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  | Name | Description |
  | ---------------- | --------------------------------------------------------------------------- |
  | `icon` | intent icon (default provided) |
  | default / `body` | message text |
  | `title` | bold lead-in |
  | `actions` | action buttons + dismiss (the `containerAction`/dismiss is the last button) |
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-message-bar onclick="retry()">Retry failed</tyui-message-bar>

## API

### Attributes

| Name         | Type                                  | Reflects | Default             | Notes                                          |
| ------------ | ------------------------------------- | -------- | ------------------- | ---------------------------------------------- |
| `intent`     | `info \| success \| warning \| error` | yes      | `info`              | preset icon + color + default politeness       |
| `politeness` | `polite \| assertive`                 | yes      | derived from intent | overrides live setting                         |
| `layout`     | `auto \| singleline \| multiline`     | yes      | `auto`              | CSS/container-query driven                     |
| `shape`      | `square \| rounded`                   | yes      | `rounded`           | square = page-level, rounded = component-level |

### Properties

Mirror attributes. No imperative API on the bar; the group may expose `dismiss(id)` helpers in the consumer layer.

### Events

`dismiss` — composed, emitted by the bar **only if** the component provides a built-in dismiss affordance; otherwise the consumer's slotted dismiss `tyui-button` emits its own `activate` and the app removes the bar. Prefer the latter (consumer-owned) to keep the bar logic-free. Document whichever is chosen.

### Slots

| Name             | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `icon`           | intent icon (default provided)                                              |
| default / `body` | message text                                                                |
| `title`          | bold lead-in                                                                |
| `actions`        | action buttons + dismiss (the `containerAction`/dismiss is the last button) |

### CSS parts

`icon`, `body`, `title`, `actions`.

### CSS custom properties

`--ty-message-bar-background`, `--ty-message-bar-foreground`, `--ty-message-bar-icon-color`, `--ty-message-bar-border-color`, `--ty-message-bar-radius`. Each intent remaps these.

### Event Semantics

- User-initiated events: `dismiss` — composed, emitted by the bar **only if** the component provides a built-in dismiss affordance; otherwise the consumer's slotted dismiss `tyui-button` emits its own `activate` and the app removes the bar. Prefer the latter (consumer-owned) to keep the bar logic-free. Document whichever is chosen.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: page/section/container announcing status.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                            | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                         | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Message itself is not focusable; links/actions/dismiss buttons follow native Tab order. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                         | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- It's a styled container + ARIA live region — almost no JS. Layout (`singleline`/`multiline`/`auto`) is CSS grid + container query (layout.md), not measurement JS.
- Intent → preset icon + token color, set via attribute, in CSS.
- Dismiss and actions are **separate native buttons** the consumer slots in — the bar itself owns no click behavior.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Message itself is not focusable; links/actions/dismiss buttons follow native Tab order.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: page/section/container announcing status.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Message itself is not focusable; links/actions/dismiss buttons follow native Tab order.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                  | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Message itself is not focusable; links/actions/dismiss buttons follow native Tab order. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                        | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                   | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                             | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Dismiss and actions are separate targets; clicking message body does nothing.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A — MessageBar is rendered status, not a popup.
- Closes on: optional dismiss button or auto-dismiss timer only when configured.
- DOM focus while open: message body is not focusable; actions/dismiss button are normal tab stops.
- Next Tab behavior: native order through links/actions/dismiss button.
- Arrow-key entry behavior: N/A.
- Outside click / pointerdown behavior: does not dismiss.
- Escape behavior: does not dismiss unless focus is on a control that documents Escape.
- Focus restoration on close: if dismissed from the dismiss button, move focus to the next logical region or invoking control when one exists.
- Behavior while enter / exit motion is running: live-region state follows logical visibility, not animation progress.

### Form Contract

- Form-associated: Not form-associated.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated.

### Lifecycle And Cleanup

- External event listeners: Dismiss/action listeners and optional auto-dismiss timers are cleared on dismiss/disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: the bar does not steal focus on appearance (behavior.md: focus moves only on explicit user action). Actions/dismiss are normal tab stops in DOM order. Removing a bar should move focus sensibly (e.g. to the next bar or a documented anchor) — define this.
- **Hit targets**: the bar surface itself is **not** clickable. Each action and the dismiss button is its own focusable target (behavior.md: secondary actions need separate focusable targets). Never make the whole bar a button.
- **Native behavior**: actions are native buttons/links; no custom key handling on the container.
- **State & events**: appearance/intent reflected via attributes; dismissal is user-initiated → emits a public event (from the dismiss button or the bar).
- **Disabled/readonly/loading**: N/A for the bar. It is itself a status surface; use `role="status"`/`alert` per politeness (behavior.md loading/status rule).
- **Motion**: enter/exit handled by `tyui-message-bar-group`, tokenized, `prefers-reduced-motion`-safe, and **no enter animation on page load** (Fluent rule). During exit motion the bar is logically removed — focus/AT must already treat it as gone (behavior.md delayed-unmount rule).

## Layout Contract

- Display: block/flex status bar with icon/content/actions/dismiss regions.
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

| Name             | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `icon`           | intent icon (default provided)                                              |
| default / `body` | message text                                                                |
| `title`          | bold lead-in                                                                |
| `actions`        | action buttons + dismiss (the `containerAction`/dismiss is the last button) |

## Styling Contract

### Public Tokens

`--ty-message-bar-background`, `--ty-message-bar-foreground`, `--ty-message-bar-icon-color`, `--ty-message-bar-border-color`, `--ty-message-bar-radius`. Each intent remaps these.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`icon`, `body`, `title`, `actions`.

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

- `intent="error"`/`"warning"` → assertive-leaning; `intent="info"`/`"success"` → polite. Mapped to `politeness` → `aria-live` (`polite`/`assertive`) + `role="status"` (polite) or `role="alert"` (assertive). behavior.md: `role="status"` polite, `role="alert"` assertive.
- A shared **AriaLive announcer** near the app root is recommended (Fluent) for reliable announcements when bars mount dynamically.
- Dismiss button needs `aria-label="Dismiss"` (icon-only).
- Icon is `aria-hidden` (decorative; meaning is in the text).

### Reference Requirements

- **APG reference**: Pattern: [APG Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) for assertive/important message-bar updates. Polite informational updates use status semantics from ARIA even though APG has no separate Status pattern.
  - Direct requirements:
    - Alert displays a brief important message without interrupting the user's task.
    - Alert appearance must not move keyboard focus.
    - Dynamically rendered alerts are announced by most screen readers, but alerts present before page load may not be announced.
    - Alerts should not disappear automatically too quickly and should not interrupt frequently.
    - If workflow interruption is required, use Alert Dialog, not MessageBar.
- **Fluent UI reference**: Source component: Fluent UI React v9 `MessageBar`.
  - Direct requirements:
    - Configure an `AriaLiveAnnouncer` near the top of the app for reliable `aria-live` announcements.
    - Use MessageBar inside MessageBarGroup when possible.
    - Include a dismiss button as the container action.
    - Reduce number of actions and keep content under about 100 characters.
    - Use preset intents and do not customize politeness without accessibility review.
    - Do not use enter animations on page load; group animation works only when direct children are MessageBars.
    - `bottomReflowSpacer` is discouraged because a MessageBar without actions is not recommended.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- Reliable SR announcement needs the live region present **before** the text changes; dynamically mounting a fresh `role=alert` can be missed — hence the recommended app-level AriaLive announcer.
- `multiline` layout reserves an actions grid area even with no actions (Fluent `bottomReflowSpacer`) — but a bar with no actions is discouraged accessibility-wise; warn.
- Keep content < ~100 chars (Fluent) — long messages belong elsewhere.
- Group animation only works if `tyui-message-bar-group`'s direct children are bars (no wrappers) — document the limitation.
- Don't override politeness casually — assertive interrupts; reserve for errors.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: block/flex status bar with icon/content/actions/dismiss regions remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: severity icon is decorative when text names severity; otherwise provide label.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: severity icon is decorative when text names severity; otherwise provide label.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-message-bar intent="warning">Check your connection.</tyui-message-bar>
```

### Invalid

```html
<tyui-message-bar onclick="retry()">Retry failed</tyui-message-bar>
```

## Agent Guidance

- **Selection guidance** (`ai/components/message-bar.md`): "Use for persistent surface/app status. Square shape for page-level, rounded for component-level. Always include a dismiss action; keep messages short."
- **Alternatives map**: `transient → tyui-toast`, `field error → tyui-field`, `blocking choice → tyui-dialog`, `inline decoration → tyui-badge`.
- **Layout ownership**: bar owns the icon/body/actions grid + responsive single/multi-line switch (container query); **parent owns width and vertical stacking** (via the group). layout.md: container-query, not viewport media query.
- **Token usage**: intent colors via `--ty-message-bar-*`; intent must be conveyed by icon + text, never color alone.
- **Anti-patterns to reject**: clickable bar surface; >3 actions; enter animation on initial page load; color-only intent; long body text; missing dismiss `aria-label`.
- **x-design-system metadata**:
  ```json
  {
    "intent": "status-surface",
    "focusable": false,
    "roles": { "polite": "status", "assertive": "alert" },
    "accessibility": { "needsAriaLiveAnnouncer": true, "dismissNeedsLabel": true },
    "alternatives": { "transient": "tyui-toast", "fieldError": "tyui-field" }
  }
  ```
- **Validation gates**: flag clickable bar; flag color-only intent; flag missing dismiss label; flag enter animation flagged for first paint.

## Tests

### Unit / Contract Tests

| Requirement                                     | Setup                  | Action                                    | Validation                                        |
| ----------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| `role=status` vs `role=alert` mapping           | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Live text announced on dynamic insertion/update | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Dismiss button label and event                  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Actions remain separate tab stops               | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| No clickable host                               | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Color intent paired with icon/text              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| No first-paint enter animation                  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Reduced-motion and forced-colors coverage       | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                            | Setup                                                           | Action                                   | Validation                                                                                          |
| -------------------------------------- | --------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| APG: No focus theft                    | Dynamically add an error MessageBar while focus is in an input. | Wait for announcement.                   | Focus remains in the input; message exposes alert/status semantics                                  |
| APG: Live region reliability           | Configure a shared announcer before adding bars.                | Add and update message text.             | Announcement occurs once and does not depend on a freshly mounted hidden node                       |
| APG: Persistent status                 | Render a warning MessageBar with auto-dismiss.                  | Advance fake timers.                     | Validation fails unless dismissal policy satisfies time-limit requirements and is user controllable |
| APG: Blocking alternative              | Generate a destructive confirmation MessageBar.                 | Run component selection validation.      | Generator selects `tyui-dialog modal-type="alert"` instead of MessageBar                            |
| Fluent UI: Dismiss affordance          | Render a MessageBar with icon-only dismiss.                     | Run accessibility validation.            | Dismiss button has an accessible label and is the container action, not a host click                |
| Fluent UI: Preset intent mapping       | Render info, success, warning, and error intents.               | Inspect roles/live settings and visuals. | Intent maps to documented tokens and live politeness without color-only meaning                     |
| Fluent UI: First-paint animation guard | Render MessageBarGroup on initial page load.                    | Inspect animation state.                 | Enter animation is disabled on initial paint; exit/lifecycle animation remains allowed              |
| Fluent UI: Content/action budget       | Render long body text and four actions.                         | Run design validation.                   | Validation flags long content and excessive actions with dialog/page-content alternatives           |

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

| Area        | Required coverage                                                                      |
| ----------- | -------------------------------------------------------------------------------------- |
| behavior.md | No focus theft on appearance.                                                          |
| behavior.md | Bar surface inert; each action/dismiss is a separate target.                           |
| behavior.md | Status semantics via `role=status`/`alert` + `aria-live`.                              |
| behavior.md | Native buttons/links for actions.                                                      |
| behavior.md | Dismissal user-initiated → public event.                                               |
| behavior.md | Motion tokenized, no load-time enter, reduced-motion safe, logical-closed during exit. |
