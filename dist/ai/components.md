# TYUI Components

## badge

# Badge — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-badge`
- Define: `@toyu-ui/define/badge`
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


## breadcrumb

# Breadcrumb — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-breadcrumb`, `tyui-breadcrumb-item`, `tyui-breadcrumb-divider` (divider may be CSS-generated)
- Define: `@toyu-ui/define/breadcrumb`
- Status: draft
- Native substrate: `<nav>` → `<ol>` → `<li>`, with native `<a href>` (links) / `<button>` (in-app actions) inside each item.
- Shadow DOM: minimal on the root (renders `<nav><ol><slot></slot></ol></nav>`); items are light-DOM `<li>`s so the ordered-list semantics and `aria-current` stay intact. Dividers are decorative (`aria-hidden`), ideally CSS `::before` content rather than elements.
- Category: navigation (composite, roving via focusgroup polyfill in `arrow` mode)
- Component family: navigation
- Pattern type: breadcrumb landmark
- Fluent / reference analogue: see API and Accessibility.

## Intent

Show the user's location in a hierarchy and let them navigate up it.
Do **not** use for unrelated tabs/steps (→ `tyui-tablist`/wizard) or for primary navigation menus (→ `tyui-nav`).

## Selection Guidance

- Use when: hierarchical page/location navigation with one current item.
- Do not use when: steps, tabs, menus, or arbitrary link groups.
- Prefer instead: Tabs for peer views, Menu for commands, Progress/steps for task progress.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Each crumb link is its own navigation target; separators are decorative.

## Composition Contract

- Allowed children: ordered breadcrumb items containing native anchors except the current page.
- Required parent: none; component owns ordered-list navigation semantics.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  `default` (items); per-item: `default` (label), `icon`.
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-breadcrumb><button>Open menu</button><button>Current</button></tyui-breadcrumb>

## API

### tyui-breadcrumb

| Name         | Type                       | Reflects | Default  | Notes                         |
| ------------ | -------------------------- | -------- | -------- | ----------------------------- |
| `size`       | `small \| medium \| large` | yes      | `medium` | item + divider size           |
| `focus-mode` | `tab \| arrow`             | yes      | `tab`    | `arrow` → focusgroup polyfill |

### tyui-breadcrumb-item

| Name      | Type      | Reflects | Default   | Notes                                               |
| --------- | --------- | -------- | --------- | --------------------------------------------------- |
| `current` | `boolean` | yes      | `false`   | sets `aria-current="page"`, removes link affordance |
| `size`    | inherited | yes      | from root |                                                     |

Item content is a native `<a>`/`<button>` (or `tyui-link`). `icon` via a slot.

### Events

None from the breadcrumb itself; navigation is native (`<a>`). Selection is just following a link.

### Slots

`default` (items); per-item: `default` (label), `icon`.

### CSS parts

`list`, `item`, `divider`, `icon`.

### CSS custom properties

`--ty-breadcrumb-gap`, `--ty-breadcrumb-color`, `--ty-breadcrumb-current-color`, `--ty-breadcrumb-divider-color`, `--ty-breadcrumb-font-size`.

### Event Semantics

- User-initiated events: None from the breadcrumb itself; navigation is native (`<a>`). Selection is just following a link.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: none; component owns ordered-list navigation semantics.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                          | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                       | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Native link keyboard behavior only; Tab moves link-to-link and Enter follows anchors. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                       | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- Pure semantic HTML: `nav > ol > li > a`. Screen-reader list semantics and link behavior are **free**.
- `focusMode="tab"` (default) needs **no JS** — each link is a native tab stop.
- `focusMode="arrow"` uses a roving-tabindex composite → implement with the **`focusgroup` polyfill** (native `focusgroup` attribute when supported, JS fallback otherwise). The component does not hand-roll arrow logic.
- Dividers and sizes are CSS only.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Native link keyboard behavior only; Tab moves link-to-link and Enter follows anchors.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: none; component owns ordered-list navigation semantics.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Native link keyboard behavior only; Tab moves link-to-link and Enter follows anchors.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Native link keyboard behavior only; Tab moves link-to-link and Enter follows anchors. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                      | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                 | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                           | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Each crumb link is its own navigation target; separators are decorative.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A — Breadcrumb is inline navigation, not a popup.
- Closes on: N/A.
- DOM focus while open: N/A.
- Next Tab behavior: native sequential focus through links.
- Arrow-key entry behavior: N/A; do not add menu-like arrow navigation.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: decorative transitions must not affect navigation semantics.

### Form Contract

- Form-associated: Not form-associated.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated.

### Lifecycle And Cleanup

- External event listeners: No external listeners; optional ResizeObserver/slotchange for overflow must disconnect on removal.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: `tab` mode → each link is a native tab stop (focus on explicit Tab). `arrow` mode → roving tabindex: one tab stop, arrows move among items (focusgroup). Visible `:focus-visible` ring; distinct from hover/current.
- **Hit targets**: each item exposes exactly one action (navigate). Current item is not a second action. Overflow "…" is its own separate target (a menu trigger), not overloaded onto an item.
- **Native behavior**: native `<a>` activation, modified-click, context menu preserved; no scripted navigation.
- **Composite widgets**: in `arrow` mode it's a roving composite; the root owns the tabindex coordination (behavior.md composite ownership). Children expose minimal state (`current`).
- **State & events**: `current` reflected via `aria-current`. No custom events; following a link is native.
- **Disabled/readonly/loading**: a disabled crumb uses `disabled-focusable` parity (kept focusable with `aria-disabled` in command-bar-like contexts) per behavior.md; otherwise omit it.
- **Motion**: none beyond tokenized hover/focus color transitions.

## Layout Contract

- Display: inline/row navigation list with wrapping or explicit overflow policy.
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

`default` (items); per-item: `default` (label), `icon`.

## Styling Contract

### Public Tokens

`--ty-breadcrumb-gap`, `--ty-breadcrumb-color`, `--ty-breadcrumb-current-color`, `--ty-breadcrumb-divider-color`, `--ty-breadcrumb-font-size`.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`list`, `item`, `divider`, `icon`.

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

- Root: `<nav>` + `aria-label` (required, since there can be multiple navs).
- Structure: `<ol>`/`<li>` native list semantics.
- Current page: `aria-current="page"` on the last item's link; render it as non-link text or a link-to-self.
- Dividers: `aria-hidden="true"` / decorative.
- Overflow ("…"): a `tyui-menu` trigger button labelled e.g. "More breadcrumbs".

### Reference Requirements

- **APG reference**: Pattern: [APG Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/).
  - Direct requirements:
    - Breadcrumb is contained in a navigation landmark.
    - The landmark has `aria-label` or `aria-labelledby`.
    - Breadcrumb items are links to parent pages in hierarchy order.
    - The current page link has `aria-current="page"`; if current page is plain text, `aria-current` is optional.
    - APG defines no breadcrumb-specific keyboard interaction; native link Tab/Enter behavior is preserved.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Breadcrumb`.
  - Direct requirements:
    - `focusMode="tab"` cycles through inner elements with Tab and releases focus after the last item.
    - `focusMode="arrow"` uses Arrow keys to cycle through items.
    - `size` controls item and divider size.
    - `BreadcrumbItem` wraps link/button/non-interactive current content.
    - Overflow uses a Menu trigger with a labelled "more items" button; hidden items become menu links/items.
    - `disabledFocusable` is allowed only for stable order scenarios.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- Last item duplicated as both link and `aria-current` confuses SRs — render current as plain text or self-link with `aria-current="page"` only.
- Overflow collapsing must keep first + last visible and move the middle into a menu; the menu trigger needs its own label and follows `tyui-menu` behavior.
- `arrow` focus mode is the only stateful part — it must degrade to `tab` if the focusgroup polyfill is unavailable (progressive enhancement).
- Dividers as real `<li>`s must be `aria-hidden`; better as CSS so they never enter the a11y tree or focus order.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: inline/row navigation list with wrapping or explicit overflow policy remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: separators are decorative text/icons hidden from assistive tech.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: separators are decorative text/icons hidden from assistive tech.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-breadcrumb
  ><tyui-breadcrumb-item href="/">Home</tyui-breadcrumb-item
  ><tyui-breadcrumb-item current>Docs</tyui-breadcrumb-item></tyui-breadcrumb
>
```

### Invalid

```html
<tyui-breadcrumb><button>Open menu</button><button>Current</button></tyui-breadcrumb>
```

## Agent Guidance

- **Selection guidance** (`ai/components/breadcrumb.md`): "Use for hierarchical location with up-navigation. Always set `aria-label`. Mark the final crumb `current`. Collapse long trails into an overflow menu, not a wrapped row."
- **Alternatives map**: `step progress → wizard`, `peer views → tyui-tablist`, `site nav → tyui-nav`.
- **Layout ownership**: component owns item/divider arrangement + overflow; **parent owns available width**. layout.md: use intrinsic flex + overflow menu, not viewport breakpoints.
- **Token usage**: colors/gaps via `--ty-breadcrumb-*`; current vs link distinguished by more than color (weight/`aria-current`).
- **Anti-patterns to reject**: breadcrumb without `aria-label`; final crumb as an active link with no `aria-current`; focusable dividers; wrapping instead of overflow; arrow mode with no tab fallback.
- **x-design-system metadata**:
  ```json
  {
    "intent": "navigation",
    "composite": true,
    "rovingFocus": "arrow mode (focusgroup-polyfilled)",
    "accessibility": { "requiresAriaLabel": true, "currentItem": "aria-current=page" }
  }
  ```
- **Validation gates**: flag missing `aria-label`; flag last item without `aria-current`; flag focusable dividers; flag arrow mode without focusgroup fallback.

## Tests

### Unit / Contract Tests

| Requirement                                                                  | Setup                  | Action                                    | Validation                                        |
| ---------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Native tab order in tab mode                                                 | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Arrow/Home/End wrapping in arrow mode                                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| `aria-current="page"` on exactly one current item                            | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Divider not focusable or announced                                           | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Overflow target opens separately                                             | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled-focusable item remains in roving order while suppressing activation | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Generated design validation catches missing labels/current state             | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                          | Setup                                                       | Action                                                    | Validation                                                                                                |
| ------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| APG: Labelled navigation landmark    | Render one breadcrumb and another page navigation landmark. | Inspect roles/names.                                      | Breadcrumb exposes a labelled `nav`; missing label fails validation                                       |
| APG: Ordered hierarchical links      | Render Home, Products, Current.                             | Inspect DOM and accessibility tree.                       | Items are in `ol/li` order and links preserve native `href` behavior                                      |
| APG: Current page state              | Mark the final item `current`.                              | Inspect final item.                                       | Exactly one current item has `aria-current="page"` when it is a link; dividers are hidden                 |
| APG: Native keyboard in tab mode     | Render `focus-mode="tab"`.                                  | Press `Tab` and `Enter` on each crumb.                    | Focus follows native link order and activation is native navigation; no custom arrow handling is required |
| Fluent UI: Tab focus mode release    | Render three crumbs in `focus-mode="tab"`.                  | Press `Tab` from before the breadcrumb through it.        | Each interactive crumb receives focus, then focus leaves the breadcrumb after the last crumb              |
| Fluent UI: Arrow focus mode          | Render `focus-mode="arrow"` with four enabled items.        | Focus first item, press ArrowRight, ArrowLeft, Home, End. | Roving focus moves among crumb controls without making dividers focusable                                 |
| Fluent UI: Overflow menu semantics   | Render a collapsed breadcrumb with hidden middle items.     | Activate the overflow trigger.                            | Trigger has an accessible count/name; menu opens with hidden items as real menu links                     |
| Fluent UI: Disabled-focusable parity | Render a disabled focusable crumb in arrow mode.            | Arrow through items and press Enter on the disabled item. | Disabled crumb remains reachable if configured but activation is suppressed and announced disabled        |

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

| Area        | Required coverage                                                               |
| ----------- | ------------------------------------------------------------------------------- |
| behavior.md | Native semantics first → `nav>ol>li>a`, native nav.                             |
| behavior.md | One item = one action; overflow is a separate target.                           |
| behavior.md | Focus: tab stops (tab mode) / roving via focusgroup (arrow mode), visible ring. |
| behavior.md | Composite root owns roving coordination.                                        |
| behavior.md | `current` reflected via `aria-current`; no spurious events.                     |
| behavior.md | Disabled-focusable parity available.                                            |
| behavior.md | Motion tokenized, reduced-motion safe.                                          |


## button

# Button — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-button`
- Define: `@toyu-ui/define/button`
- Status: draft
- Native substrate: native `<button>` as the semantic core. If shadow DOM is used, the host must expose native-equivalent button behavior and delegate activation/state to the internal button.
- Shadow DOM: allowed only when it does not hide button semantics from consumers, trigger wrappers, forms, or accessibility APIs.
- Category: action control
- Component family: native-like control
- Pattern type: APG Button
- Fluent / reference analogue: Fluent UI React v9 `Button`.

## Intent

Use for explicit user actions: submit, save, open, close, toggle, or invoke another component. Button is also the canonical trigger surface for `tyui-dialog`, `tyui-menu`, `tyui-popover`, and `tyui-tooltip`.

Do not use for navigation with a URL (`tyui-link`), selectable data options (`tyui-select` / listbox-like controls), or status-only decoration (`tyui-badge`).

## Selection Guidance

- Use when: the user performs one explicit command or opens one explicitly associated surface.
- Do not use when: the target is navigation, passive status, a menu item with nested controls, or an overloaded target that combines command + navigation + selection.
- Prefer instead: `tyui-link` for URL navigation, `tyui-menu-item-link` inside menus, `tyui-card` actions for card-local commands, native form controls for input.
- Product-level variant preferences: prefer the smallest visual variant that still preserves the target-size token and visible focus.
- One semantic target / one action rule: one button activation emits one command or toggles one owned state/surface.

## Composition Contract

- Allowed children: phrasing text, icons, loading indicator, and visually hidden text. No nested interactive descendants.
- Required parent: none; may be wrapped by `tyui-dialog-trigger`, `tyui-menu-trigger`, or slotted into `tyui-popover` / `tyui-tooltip`.
- Required child components: none.
- Optional child components: icon component, spinner/progress indicator when loading.
- Allowed slots:
  - default: visible label.
  - `icon`: leading/trailing icon.
- Disallowed nested interactive content: links, inputs, other buttons, menu items, or focusable custom elements.
- Composition anti-patterns: `<tyui-button><a href="/details">Details</a></tyui-button>`.
- Trigger compatibility requirement: when used as an overlay trigger, the `tyui-button` host must be the focusable/control surface or must expose a documented trigger adapter that forwards focus, activation, disabled state, accessible name, and ARIA state to the real native button.

## API

### Attributes

| Name                 | Type                                                       | Reflects | Default     | Notes                                                                                 |
| -------------------- | ---------------------------------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------- |
| `appearance`         | `primary \| secondary \| subtle \| transparent \| outline` | yes      | `secondary` | styling only                                                                          |
| `size`               | `small \| medium \| large`                                 | yes      | `medium`    | target and typography tokens                                                          |
| `shape`              | `rounded \| circular \| square`                            | yes      | `rounded`   | styling only                                                                          |
| `disabled`           | `boolean`                                                  | yes      | `false`     | maps to native disabled when host is not focusable                                    |
| `disabled-focusable` | `boolean`                                                  | yes      | `false`     | maps to `aria-disabled="true"` and remains focusable only for documented parity cases |
| `type`               | `button \| submit \| reset`                                | yes      | `button`    | forwarded to native button/form behavior                                              |
| `pressed`            | `boolean \| mixed`                                         | yes      | `undefined` | toggle button mode; exposes `aria-pressed`                                            |
| `loading`            | `boolean`                                                  | yes      | `false`     | inert while pending; exposes busy/loading affordance                                  |
| `icon-position`      | `before \| after`                                          | yes      | `before`    | CSS ordering only                                                                     |

### Properties

Mirror the attributes with typed properties. `pressed` may be `true`, `false`, `"mixed"`, or `undefined`.

### Events

- `activate` — composed; dispatched only for user activation after native click/keyboard activation succeeds. Includes `{ source: "click" | "keyboard" | "form" }` when the source is known.
- Native `click` must retain normal timing and cancelability. Do not replace it with a custom-only event.

### Event Semantics

- User-initiated events: native `click` plus `activate` when activation is not canceled and button is not disabled/aria-disabled.
- Programmatic state changes that must not emit user events: setting `pressed`, `disabled`, `loading`, or trigger ARIA programmatically.
- Native events that are re-dispatched: do not re-dispatch native `click`; let native event propagation work from the host or internal button adapter.
- Internal coordination events: trigger wrappers may listen to native-equivalent activation/focus and should not require private button internals.
- Cancellation behavior: if a consumer cancels the native activation path, `activate` and trigger open should not fire.

### Slots

| Name    | Description                   | Fallback | Slotted Styling Rules                     |
| ------- | ----------------------------- | -------- | ----------------------------------------- |
| default | visible button label          | none     | phrasing content only                     |
| `icon`  | decorative or meaningful icon | none     | icon is decorative when label text exists |

### CSS Parts

| Name      | Description                                       | Allowed Use                             | Required State Qualifiers                             |
| --------- | ------------------------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| `control` | internal native button if shadow DOM is used      | spacing, layout, focus ring integration | must mirror disabled, pressed, loading, focus-visible |
| `label`   | internal wrapper around the default label content | text overflow and alignment             | must preserve accessible-name content                 |

### CSS Custom Properties

`--ty-button-background`, `--ty-button-foreground`, `--ty-button-border-color`, `--ty-button-radius`, `--ty-button-padding-inline`, `--ty-button-min-block-size`, `--ty-button-gap`, `--ty-button-focus-ring`.

### Styling State Surface

| State    | Surface                                                    | Public | Notes                                                                        |
| -------- | ---------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| Disabled | `disabled` or `aria-disabled` on host/native button        | Yes    | native disabled removes from tab order; disabled-focusable remains focusable |
| Pressed  | `pressed` host attribute + `aria-pressed`                  | Yes    | toggle mode only                                                             |
| Loading  | `loading` host attribute + busy/inert styling              | Yes    | activation suppressed while loading                                          |
| Focus    | `:focus-visible` on host or forwarded from internal button | Yes    | must work when used as trigger                                               |

## Behavior

### State Model

- Controlled state: `disabled`, `disabled-focusable`, `pressed`, `loading`, `appearance`, `size`, `shape`, and `type`.
- Uncontrolled / default state: default type is `button`; no implicit toggle unless `pressed` is supplied.
- Derived internal state: `aria-pressed`, `aria-disabled`, loading spinner visibility, and trigger ARIA forwarded by owning components.
- Parent-owned state: overlay open state remains owned by `tyui-dialog`, `tyui-menu`, or `tyui-popover`; button only invokes it.
- Child-owned state: slotted icon/text has no behavior.
- Programmatic update behavior: update DOM/ARIA without firing `click` or `activate`.
- User update behavior: native activation emits click and then `activate` if not canceled.
- State reset behavior: native form reset applies only when button participates in a form context.

### State Transition Matrix

| Current State      | User / Programmatic Action | Next State                                             | Event                           | Focus Result                                            | Notes                                 |
| ------------------ | -------------------------- | ------------------------------------------------------ | ------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| Enabled            | Click / Enter / Space      | Activated                                              | native `click`, then `activate` | Focus remains on button unless invoked surface moves it | APG Button behavior.                  |
| Toggle enabled     | Click / Enter / Space      | `pressed` toggles when uncontrolled toggle mode exists | native `click`, `activate`      | Focus remains on button                                 | Reflect `aria-pressed`.               |
| Disabled           | Click / keyboard           | unchanged                                              | none                            | not focusable                                           | Native disabled behavior.             |
| Disabled-focusable | Click / keyboard           | unchanged                                              | none                            | remains focusable                                       | `aria-disabled="true"` parity case.   |
| Loading            | Click / keyboard           | unchanged                                              | none                            | focus remains if already focused                        | Loading suppresses duplicate actions. |

### Native Behavior First

- Native element used: internal or host-level native `<button>`.
- Native behavior preserved: Enter/Space activation, click event timing, focus behavior, disabled behavior, form `type`, and accessible name computation.
- Custom behavior added: design-system styling, optional pressed/loading state, composed `activate`, and trigger adapter surface for overlays.
- Why custom behavior is necessary: styling/API parity and cross-shadow trigger compatibility that plain `<button>` cannot guarantee when wrapped in a custom element.

### Focus Model

- Focus owner: the button host must be focusable, or focus must delegate to the internal native button in a way that trigger wrappers can observe.
- `delegatesFocus`: allowed only if focus-visible styling and trigger focus checks still work from the host.
- Tabbable elements: exactly one focusable target.
- Roving tabindex: N/A.
- Active descendant: N/A.
- Focus restoration: owning overlay restores focus to the button host or documented internal focus proxy.
- Focus trap: N/A.
- Focus-visible treatment: keyboard focus must be visible on the public button surface.
- Pointer focus treatment: native pointer focus behavior only; do not move focus on hover.

### Keyboard Contract

| Key             | Context                | Action                                 | Prevent Default | Event           | Notes                                        |
| --------------- | ---------------------- | -------------------------------------- | --------------- | --------------- | -------------------------------------------- |
| Enter           | focused enabled button | Activate                               | native default  | click, activate | Must also invoke overlay trigger wrappers.   |
| Space           | focused enabled button | Press/activate on native button timing | native default  | click, activate | Preserve native button timing.               |
| Tab / Shift+Tab | sequential navigation  | Enter/leave button                     | no              | none            | Exactly one tab stop.                        |
| Escape          | focused button         | no button behavior                     | no              | none            | Owning overlay may handle Escape after open. |

### Pointer And Hit Target Contract

- Primary hit target: the button host/visual surface.
- Secondary hit targets: none inside the button.
- Hover behavior: style only.
- Pressed / active behavior: native active plus optional toggle `pressed`.
- Minimum target size: maintain design-system minimum target token.
- Touch / pen considerations: same activation as click; no hover-only behavior.
- Overloaded-target risks: reject nested links/buttons and mixed navigation/action semantics.

### Popup / Overlay Contract

- Opens on: only when an owning trigger wrapper or slotted trigger role listens to button activation.
- Closes on: owned by the overlay component.
- DOM focus while open: owned by the overlay component; the opener must remain restorable.
- Next Tab behavior: owned by the overlay component.
- Arrow-key entry behavior: owned by menu/toolbar/composite components.
- Outside click / pointerdown behavior: owned by the overlay component.
- Escape behavior: owned by the overlay component.
- Focus restoration on close: overlay restores focus to the `tyui-button` host or focus proxy.
- Behavior while enter / exit motion is running: button remains the stable invoker target; motion never changes activation semantics.

### Form Contract

- Form-associated: either use a real native button in light DOM or implement form association so `type=submit/reset/button` behaves like native.
- Submitted value: N/A unless a future `name`/`value` API is added.
- `FormData` behavior: native submit/reset behavior only.
- Validity states: N/A.
- `checkValidity()` / `reportValidity()`: N/A.
- Name propagation: N/A unless `name`/`value` are added.
- Required / readonly / disabled behavior: required/readonly N/A; disabled follows native disabled; disabled-focusable uses `aria-disabled`.

### Lifecycle And Cleanup

- External event listeners: trigger adapters, form listeners, and native button listeners clean up on disconnect.
- Observers: N/A unless slot validation or form association requires them.
- Timers: N/A except loading debounce owned by app; component must not create hidden retry timers.
- Generated IDs: only for trigger/ARIA relationships when the owner does not supply ids; stable across renders.
- Slotchange work: validate no nested interactive descendants and update icon-only accessible-name requirements.
- Cleanup requirements: remove listeners/adapters; do not leak overlay trigger references.

### Current Behavior Commitments

- Button must be usable anywhere a native button is expected by TYUI trigger wrappers.
- Trigger wrappers must not need to pierce private shadow DOM to listen for activation or assign ARIA.
- The host must accept or reflect `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-describedby`, `aria-labelledby`, and `aria-pressed` without clobbering consumer-provided accessible names/descriptions.
- If native `popovertarget` / `commandfor` cannot be supported on the host, the button must expose a documented JS/event adapter used by overlay components.
- Disabled and loading buttons never open overlays or emit `activate`.

## Layout Contract

- Display: inline-flex control with intrinsic label width and tokenized minimum block size.
- Intrinsic size: content plus icon gap and padding tokens.
- Shrink policy: label may truncate only in documented constrained variants.
- Wrap policy: no wrap by default.
- Minimum target token: public target-size token.
- Minimum visual target: visual affordance may be smaller only if hit target remains intact.
- Flexible slots: default label.
- Fixed slots: icon. Loading indicator support requires a future documented slot or part before consumers can target it structurally.
- Parent owns: placement, margins, button groups.
- Component owns: internal alignment, gap, padding, focus ring, loading overlay.
- Container-query thresholds: N/A.
- Scroll / overflow policy: no internal scroll.
- Top-layer / popover policy: N/A; button invokes but does not own top layer.

### Regions / Slots

| Region / Slot      | Flex | Min Inline Size | Wraps | Scrolls | Notes                      |
| ------------------ | ---- | --------------- | ----- | ------- | -------------------------- |
| default            | 1    | content         | no    | no      | label text                 |
| icon               | 0    | icon token      | no    | no      | before/after               |
| loading affordance | 0    | component token | no    | no      | future implementation only |

## Styling Contract

### Public Tokens

Use `--ty-button-*` tokens for background, foreground, border, radius, padding, gap, focus ring, icon size, and min block size. Variants remap tokens rather than duplicating rule blocks.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API.

### CSS Parts

`control` and `label` when shadow DOM is used. The slotted `icon` is consumer-owned light DOM, not a CSS part. If no shadow DOM is used, parts are N/A and host attributes/pseudo-classes are the public styling surface.

### Styling State Surface

| State                    | Surface                                | Public | Notes                           |
| ------------------------ | -------------------------------------- | ------ | ------------------------------- |
| appearance/size/shape    | host attributes                        | Yes    | styling only                    |
| disabled/loading/pressed | host attributes + ARIA/native state    | Yes    | semantic state                  |
| focus-visible            | host or internal part mirrored to host | Yes    | must be visible for trigger use |

- Forced-colors behavior: visible border/focus indicator and text/icon contrast.
- Reduced-motion behavior: loading/pressed transitions simplify without changing state.
- App-variant hooks: public tokens and documented parts only.

## Accessibility

- Role: native button role from `<button>` or host-equivalent semantics.
- Accessible name: visible text, `aria-label`, `aria-labelledby`, or tooltip `relationship="label"` for icon-only buttons.
- ARIA attributes: preserve consumer/trigger ARIA including `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-describedby`, `aria-labelledby`, `aria-pressed`, and `aria-disabled`.
- ARIA relationships: must work when the button is used as trigger for dialog/menu/popover/tooltip.
- Label / description source: slotted label text, ARIA, or tooltip relationship.
- Consumer ARIA preservation: trigger wrappers append/merge description tokens instead of replacing unrelated consumer ARIA.
- Shadow-boundary ARIA mirroring: if the internal button receives ARIA, the host must still expose the expected relationship or provide an explicit adapter.
- Decorative content: icon is hidden when text label exists.
- Disabled vs disabled-focusable behavior: native disabled removes from tab order; disabled-focusable uses `aria-disabled` and suppresses activation.
- Loading / status semantics: loading suppresses activation and may expose `aria-busy` if the button itself communicates pending state.
- Screen reader expectations: announces as button/toggle button; icon-only buttons have a non-empty name.
- High contrast expectations: state and focus remain visible without color-only cues.

### Reference Requirements

- **APG reference**: [APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
  - Direct requirements:
    - Button has role `button` through native semantics.
    - Enter and Space activate the button.
    - Toggle button exposes `aria-pressed`.
    - Accessible name is present and stable.
- **Fluent UI reference**: Fluent UI React v9 `Button`.
  - Direct requirements:
    - Supports appearance, size, shape, icon, icon position, disabled, disabled-focusable, and loading-like pending states.
    - Icon-only buttons require accessible labels.
    - Buttons can be used as trigger children when required props/ref/ARIA/event handlers are applied.
    - Disabled/loading buttons do not perform actions.

### Accessibility Guidance

- Do: use native button behavior, preserve one target/one action, and expose a stable public focus/ARIA surface.
- Do not: require overlay components to inspect private shadow DOM; do not hide the real focus target from tests or assistive tech.
- Author responsibilities: provide visible text or accessible name, choose the right component for navigation, and avoid nested interactive children.
- Known tradeoffs: native `popovertarget` and `commandfor` are real-button features; `tyui-button` must either make the host equivalent or provide an adapter.

## Motion Contract

- Motion tokens: press, hover, loading, and focus transitions only.
- CSS-only motion: preferred.
- Reduced-motion behavior: remove decorative transitions and spinner flourish while keeping loading semantics.
- Delayed unmount behavior: N/A.
- Interaction behavior during motion: activation state follows input, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and theme motion tokens.

## Icons And Media

- Icon source: design-system icon component or slotted SVG.
- Icon accessible name policy: icon is decorative when visible label exists; icon-only button requires `aria-label`, `aria-labelledby`, or tooltip label relationship.
- Decorative icon policy: `aria-hidden="true"` when duplicate of text.
- Media slot behavior: icons only; no arbitrary media.
- Media cloning behavior: do not clone slotted icons.
- Image fallback behavior: N/A.

## Examples

### Storybook Examples

```html story title="Default"
<tyui-button>Save changes</tyui-button>
```

```html story title="Appearance Matrix"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button>default</tyui-button>
  <tyui-button appearance="primary">primary</tyui-button>
  <tyui-button appearance="outline">outline</tyui-button>
  <tyui-button appearance="subtle">subtle</tyui-button>
  <tyui-button appearance="transparent">transparent</tyui-button>
</div>
```

```html story title="Size Matrix"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button size="small">small</tyui-button>
  <tyui-button size="medium">medium</tyui-button>
  <tyui-button size="large">large</tyui-button>
</div>
```

```html story title="Shape Matrix"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button shape="rounded">rounded</tyui-button>
  <tyui-button shape="circular">circular</tyui-button>
  <tyui-button shape="square">square</tyui-button>
</div>
```

```html story title="With Icon"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button appearance="primary">
    <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
      <path
        fill="currentColor"
        d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      ></path>
    </svg>
    Search
  </tyui-button>
  <tyui-button icon-position="after">
    Next
    <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
      <path
        fill="currentColor"
        d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      ></path>
    </svg>
  </tyui-button>
  <tyui-button appearance="subtle" aria-label="Search">
    <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
      <path
        fill="currentColor"
        d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      ></path>
    </svg>
  </tyui-button>
</div>
```

```html story title="Disabled States"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button disabled>Disabled</tyui-button>
  <tyui-button disabled-focusable>Focusable disabled</tyui-button>
  <tyui-button appearance="primary" disabled>Primary disabled</tyui-button>
</div>
```

### Design Examples

```html design title="Atmospheric Glass"
<div
  data-design-system="atmospheric-glass"
  style="box-sizing:border-box;min-height:360px;padding:40px;display:flex;align-items:center;justify-content:center;"
>
  <section
    class="ty-glass-surface"
    data-elevation="elevated"
    data-shine="true"
    style="box-sizing:border-box;width:min(100%,720px);padding:28px;display:grid;gap:20px;"
  >
    <div style="display:grid;gap:8px;">
      <div class="ty-metric-label">Atmospheric Glass</div>
      <div style="font-size:28px;font-weight:700;line-height:1.15;">Command surfaces</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      <tyui-button appearance="primary">Start session</tyui-button>
      <tyui-button appearance="subtle">Tune forecast</tyui-button>
      <tyui-button appearance="transparent">
        <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
          ></path>
        </svg>
        Explore
      </tyui-button>
    </div>
  </section>
</div>
```

```html design title="Fluent Web"
<div
  data-design-system="fluent-web"
  style="box-sizing:border-box;min-height:360px;padding:32px;background:var(--ty-color-background);"
>
  <section
    class="ty-fluent-panel"
    data-elevation="raised"
    style="box-sizing:border-box;width:min(100%,760px);padding:20px;display:grid;gap:18px;"
  >
    <div style="display:grid;gap:4px;">
      <div class="ty-fluent-title">Fluent Web commands</div>
      <div class="ty-fluent-caption">
        Neutral surfaces, compact spacing, and a single brand-blue primary action.
      </div>
    </div>
    <div class="ty-fluent-toolbar">
      <tyui-button appearance="primary">Save changes</tyui-button>
      <tyui-button>Preview</tyui-button>
      <tyui-button appearance="subtle">
        <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
          ></path>
        </svg>
        Find
      </tyui-button>
      <tyui-button appearance="transparent">Cancel</tyui-button>
    </div>
    <div class="ty-fluent-toolbar">
      <tyui-button size="small">Small</tyui-button>
      <tyui-button size="medium">Medium</tyui-button>
      <tyui-button size="large">Large</tyui-button>
      <tyui-button shape="circular" aria-label="Search">
        <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
          ></path>
        </svg>
      </tyui-button>
    </div>
  </section>
</div>
```

### Valid

```html
<tyui-popover>
  <tyui-button slot="trigger" aria-haspopup="dialog">Details</tyui-button>
  <div slot="surface">More information</div>
</tyui-popover>
```

### Invalid

```html
<tyui-button><a href="/details">Details</a></tyui-button>
```

## Agent Guidance

- **Selection guidance**: use `tyui-button` for commands and trigger invocation, not URL navigation.
- **Alternatives map**: `navigation -> tyui-link`, `menu item -> tyui-menu-item`, `status -> tyui-message-bar`, `selection -> tyui-select`.
- **Layout ownership**: button owns internal spacing and min target; parent owns grouping and placement.
- **Token usage**: theme through `--ty-button-*`, never literal colors.
- **Anti-patterns to reject**: missing accessible name, nested interactive content, onclick navigation, disabled button that still opens an overlay, custom trigger that fails ARIA/focus restoration.
- **Validation gates**: flag icon-only without name, nested interactive descendants, no host-level activation surface, missing trigger adapter support, disabled/loading trigger activation.

## Tests

### Unit / Contract Tests

| Requirement              | Setup                                                                                                     | Action                                            | Validation                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Native activation parity | Render enabled `tyui-button`.                                                                             | Press Enter, press Space, click.                  | Native `click` and `activate` fire once per user activation in native timing.                              |
| Disabled suppression     | Render `disabled` and `disabled-focusable` buttons.                                                       | Click and press Enter/Space.                      | No `click`, `activate`, or overlay open occurs; disabled-focusable remains focusable with `aria-disabled`. |
| Loading suppression      | Render `loading`.                                                                                         | Click and press Enter/Space.                      | No activation fires; loading state is exposed visually and semantically.                                   |
| Toggle semantics         | Render `pressed=false`.                                                                                   | Activate.                                         | `aria-pressed` and reflected pressed state update according to toggle contract.                            |
| ARIA passthrough         | Set `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-describedby`, and `aria-labelledby` on host. | Inspect host/internal control.                    | Relationships are preserved and exposed on the actual accessible button.                                   |
| Trigger adapter surface  | Wrap in each trigger component.                                                                           | Attach listeners/ARIA through public trigger API. | Trigger wrapper does not need private shadow DOM access.                                                   |

### Browser E2E Tests

| Requirement                 | Setup                                                       | Action                                                 | Validation                                                                                                        |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Popover trigger             | Render `tyui-popover` with `tyui-button slot="trigger"`.    | Tab to button, press Enter/Space, click, press Escape. | Popover opens/closes, `aria-expanded` syncs, and focus returns to the `tyui-button`.                              |
| Menu trigger                | Render `tyui-menu-trigger` containing `tyui-button`.        | Press Enter, Space, ArrowDown, Escape.                 | Menu opens, roving focus enters as documented, Escape returns focus to the button.                                |
| Dialog trigger              | Render `tyui-dialog` with `tyui-button slot="trigger"`.     | Press Enter/click, then close with Escape/action.      | Dialog opens via native-equivalent activation, traps focus, and restores focus to `tyui-button`.                  |
| Tooltip trigger             | Render `tyui-tooltip` wrapping `tyui-button`.               | Focus, hover, press Escape.                            | Tooltip shows/hides, relationship ARIA is applied to the accessible button, and focus never moves to the tooltip. |
| Disabled trigger end-to-end | Render disabled/loading `tyui-button` in each trigger role. | Click and press Enter/Space.                           | No dialog/menu/popover/tooltip activation occurs, and no stale `aria-expanded` remains true.                      |

### Accessibility Tests

| Requirement                        | Setup                                                         | Action                                         | Validation                                                                                              |
| ---------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| APG: Button name and role          | Render text, icon-only, and labelled buttons.                 | Inspect accessibility tree.                    | Each exposes role button and a non-empty name when required.                                            |
| APG: Keyboard activation           | Focus enabled button.                                         | Press Enter and Space.                         | Activation matches native/APG button behavior.                                                          |
| APG: Toggle button                 | Render pressed button.                                        | Activate.                                      | `aria-pressed` reflects true/false/mixed contract.                                                      |
| Fluent UI: Icon-only label         | Render icon-only button without accessible label.             | Run validation.                                | Validation fails until `aria-label`, `aria-labelledby`, or tooltip label relationship is present.       |
| Fluent UI: Custom trigger contract | Use `tyui-button` as trigger for Popover/Menu/Dialog/Tooltip. | Run accessibility checks after open and close. | Trigger ARIA, accessible name/description, focus restoration, and disabled behavior all remain correct. |

### Visual And Contrast Tests

| Requirement                    | Setup                                                     | Action                               | Validation                                                         |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| Focus/hover/active distinction | Render all appearances in normal and forced-colors modes. | Hover, focus via keyboard, press.    | Focus is visible and distinct from hover/active/pressed.           |
| Tokenized variants             | Render sizes, shapes, icon positions, loading, pressed.   | Inspect computed styles.             | Public tokens drive variants; no literal colors required.          |
| Reduced motion                 | Enable `prefers-reduced-motion`.                          | Trigger loading/pressed transitions. | Motion is removed or simplified without changing activation state. |

### Generated Design / AI Contract Tests

| Requirement                     | Setup                                                    | Action                    | Validation                                                                            |
| ------------------------------- | -------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| Valid trigger generation        | Ask generator for a popover/menu/dialog/tooltip trigger. | Inspect generated markup. | Uses `tyui-button` or native `<button>` with the documented trigger adapter and ARIA. |
| Navigation anti-pattern         | Ask for a button that opens `/details`.                  | Run design validation.    | Validation rejects and suggests `tyui-link`.                                          |
| Nested interactive anti-pattern | Ask for link/input inside button.                        | Run design validation.    | Validation rejects nested interactive content.                                        |

### Coverage Checklist

| Area        | Required coverage                                                                     |
| ----------- | ------------------------------------------------------------------------------------- |
| behavior.md | Focus moves only on explicit action; button has exactly one tab stop.                 |
| behavior.md | One target = one action; no nested interactive descendants.                           |
| behavior.md | Native button semantics first; custom trigger adapter only preserves native behavior. |
| behavior.md | User activation emits public events; programmatic state changes are silent.           |
| behavior.md | Disabled/loading suppress activation; disabled-focusable is explicit.                 |
| behavior.md | Motion decorates state and never decides activation.                                  |


## card

# Card — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-card` (+ `tyui-card-header`, `tyui-card-footer`, `tyui-card-preview` as light structural slots/elements)
- Define: `@toyu-ui/define/card`
- Status: draft
- Native substrate: `<article>` (or `<div role="group">`); selectable cards use a **native `<input type="checkbox">`** in the floating-action slot; a primary-action card uses a native `<a>`/`<button>` overlay.
- Shadow DOM: minimal (root renders the appearance container + `<slot>`s for preview/header/body/footer). Content stays light-DOM for headings/links.
- Category: container (optionally selectable / interactive — composite focus modes)
- Component family: composition surface
- Pattern type: non-interactive group by default; conditional button/checkbox only when opted in
- Fluent / reference analogue: see API and Accessibility.

## Intent

Group information and actions about a single concept (a document, a contact).
Do **not** turn an entire card into one giant button when it contains its own links/buttons — that violates hit-target separation. Use a clear primary action or a selection checkbox instead.

## Selection Guidance

- Use when: group related content and optional separate actions in a bounded surface.
- Do not use when: overload the whole card with navigation, selection, expand, and secondary actions at once.
- Prefer instead: Button/Link for a single action, Checkbox/Listbox for selection, Dialog/Popover for disclosure.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: One primary target per mode; secondary actions must be separate focusable controls.

## Composition Contract

- Allowed children: header/media/body/footer/actions slots; interactive children allowed only as separate targets.
- Required parent: none; a list/grid parent may own card selection.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  `floating-action`, `preview`, `header`, default (body), `footer`. Header sub-slots: `image`, `header` (title), `description`, `action`.
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-card onclick="open()"><button>Delete</button><a href="/details">Details</a></tyui-card>

## API

### tyui-card

| Name               | Type                                                | Reflects | Default    | Notes                                   |
| ------------------ | --------------------------------------------------- | -------- | ---------- | --------------------------------------- |
| `appearance`       | `filled \| filled-alternative \| outline \| subtle` | yes      | `filled`   | token remap                             |
| `orientation`      | `vertical \| horizontal`                            | yes      | `vertical` |                                         |
| `size`             | `small \| medium \| large`                          | yes      | `medium`   | radius + inner gap                      |
| `focus-mode`       | `off \| no-tab \| tab-exit \| tab-only`             | yes      | `off`      | composite focus (focusgroup + trap)     |
| `selected`         | `boolean`                                           | yes      | `false`    | controlled selection (mirrors checkbox) |
| `default-selected` | `boolean`                                           | no       | `false`    | uncontrolled initial                    |
| `disabled`         | `boolean`                                           | yes      | `false`    | disables card selection (not children)  |

### Events

- `selection-change` — composed; emitted on user selection toggle, payload `{ selected }`. Programmatic `selected` set emits nothing.

### Slots

`floating-action`, `preview`, `header`, default (body), `footer`. Header sub-slots: `image`, `header` (title), `description`, `action`.

### CSS parts

`root`, `preview`, `header`, `footer`, `checkbox`.

### CSS custom properties

`--ty-card-background`, `--ty-card-border-color`, `--ty-card-radius`, `--ty-card-padding`, `--ty-card-gap`, `--ty-card-shadow`. Appearances remap.

### Event Semantics

- User-initiated events: - `selection-change` — composed; emitted on user selection toggle, payload `{ selected }`. Programmatic `selected` set emits nothing.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: none; a list/grid parent may own card selection.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                         | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                                      | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Default card has no keyboard model; actionable/selectable modes use native button/checkbox behavior. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                                      | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- Default card = a styled `<article>` container. **No JS** for the common, non-interactive case.
- Selection = a real `<input type=checkbox>` (native checked state, label, keyboard) placed in the `floating-action`/`checkbox` slot; the card reflects `selected` from it. No scripted selection model for single cards.
- Interactive focus modes (Fluent `no-tab`/`tab-exit`/`tab-only`) are a roving/focus-trap composite → use the **focusgroup polyfill** + a small focus-trap helper; treat as opt-in, default `focus-mode="off"`.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Default card has no keyboard model; actionable/selectable modes use native button/checkbox behavior.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: none; a list/grid parent may own card selection.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Default card has no keyboard model; actionable/selectable modes use native button/checkbox behavior.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                               | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Default card has no keyboard model; actionable/selectable modes use native button/checkbox behavior. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                                     | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                                | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                          | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: One primary target per mode; secondary actions must be separate focusable controls.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A for default cards. If a card action opens a popup, that popup component owns the overlay contract.
- Closes on: N/A.
- DOM focus while open: N/A.
- Next Tab behavior: follows native order among separate controls inside the card.
- Arrow-key entry behavior: N/A unless an owning list/grid pattern defines it.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: card visual transitions never change selection/action semantics.

### Form Contract

- Form-associated: Selectable mode may submit via an owning form-control pattern only when explicitly implemented.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Selectable mode may submit via an owning form-control pattern only when explicitly implemented.

### Lifecycle And Cleanup

- External event listeners: No external listeners; slotchange validation for illegal interactive descendants must disconnect on removal.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: default card is not focusable. `focus-mode` variants create a focus scope: `no-tab` traps with Enter, releases on Escape; `tab-exit` releases on Tab past the last child; `tab-only` rovers through children. Implemented via focusgroup + trap helper. Focus enters only on explicit Enter/Tab. Visible ring distinct from `selected`.
- **Hit targets**: **the key rule** — a card with interior links/buttons must NOT also be one big button. Choose one model: (a) non-interactive container, (b) a single primary-action overlay link/button (with inner actions as separate targets that stop propagation), or (c) selection via the checkbox. behavior.md: do not combine navigation + selection + child actions on one target.
- **Native behavior**: selection is a native checkbox; actions are native buttons/links; the card adds grouping/focus scope only.
- **Composite widgets**: in focus modes the card owns the focus scope/roving; child actions remain independent targets. It ignores events from nested composites (e.g. a menu in the header `action` slot).
- **State & events**: `selected` reflected for styling; user toggle emits `selection-change`. Hover is a visual state only (no selection on hover).
- **Disabled/readonly/loading**: `disabled` disables card-level selection but **not** child controls (Fluent). No readonly. Loading content uses skeletons inside, not a card-level busy.
- **Motion**: hover/selected elevation transitions tokenized, reduced-motion safe.

## Layout Contract

- Display: block/card surface; component owns padding/radius/elevation, parent owns grid/list placement.
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

`floating-action`, `preview`, `header`, default (body), `footer`. Header sub-slots: `image`, `header` (title), `description`, `action`.

## Styling Contract

### Public Tokens

`--ty-card-background`, `--ty-card-border-color`, `--ty-card-radius`, `--ty-card-padding`, `--ty-card-gap`, `--ty-card-shadow`. Appearances remap.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`root`, `preview`, `header`, `footer`, `checkbox`.

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

- Default: `role="group"` (Fluent default). For a titled card, wrap the title in a real heading (`<h2>`–`<h4>`) chosen by context.
- Focusable card (`focus-mode` ≠ off): provide `aria-label`/`aria-labelledby` + `aria-describedby` covering the key inner text (Fluent requirement), since the group becomes a focus target.
- Selectable: the checkbox carries `checked`; the card reflects `selected` (host attribute) for styling, not as the a11y source of truth.

### Reference Requirements

- **APG reference**: Pattern: N/A for the default container. APG has no Card pattern. Conditional mappings apply only when Card opts into a single interaction model: [APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) for a single primary action and [APG Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) for selectable cards.
  - Direct requirements:
    - A non-interactive card is a labelled group/container and has no APG widget keyboard model.
    - A primary-action card preserves native button/link activation and never also exposes independent inner controls on the same target.
    - A selectable card uses a checkbox with an accessible label and `checked` state as the source of truth.
    - Card implementations must not combine navigation, selection, and child actions into one overloaded target.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Card`.
  - Direct requirements:
    - Default card role is `group`.
    - Focusable cards need meaningful `aria-label` or `aria-labelledby` plus `aria-describedby` covering relevant internal text.
    - Larger cards with one title use a heading whose level is chosen by page context.
    - `focusMode` supports `off`, `no-tab`, `tab-exit`, and `tab-only`.
    - `disabled` disables card-level interaction and selection but does not automatically disable slotted child controls.
    - `selected`, `defaultSelected`, and `onSelectionChange` apply only to selectable cards.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- "Clickable card with inner buttons" is the classic accessibility trap. Document the three allowed patterns and forbid wrapping the whole card in an anchor when it has interactive children.
- Selection truth lives on the checkbox; `selected` host attribute is derived — keep them in sync but don't double-fire events.
- Title must be a real heading for document outline; the level is context-dependent (can't hardcode).
- Focus modes are powerful but heavy; default off and only enable when the whole card is a single navigable unit with no competing inner targets (which then conflicts with inner buttons — pick one).

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: block/card surface; component owns padding/radius/elevation, parent owns grid/list placement remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: media slot supports image/icon content with author-provided alternatives.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: media slot supports image/icon content with author-provided alternatives.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-card
  ><h3>Quarterly report</h3>
  <p>Updated today</p>
  <tyui-button slot="actions">Open</tyui-button></tyui-card
>
```

### Invalid

```html
<tyui-card onclick="open()"><button>Delete</button><a href="/details">Details</a></tyui-card>
```

## Agent Guidance

- **Selection guidance** (`ai/components/card.md`): "Use as a content container. If the card is a single navigable unit, use one primary action; if it has multiple inner actions, keep the card non-interactive (or selectable via checkbox). Never wrap a multi-action card in one button/anchor."
- **Alternatives map**: `single nav target → primary-action card / tyui-link`, `pick from many → selectable cards (checkbox)`, `list rows → tyui-table`.
- **Layout ownership**: card owns inner padding/gap and preview/header/footer arrangement; **parent owns grid placement and width** (layout.md intrinsic grid `auto-fit minmax`). Card height is `fit-content`, never fixed.
- **Token usage**: appearance/elevation via `--ty-card-*`; `filled-alternative` for light surfaces (contrast).
- **Anti-patterns to reject**: whole-card anchor/button wrapping interactive children; selection on hover; fixed card height; title not a heading; `disabled` cascading to children.
- **x-design-system metadata**:
  ```json
  {
    "intent": "container",
    "focusable": "only with focus-mode",
    "interactionModels": ["non-interactive", "single-primary-action", "selectable-checkbox"],
    "accessibility": { "role": "group", "focusableNeedsLabel": true, "titleIsHeading": true }
  }
  ```
- **Validation gates**: flag a card wrapped in a single button/anchor that also contains buttons/links; flag hover-selection; flag focusable card without label; flag fixed heights.

## Tests

### Unit / Contract Tests

| Requirement                                                                                    | Setup                  | Action                                    | Validation                                        |
| ---------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Invalid overloaded-card examples                                                               | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Title heading/accessible name                                                                  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Selectable card checkbox toggles by pointer and keyboard and emits composed `selection-change` | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Programmatic `selected` is silent                                                              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Focus-mode keyboard entry/exit                                                                 | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Fixed-height and hover-selection rejected by design validation                                 | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Forced-colors focus/selection visible without color alone                                      | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                                       | Setup                                                                        | Action                                                 | Validation                                                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| APG: Default card is not a widget                 | Render a card with text and a heading only.                                  | Press `Tab` through the page.                          | Card host is skipped unless explicitly focusable; no button, checkbox, or grid role is invented                     |
| APG: Primary action follows Button/Link semantics | Render a card with exactly one primary overlay button or link.               | Press `Enter` and `Space` when focused.                | Button action uses Enter/Space; link action preserves native link behavior; no inner competing controls are present |
| APG: Selectable card follows Checkbox semantics   | Render a selectable card with a checkbox target.                             | Focus checkbox and press `Space`.                      | Checkbox toggles, exposes checked state, and card reflects `selected` for styling only                              |
| APG: Overloaded card is invalid                   | Render a whole-card click handler plus inner buttons and a checkbox.         | Run design validation.                                 | Validation rejects the card and requires one interaction model                                                      |
| Fluent UI: Focusable card labelling               | Render `focus-mode="tab-only"` without a label.                              | Run accessibility validation.                          | Validation fails until the focusable card has name/description that summarize relevant content                      |
| Fluent UI: Focus mode entry/exit                  | Render cards for `no-tab`, `tab-exit`, and `tab-only`.                       | Use trusted `Tab`, `Enter`, `Escape`, and `Shift+Tab`. | Focus behavior matches the selected mode and observable focus never gets trapped unexpectedly                       |
| Fluent UI: Disabled card scope                    | Render disabled interactive and selectable cards with slotted child buttons. | Click host, checkbox, and child buttons.               | Host/selection interaction is suppressed; child controls are not assumed disabled unless explicitly disabled        |
| Fluent UI: Heading requirement                    | Render a large card with one title.                                          | Inspect markup.                                        | Title is a real heading at an author-chosen valid level, not just styled text                                       |

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

| Area        | Required coverage                                                                        |
| ----------- | ---------------------------------------------------------------------------------------- |
| behavior.md | One target = one action → enforced via 3 allowed interaction models, no overloaded card. |
| behavior.md | Native checkbox for selection; native buttons/links for actions.                         |
| behavior.md | Focus enters only on explicit Enter/Tab; focus modes via focusgroup + trap.              |
| behavior.md | Composite root owns focus scope; ignores foreign menu events.                            |
| behavior.md | User selection → composed `selection-change`; programmatic silent; hover is visual only. |
| behavior.md | `disabled` doesn't cascade to children.                                                  |
| behavior.md | Motion tokenized, reduced-motion safe.                                                   |


## center

# Center - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-center`
- Define: `@toyu-ui/define/center`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-center`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: readable measure container

## Intent

Use Center to constrain readable content to a maximum inline measure and center it inside the available space. It is for prose, forms, narrow settings pages, and focused empty states.

Do not use Center for full app shells, card grids, or controls that should size to content. Prefer `tyui-container` for page gutters and wider regions, `tyui-grid` for repeated cards, and natural block flow for unconstrained content.

## Selection Guidance

- Use when: content should be readable and centered with a maximum measure.
- Do not use when: content should fill a dashboard region, wrap as a row, or form repeated columns.
- Prefer instead: `tyui-container` for page width, `tyui-grid` for columns, `tyui-flex` for one-axis arrangement.
- Product-level variant preferences: generated design layers may set default measure and gutter.
- Agent rule: choose Center when the layout question is "how wide should this single column be for reading?"

## Composition Contract

- Allowed children: headings, prose, forms, empty states, simple vertical sections, and component groups.
- Required parent: none.
- Required child components: none.
- Optional child components: `tyui-flex`, `tyui-cluster`, form controls.
- Disallowed nested interactive content: none beyond child rules.
- Composition anti-patterns: wrapping every component in Center, nesting Center inside Center without a specific measure change.

## API

### Attributes

| Name        | Type                              | Reflects | Default | Notes                                                          |
| ----------- | --------------------------------- | -------- | ------- | -------------------------------------------------------------- |
| `measure`   | CSS length token or length string | yes      | `65ch`  | Maximum inline size.                                           |
| `gutter`    | `0 \| 1 \| 2 \| 3 \| 4 \| page`   | yes      | `page`  | Inline padding token.                                          |
| `intrinsic` | `boolean`                         | yes      | `false` | Centers children using flex when content itself should center. |

### Properties

Mirror attributes with typed properties.

### Events

None.

### Event Semantics

Child events pass through light DOM.

### Slots

| Name    | Description      | Fallback | Slotted Styling Rules              |
| ------- | ---------------- | -------- | ---------------------------------- |
| default | centered content | none     | children keep normal document flow |

### CSS Parts

None.

### CSS Custom Properties

`--ty-center-measure`, `--ty-center-gutter`, `--ty-layout-content-measure`, `--ty-page-gutter`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-center` and `.ty-center`:

| Attribute   | CSS Variable          | Mapping                                                                          |
| ----------- | --------------------- | -------------------------------------------------------------------------------- |
| `measure`   | `--ty-center-measure` | valid CSS length string; absent uses `65ch`                                      |
| `gutter`    | `--ty-center-gutter`  | `page` -> `var(--ty-page-gutter, 1rem)`; `0..4` -> `var(--ty-space-*, fallback)` |
| `intrinsic` | `--ty-center-display` | handled by selector; present uses flex centering                                 |

## Behavior

### State Model

- Controlled state: measure, gutter, intrinsic.
- Uncontrolled/default state: readable measure and page gutter tokens.
- Parent-owned state: available width and surrounding layout.
- Child-owned state: document semantics and focus.
- Programmatic update behavior: CSS updates only.

### Focus Model

Center is not focusable. Children keep native tab order.

### Keyboard Contract

No keyboard behavior.

## Layout Contract

- Display: block by default.
- Intrinsic size: constrained by max inline size and gutter.
- Shrink policy: content may shrink to available width.
- Wrap policy: text wraps naturally.
- Flexible slots: default content.
- Fixed slots: none.
- Parent owns: vertical placement and page region.
- Component owns: horizontal centering, readable measure, inline gutter.
- Container-query thresholds: none.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll.

## Styling Contract

### Public Tokens

Use `--ty-center-*`, `--ty-layout-content-measure`, and `--ty-page-gutter`.

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
- ARIA attributes: only add landmark or region semantics when content needs them.
- Reading order: unchanged.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Center adds no interaction.
- Define idempotently through `defineTyuiCenter`.
- Export `@toyu-ui/elements/center` and `@toyu-ui/define/center`.
- Provide `.ty-center` utility CSS.
- Do not use JavaScript measurement.

## Examples

### Storybook Examples

```html story title="Readable Form"
<tyui-center measure="48rem">
  <tyui-flex direction="column" gap="3">
    <h2>Profile</h2>
    <tyui-input label="Name" value="Ada Lovelace"></tyui-input>
    <tyui-input label="Email" value="ada@example.com"></tyui-input>
    <tyui-cluster>
      <tyui-button appearance="primary">Save</tyui-button>
      <tyui-button>Cancel</tyui-button>
    </tyui-cluster>
  </tyui-flex>
</tyui-center>
```

```html story title="Narrow Empty State"
<tyui-center measure="38rem" intrinsic>
  <tyui-flex direction="column" gap="2" align="center">
    <h2>No results</h2>
    <p>Try a different search term.</p>
    <tyui-button>Clear search</tyui-button>
  </tyui-flex>
</tyui-center>
```

### Invalid Examples

```html
<!-- Do not use Center for repeated card grids. -->
<tyui-center>
  <article>Card A</article>
  <article>Card B</article>
</tyui-center>
```

## Tests

| Requirement            | Setup                                                                              | Action              | Expected Result                      |
| ---------------------- | ---------------------------------------------------------------------------------- | ------------------- | ------------------------------------ |
| Measure maps           | Render with `measure="40rem"`                                                      | Read computed style | Max inline size uses 40rem.          |
| Gutters apply          | Render in narrow container                                                         | Measure padding     | Inline padding follows gutter token. |
| No focus stop          | Render input inside Center                                                         | Press Tab           | Focus enters input.                  |
| No shadow DOM          | Render Center                                                                      | Inspect host        | Children remain light DOM.           |
| Element/utility parity | Compare `.ty-center` with matching CSS variables and `tyui-center` with attributes | Read core styles    | Core centering rules match.          |

## Agent Guidance

- Use Center for one readable column.
- Use Container for broader page regions.
- Pair Center with Flex for vertical spacing rather than inventing local margins.
- Do not use Center to align individual controls inside a toolbar.


## checkbox

# Checkbox Component Contract

## Identity

- Component name: Checkbox
- Tag name: `tyui-checkbox`
- Package entry point: `@toyu-ui/elements/checkbox`
- Status: planned / implementation-ready
- Source file: `libs/elements/src/checkbox/tyui-checkbox.ts`
- Component family: form controls
- Pattern type: native-like form-associated control
- Closest native element or ARIA pattern: `<input type="checkbox">`
- Fluent / reference analogue: Fluent UI v9 Checkbox
- Related components: `tyui-input`, `tyui-radio`, `tyui-radio-group`

## Intent

Checkbox captures an independent yes/no choice, optionally with an indeterminate mixed state for parent/child selection summaries. It must preserve native checkbox semantics through an inner checkbox input while exposing TYUI styling hooks for generated design bundles.

Do not use Checkbox for mutually exclusive choices; use `tyui-radio-group` with `tyui-radio` children instead.

## Selection Guidance

- Use when: the user can toggle one independent option, accept a term, or mark an item as included.
- Do not use when: exactly one option from a set must be selected.
- Prefer instead: `tyui-radio-group` for mutually exclusive choices.
- Product-level variant preferences: generated themes may tune box, color, spacing, and focus tokens.
- One semantic target / one action rule: the label and box activate the same checkbox only.

## Composition Contract

- Allowed children: phrasing content in the default slot.
- Required parent: none.
- Required child components: none.
- Optional child components: none.
- Allowed slots: default label slot.
- Disallowed nested interactive content: links, buttons, inputs, checkboxes, radios, menus, or any focusable controls inside the label slot.
- Composition anti-patterns: using `indeterminate` as a submitted third value; indeterminate is visual/semantic mixed state and does not submit.

## API

### Attributes

| Name            | Type    | Reflected Property | Default | Description                                            |
| --------------- | ------- | ------------------ | ------- | ------------------------------------------------------ |
| `checked`       | boolean | `checked`          | `false` | Checked state.                                         |
| `indeterminate` | boolean | `indeterminate`    | `false` | Mixed visual state. Does not submit.                   |
| `disabled`      | boolean | `disabled`         | `false` | Disables native input and removes host from tab order. |
| `required`      | boolean | `required`         | `false` | Requires checked state for validity.                   |
| `name`          | string  | `name`             | `''`    | Submitted form field name.                             |
| `value`         | string  | `value`            | `'on'`  | Submitted value when checked and not indeterminate.    |

### Events

| Name     | Detail Type | Bubbles | Composed | Description                                           |
| -------- | ----------- | ------- | -------- | ----------------------------------------------------- |
| `change` | none        | yes     | yes      | Fired after user toggles checked/indeterminate state. |

Programmatic property or attribute changes do not emit `change`.

## Styling Contract

### Slots

| Name    | Description         |
| ------- | ------------------- |
| default | Label text/content. |

### CSS Parts

| Name      | Description                 |
| --------- | --------------------------- |
| `control` | Internal label/control row. |
| `box`     | Decorative checkbox square. |
| `label`   | Label content wrapper.      |

### Public Tokens

| Name                                     | Default                    | Description                    |
| ---------------------------------------- | -------------------------- | ------------------------------ |
| `--ty-checkbox-size`                     | `1rem`                     | Visual box size.               |
| `--ty-checkbox-radius`                   | `--ty-radius-1`            | Box radius.                    |
| `--ty-checkbox-gap`                      | `--ty-space-2`             | Box-label gap.                 |
| `--ty-checkbox-border-color`             | `--ty-color-border-strong` | Resting box border.            |
| `--ty-checkbox-background`               | `--ty-color-surface`       | Resting box background.        |
| `--ty-checkbox-checked-background`       | `--ty-color-accent`        | Checked box background.        |
| `--ty-checkbox-checked-foreground`       | `--ty-color-on-accent`     | Check mark color.              |
| `--ty-checkbox-indeterminate-foreground` | `--ty-color-accent`        | Mixed mark color.              |
| `--ty-checkbox-disabled-foreground`      | `--ty-color-disabled-text` | Disabled label and mark color. |

Private helper variables use `--_ty-checkbox-*` and are not consumer hooks.

### Styling State Surface

| State         | Surface                                               | Public | Notes                                                |
| ------------- | ----------------------------------------------------- | ------ | ---------------------------------------------------- |
| checked       | host `[checked]` and native input checked             | yes    | Selection styling hook.                              |
| indeterminate | host `[indeterminate]` and native input indeterminate | yes    | Mixed styling hook.                                  |
| disabled      | host `[disabled]` and native input disabled           | yes    | Removes normal interaction.                          |
| required      | host `[required]` and native input required           | yes    | Validation styling hook.                             |
| focus         | `:host(:focus-within)`                                | yes    | Used because focus delegates to hidden native input. |

## Behavior

- Native element used: internal `<input type="checkbox">` wrapped by a `<label>`.
- Native behavior preserved: role, checked/mixed semantics, disabled, label click, Space toggle.
- Custom behavior added: host `.click()` forwards to the native input for programmatic/test activation; shadow `change` is re-dispatched from the host.
- Focus owner: host delegates focus to the native input.
- Tabbable elements: host is `tabIndex=0` when enabled, `-1` when disabled; inner input is visually hidden.
- Keyboard: Space toggles natively when focused; synthetic Space may be forwarded for deterministic tests.
- Pointer: clicking the host or label toggles when enabled.
- Indeterminate interaction: user toggle clears `indeterminate` and updates `checked`.
- Form-associated: yes.
- Submitted value: `name=value` only when checked and not indeterminate.
- Validity: required unchecked is `valueMissing`; checked is valid.
- Disabled: disabled controls do not submit and are valid.

## Layout Contract

- Display: `inline-flex`.
- Intrinsic size: content-sized from box, gap, and label.
- Wrap policy: label can wrap; box is fixed.
- Minimum visual target: component should remain at least token-sized and may be enlarged by product tokens.
- Parent owns: outer margin, stretching, row/column arrangement.
- Component owns: internal label alignment, box size, gap, focus ring.

## Accessibility

- The native input owns checkbox semantics.
- The slotted label is associated through the wrapping label.
- Decorative box is `aria-hidden`.
- Preserve consumer ARIA on the host unless a field wrapper supplies explicit relationships in the future.
- Forced-colors mode must use system colors for box, disabled, and focus.

## Examples

### Storybook Examples

```html story title="Default"
<tyui-checkbox>Receive notifications</tyui-checkbox>
```

```html story title="States"
<div style="display:grid;gap:12px;align-items:start;">
  <tyui-checkbox>Unchecked</tyui-checkbox>
  <tyui-checkbox checked>Checked</tyui-checkbox>
  <tyui-checkbox indeterminate>Indeterminate</tyui-checkbox>
  <tyui-checkbox disabled>Disabled</tyui-checkbox>
  <tyui-checkbox disabled checked>Disabled checked</tyui-checkbox>
  <tyui-checkbox disabled indeterminate>Disabled indeterminate</tyui-checkbox>
  <tyui-checkbox required>Required</tyui-checkbox>
</div>
```

### Design Examples

```html design title="Atmospheric Glass"
<div
  data-design-system="atmospheric-glass"
  style="box-sizing:border-box;min-height:320px;padding:40px;display:flex;align-items:center;justify-content:center;"
>
  <section
    class="ty-glass-surface"
    data-elevation="elevated"
    data-shine="true"
    style="box-sizing:border-box;width:min(100%,560px);padding:28px;display:grid;gap:16px;"
  >
    <div class="ty-metric-label">Atmospheric Glass</div>
    <tyui-checkbox checked>Include wind alerts</tyui-checkbox>
    <tyui-checkbox indeterminate>Some regions selected</tyui-checkbox>
    <tyui-checkbox>Show experimental layers</tyui-checkbox>
  </section>
</div>
```

```html design title="Fluent Web"
<div
  data-design-system="fluent-web"
  style="box-sizing:border-box;min-height:320px;padding:32px;background:var(--ty-color-background);"
>
  <section
    class="ty-fluent-panel"
    data-elevation="raised"
    style="box-sizing:border-box;width:min(100%,560px);padding:20px;display:grid;gap:14px;"
  >
    <div>
      <div class="ty-fluent-title">Preferences</div>
      <div class="ty-fluent-caption">Independent choices use checkboxes.</div>
    </div>
    <tyui-checkbox checked>Email me updates</tyui-checkbox>
    <tyui-checkbox>Enable preview features</tyui-checkbox>
    <tyui-checkbox indeterminate>Some teams selected</tyui-checkbox>
  </section>
</div>
```

### Valid Example

```html
<tyui-checkbox name="alerts" value="wind" checked>Include wind alerts</tyui-checkbox>
```

### Invalid Example

Reason: use radio when one option must win from a set.

```html
<tyui-checkbox name="unit" value="metric">Metric</tyui-checkbox>
<tyui-checkbox name="unit" value="imperial">Imperial</tyui-checkbox>
```

## Tests

| Requirement                          | Setup                                         | Action                               | Validation                                                     |
| ------------------------------------ | --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| Native checkbox exists.              | Mount `<tyui-checkbox>Label</tyui-checkbox>`. | Query shadow DOM.                    | `input[type='checkbox']` exists; host is tabbable.             |
| Click toggles.                       | Mount enabled checkbox with change spy.       | Call host `.click()`.                | `checked=true`; one composed bubbling `change` fires.          |
| Space toggles.                       | Focus checkbox.                               | Dispatch Space keydown.              | State toggles and `change` fires.                              |
| Indeterminate clears on user toggle. | Mount `indeterminate`.                        | Click host.                          | `indeterminate=false`; `checked=true`.                         |
| Disabled blocks interaction.         | Mount `disabled`.                             | Click host.                          | State does not change; input disabled; host `tabIndex=-1`.     |
| Form submission.                     | Put named checked checkbox in a form.         | Construct `FormData`.                | Submitted value is `on` by default.                            |
| Required validity.                   | Mount required unchecked then checked.        | Call `checkValidity()`.              | Unchecked is invalid; checked is valid.                        |
| Styling hooks exist.                 | Mount states.                                 | Inspect shadow parts and host attrs. | `control`, `box`, `label` parts exist and state attrs reflect. |


## cluster

# Cluster - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-cluster`
- Define: `@toyu-ui/define/cluster`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-cluster`
- Alias concept: Wrap. The public element remains `tyui-cluster`; docs may describe the pattern as wrap layout.
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: wrapping row composition

## Intent

Use Cluster for compact groups of peer items that should stay content-sized and wrap to additional lines when space runs out: action rows, toolbar groups, tag lists, checkbox rows, radio rows, and small metadata chips.

Do not use Cluster for equal-width card grids, vertical forms, page gutters, or layouts where visual order differs from DOM order.

## Selection Guidance

- Use when: items form a row, wrapping is acceptable, and each child keeps its intrinsic size.
- Do not use when: children need equal columns, a single vertical stack, or fixed sidebar behavior.
- Prefer instead: `tyui-flex wrap="wrap"` when you need custom one-axis distribution, `tyui-grid` for tracks, `tyui-container` for page bounds.
- Product-level variant preferences: generated design layers may set dense or spacious gaps.
- Agent rule: choose Cluster when the sentence contains "row of actions", "tags", "chips", "wrap when narrow", or "toolbar-like group".

## Composition Contract

- Allowed children: controls, tags, links, badges, inline media, and short text groups.
- Required parent: none.
- Required child components: none.
- Optional child components: `tyui-button`, `tyui-checkbox`, `tyui-radio`, `tyui-badge`, `tyui-link`.
- Disallowed nested interactive content: none beyond children.
- Composition anti-patterns: using Cluster for table rows or navigation lists where list semantics are required.
- List semantics: when items form a semantic list, use `<ul class="ty-cluster">` or allow a future list-compatible primitive rather than removing list semantics.

## API

### Attributes

| Name      | Type                                            | Reflects | Default  | Notes                       |
| --------- | ----------------------------------------------- | -------- | -------- | --------------------------- |
| `align`   | `start \| center \| end \| baseline \| stretch` | yes      | `center` | Cross-axis alignment.       |
| `justify` | `start \| center \| end \| between`             | yes      | `start`  | Main-axis distribution.     |
| `gap`     | `0 \| 1 \| 2 \| 3 \| 4`                         | yes      | `2`      | Row and column gap token.   |
| `row-gap` | `0 \| 1 \| 2 \| 3 \| 4`                         | yes      | `gap`    | Optional line gap override. |

### Properties

Mirror attributes with typed properties.

### Events

None. Cluster is layout only.

### Event Semantics

Child events pass through light DOM. Cluster must not intercept activation, focus, or form events.

### Slots

| Name    | Description         | Fallback | Slotted Styling Rules                                                      |
| ------- | ------------------- | -------- | -------------------------------------------------------------------------- |
| default | wrapping peer items | none     | each child keeps intrinsic size unless app applies an explicit item policy |

### CSS Parts

None.

### CSS Custom Properties

`--ty-cluster-gap`, `--ty-cluster-row-gap`, `--ty-cluster-align`, `--ty-cluster-justify`, `--ty-layout-gap`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-cluster` and `.ty-cluster`:

| Attribute | CSS Variable           | Mapping                                                                    |
| --------- | ---------------------- | -------------------------------------------------------------------------- |
| `align`   | `--ty-cluster-align`   | `start` -> `flex-start`, `end` -> `flex-end`, other values pass through    |
| `justify` | `--ty-cluster-justify` | `start` -> `flex-start`, `end` -> `flex-end`, `between` -> `space-between` |
| `gap`     | `--ty-cluster-gap`     | `0..4` -> `var(--ty-space-*, fallback)`; invalid values fall back to `2`   |
| `row-gap` | `--ty-cluster-row-gap` | `0..4` -> `var(--ty-space-*, fallback)`; absent uses `gap`                 |

## Behavior

### State Model

- Controlled state: align, justify, gap, row-gap.
- Uncontrolled/default state: center aligned, start justified, gap token 2.
- Parent-owned state: width and placement.
- Child-owned state: intrinsic size, semantics, focus, events.
- Programmatic update behavior: CSS updates only.

### Focus Model

Cluster is not focusable. Children keep DOM-order tabbing. Wrapping must not create a roving tabindex pattern.

### Keyboard Contract

Cluster adds no keyboard behavior. Toolbars or composite widgets must implement their own keyboard contracts and may use Cluster only as an internal layout technique.

## Layout Contract

- Display: flex.
- Intrinsic size: content-driven.
- Shrink policy: children keep intrinsic width by default; long-text children need `min-inline-size: 0` if they should shrink.
- Wrap policy: always wraps.
- Flexible slots: default children only by explicit app policy.
- Fixed slots: none.
- Parent owns: available width and vertical placement.
- Component owns: wrapping, gap, alignment.
- Container-query thresholds: none.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll.

### Item Guidance

| Child Intent   | Recommended Policy                      | Notes                                         |
| -------------- | --------------------------------------- | --------------------------------------------- |
| action button  | content-sized                           | Common action-row pattern.                    |
| tag/chip/badge | content-sized                           | Wraps naturally.                              |
| search input   | `min-inline-size` plus `flex:1 1 12rem` | Use only when the row needs a flexible input. |
| icon-only tool | content-sized                           | Keep target-size token intact.                |

## Styling Contract

### Public Tokens

Use `--ty-cluster-*` tokens. Design layers may map those to product spacing tokens.

### Private Implementation Variables

Private variables use `--_ty-*`.

### Styling State Surface

Attributes and public tokens only.

- Forced-colors behavior: none beyond children.
- Reduced-motion behavior: no motion.
- App-variant hooks: host attributes, utility class, public tokens.

## Accessibility

- Role: none by default.
- Accessible name: none.
- ARIA attributes: do not add ARIA for layout.
- Semantic groups: if items need a group name, consumers may add `role="group"` plus `aria-label` or wrap the Cluster in a named region.
- List semantics: preserve native list markup when order/count matters.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Cluster adds no interaction.
- Define idempotently through `defineTyuiCluster`.
- Export `@toyu-ui/elements/cluster` and `@toyu-ui/define/cluster`.
- Provide `.ty-cluster` utility CSS.
- Map alignment aliases to valid CSS values.
- Keep child DOM stable.

## Examples

### Storybook Examples

```html story title="Action Row"
<tyui-cluster gap="2">
  <tyui-button appearance="primary">Save</tyui-button>
  <tyui-button>Cancel</tyui-button>
  <tyui-button appearance="subtle">Reset</tyui-button>
</tyui-cluster>
```

```html story title="Wrapping Tags"
<tyui-cluster gap="1" aria-label="Selected filters">
  <tyui-button size="small" shape="rounded">Design</tyui-button>
  <tyui-button size="small" shape="rounded">Accessibility</tyui-button>
  <tyui-button size="small" shape="rounded">Testing</tyui-button>
  <tyui-button size="small" shape="rounded">Tokens</tyui-button>
</tyui-cluster>
```

```html story title="Flexible Search Row"
<tyui-cluster gap="2" align="center">
  <tyui-input label="Search" style="flex:1 1 14rem;min-inline-size:0;"></tyui-input>
  <tyui-button appearance="primary">Search</tyui-button>
</tyui-cluster>
```

### Invalid Examples

```html
<!-- Do not remove list semantics for a real list. -->
<tyui-cluster>
  <span>One</span>
  <span>Two</span>
</tyui-cluster>
```

## Tests

| Requirement               | Setup                                                                               | Action              | Expected Result                         |
| ------------------------- | ----------------------------------------------------------------------------------- | ------------------- | --------------------------------------- |
| Wraps by default          | Render several buttons in narrow container                                          | Measure rows        | Items wrap without horizontal overflow. |
| Alignment maps            | Set `align="end"`                                                                   | Read computed style | `align-items` is `flex-end`.            |
| No focus stop             | Render focusable children                                                           | Press Tab           | Focus moves to first child.             |
| Child events pass through | Listen on Cluster                                                                   | Click child         | Event bubbles.                          |
| Element/utility parity    | Render `.ty-cluster` with matching CSS variables and `tyui-cluster` with attributes | Compare core styles | Display, wrap, and gap match.           |

## Agent Guidance

- Use Cluster for action rows and wrapping inline groups.
- Use Flex when the axis can be row or column and wrapping is optional.
- Use Grid when the design calls for repeated columns.
- Do not make Cluster responsible for toolbar keyboard behavior.


## container

# Container - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-container`
- Define: `@toyu-ui/define/container`
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
- Export `@toyu-ui/elements/container` and `@toyu-ui/define/container`.
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


## dialog

# Dialog — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-dialog` (+ `tyui-dialog-surface`, `tyui-dialog-title`, `tyui-dialog-body`, `tyui-dialog-actions`, `tyui-dialog-trigger`)
- Define: `@toyu-ui/define/dialog`
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


## field

# Field — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-field`
- Define: `@toyu-ui/define/field`
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


## flex

# Flex - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-flex`
- Define: `@toyu-ui/define/flex`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none. Children must stay in light DOM so layout applies directly to slotted content.
- Utility class: `.ty-flex`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: one-axis composition

## Intent

Use Flex for one-dimensional layout when children should arrange in a row or column and the parent owns direction, alignment, gap, wrapping, and distribution.

Do not use Flex as a replacement for component internals, data grids, page-width constraints, or two-dimensional card layouts. Prefer `tyui-grid` for responsive card grids, `tyui-cluster` for wrapping action/tag rows, `tyui-container` for page gutters, and `tyui-sidebar` for fixed-plus-fluid regions.

## Selection Guidance

- Use when: content follows one axis, direction may change by design layer, or a parent must align mixed children.
- Do not use when: each item needs responsive column tracks, intrinsic wrapping action-row behavior, or page-level max width.
- Prefer instead: `tyui-cluster` for wrap-first rows, `tyui-grid` for card collections, `tyui-center` for readable single-column content, native block flow for simple vertical document content.
- Product-level variant preferences: generated design layers may set default gap and alignment tokens, but must not force child components to grow unless the container intent requires equal distribution.
- Agent rule: choose Flex only when the layout question is "how do these siblings share one axis?"

## Composition Contract

- Allowed children: any flow content, including TYUI controls, text, cards, and layout primitives.
- Required parent: none.
- Required child components: none.
- Optional child components: any component whose parent may own placement.
- Disallowed nested interactive content: none beyond each child component's own rules.
- Composition anti-patterns: using Flex to create a table, using child inline styles for gaps that the parent should own, setting `flex: 1` on every child by default.
- Nesting: allowed, but nested Flex containers must keep their own layout tokens scoped.

## API

### Attributes

| Name        | Type                                                    | Reflects | Default   | Notes                                                         |
| ----------- | ------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------- |
| `direction` | `row \| row-reverse \| column \| column-reverse`        | yes      | `row`     | Maps to `flex-direction`.                                     |
| `wrap`      | `nowrap \| wrap \| wrap-reverse`                        | yes      | `nowrap`  | Maps to `flex-wrap`.                                          |
| `align`     | `stretch \| start \| center \| end \| baseline`         | yes      | `stretch` | Maps to `align-items`; logical aliases compile to CSS values. |
| `justify`   | `start \| center \| end \| between \| around \| evenly` | yes      | `start`   | Maps to `justify-content`; aliases compile to CSS values.     |
| `gap`       | `0 \| 1 \| 2 \| 3 \| 4`                                 | yes      | `3`       | Maps to spacing tokens.                                       |
| `inline`    | `boolean`                                               | yes      | `false`   | Uses `inline-flex` instead of `flex`.                         |

### Properties

Mirror attributes with typed properties. Boolean `inline` reflects to the host.

### Events

None. Flex is layout only and must not emit user events.

### Event Semantics

- User-initiated events: none.
- Programmatic state changes: changing attributes updates layout only.
- Native events: child events pass through light DOM without interception.
- Cancellation behavior: N/A.

### Slots

| Name    | Description       | Fallback | Slotted Styling Rules                                                                                                 |
| ------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| default | laid-out children | none     | children keep their own semantics; parent may assign flex item policy through public CSS variables or utility classes |

### CSS Parts

None. Flex has no shadow DOM.

### CSS Custom Properties

`--ty-flex-direction`, `--ty-flex-wrap`, `--ty-flex-align`, `--ty-flex-justify`, `--ty-flex-gap`, `--ty-layout-gap`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-flex` and `.ty-flex`:

| Attribute   | CSS Variable          | Mapping                                                                            |
| ----------- | --------------------- | ---------------------------------------------------------------------------------- |
| `direction` | `--ty-flex-direction` | raw valid enum value                                                               |
| `wrap`      | `--ty-flex-wrap`      | raw valid enum value                                                               |
| `align`     | `--ty-flex-align`     | `start` -> `flex-start`, `end` -> `flex-end`, other values pass through            |
| `justify`   | `--ty-flex-justify`   | `start` -> `flex-start`, `end` -> `flex-end`, `between/around/evenly` -> `space-*` |
| `gap`       | `--ty-flex-gap`       | `0..4` -> `var(--ty-space-*, fallback)`; invalid values fall back to `3`           |
| `inline`    | `--ty-flex-display`   | absent -> `flex`; present -> `inline-flex`                                         |

## Behavior

### State Model

- Controlled state: direction, wrap, align, justify, gap, inline.
- Uncontrolled/default state: row, nowrap, stretch, start, spacing token 3.
- Parent-owned state: placement and available size.
- Child-owned state: intrinsic size, semantics, focus, and events.
- Programmatic update behavior: update CSS values without moving focus or recreating children.

### Native Behavior First

- Native element used: custom element with light DOM children.
- Native behavior preserved: document flow, focus order, event propagation, accessible semantics of children.
- Custom behavior added: attribute-to-CSS mapping and tokenized defaults.

### Focus Model

- Focus owner: children only.
- Tabbable elements: Flex itself is not focusable.
- Roving tabindex: N/A.
- Focus-visible treatment: owned by children.

### Keyboard Contract

Flex adds no keyboard behavior. Tab order follows DOM order, including when `direction="row-reverse"` or `direction="column-reverse"`. Do not reorder DOM to create visual order.

## Layout Contract

- Display: `flex` or `inline-flex`.
- Intrinsic size: content-driven.
- Shrink policy: parent does not force children to shrink; flexible children that need shrink must use `min-inline-size: 0`.
- Wrap policy: controlled by `wrap`.
- Flexible slots: default children, if the application assigns flex policy.
- Fixed slots: none.
- Parent owns: external placement, available width, and item distribution.
- Component owns: one-axis arrangement, gap, alignment, and wrapping.
- Container-query thresholds: none in base primitive.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll; parent or child owns overflow.
- Top-layer / popover policy: N/A.

### Item Guidance

| Child Intent          | Recommended Policy                       | Notes                                         |
| --------------------- | ---------------------------------------- | --------------------------------------------- |
| content-sized control | `flex: 0 1 auto`                         | Default for buttons and inputs.               |
| equal-width actions   | parent class or token sets `flex: 1 1 0` | Use only for explicit equal distribution.     |
| shrinking text region | `min-inline-size: 0`                     | Required to prevent overflow in flex layouts. |
| icon or media         | `flex: none`                             | Prevents distortion.                          |

## Styling Contract

### Public Tokens

Use `--ty-flex-*` tokens for primitive defaults and `--ty-layout-gap` as the shared fallback. Design layers may remap tokens; they should not hardcode child selectors.

### Private Implementation Variables

Private variables use `--_ty-*` and are not consumer API.

### Styling State Surface

Attributes are public styling surface. There are no interactive states.

- Forced-colors behavior: no special handling beyond child components.
- Reduced-motion behavior: no motion.
- App-variant hooks: host attributes, utility class, and public tokens.

## Accessibility

- Role: none by default.
- Accessible name: none.
- ARIA attributes: do not add layout roles. Consumers may add landmark or grouping roles only when the content semantics require it.
- Reading order: DOM order remains the accessible order. Visual reverse directions must be used with care.

## Implementation Requirements

- Implement as a native custom element with no framework runtime.
- Do not attach shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Flex adds no interaction.
- Define idempotently through `defineTyuiFlex`.
- Export `@toyu-ui/elements/flex` and `@toyu-ui/define/flex`.
- Provide `.ty-flex` utility CSS with the same behavior as the element.
- Attribute changes must mutate host style or reflected attributes without rebuilding children.
- Use logical alignment aliases: `start` -> `flex-start`, `end` -> `flex-end`, `between` -> `space-between`.

## Examples

### Storybook Examples

```html story title="Row"
<tyui-flex gap="3" align="center">
  <tyui-button appearance="primary">Save</tyui-button>
  <tyui-button>Cancel</tyui-button>
</tyui-flex>
```

```html story title="Column"
<tyui-flex direction="column" gap="2" style="max-inline-size: 320px;">
  <tyui-input label="Name" value="Ada Lovelace"></tyui-input>
  <tyui-input label="Email" value="ada@example.com"></tyui-input>
</tyui-flex>
```

```html story title="Equal Distribution"
<tyui-flex gap="2" style="--demo-action-flex:1 1 0;">
  <tyui-button style="flex:var(--demo-action-flex);">Back</tyui-button>
  <tyui-button appearance="primary" style="flex:var(--demo-action-flex);">Continue</tyui-button>
</tyui-flex>
```

### Invalid Examples

```html
<!-- Do not use visual reverse order when reading order matters. -->
<tyui-flex direction="row-reverse">
  <tyui-button>Step 1</tyui-button>
  <tyui-button>Step 2</tyui-button>
</tyui-flex>
```

## Tests

| Requirement               | Setup                                                                         | Action                   | Expected Result                                     |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------- |
| Attribute mapping works   | Render default Flex                                                           | Set `direction="column"` | Computed `flex-direction` is `column`.              |
| Children remain light DOM | Render buttons inside Flex                                                    | Query children           | Buttons are direct light DOM descendants.           |
| No focus stop             | Render focusable children                                                     | Press Tab                | Focus enters first child, not Flex.                 |
| Child events pass through | Listen on Flex                                                                | Click child button       | Native event bubbles through Flex.                  |
| Shrink guidance works     | Put long text child with `min-inline-size:0`                                  | Constrain width          | Child shrinks without forcing overflow.             |
| Element/utility parity    | Render `.ty-flex` with matching CSS variables and `tyui-flex` with attributes | Compare core styles      | Display, direction, wrap, alignment, and gap match. |

## Agent Guidance

- Use `tyui-flex` for simple one-axis arrangement.
- Use `tyui-cluster` when wrapping is the point of the layout.
- Use `tyui-grid` when items form responsive tracks.
- Do not put component-specific styling in Flex. The primitive arranges children; components own their internals.


## frame

# Frame - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-frame`
- Define: `@toyu-ui/define/frame`
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
- Export `@toyu-ui/elements/frame` and `@toyu-ui/define/frame`.
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


## grid

# Grid - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-grid`
- Define: `@toyu-ui/define/grid`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-grid`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: responsive two-dimensional collection layout

## Intent

Use Grid for repeated peer items that should form responsive columns from the container width and an item minimum size: cards, tiles, metric panels, image groups, and settings panels.

Do not use Grid for tabular data, one-axis action rows, or arbitrary page shells. Prefer native table/data-grid components for data, `tyui-cluster` for wrapping action rows, and `tyui-sidebar` for two-region layouts.

## Selection Guidance

- Use when: each item is a peer, columns should auto-fit, and the parent owns gaps and minimum item width.
- Do not use when: rows and columns carry data relationships, cells need headers, or keyboard grid navigation is required.
- Prefer instead: `tyui-table` or future `tyui-data-grid` for data, `tyui-flex` for one axis, `tyui-container` for page width.
- Product-level variant preferences: generated design layers may set `min-item-size` by content type.
- Agent rule: choose Grid when the layout question is "how many columns fit here?"

## Composition Contract

- Allowed children: cards, panels, images, form sections, and other block-level peer items.
- Required parent: none.
- Required child components: none.
- Optional child components: `tyui-card`, `tyui-image`, form sections.
- Disallowed nested interactive content: none beyond child rules.
- Composition anti-patterns: using Grid for data tables, creating fake rows with visual order, hiding overflow instead of allowing wrapping.

## API

### Attributes

| Name            | Type                                | Reflects | Default   | Notes                                                                           |
| --------------- | ----------------------------------- | -------- | --------- | ------------------------------------------------------------------------------- |
| `min-item-size` | CSS length token or length string   | yes      | `16rem`   | Minimum track size before wrapping.                                             |
| `gap`           | `0 \| 1 \| 2 \| 3 \| 4`             | yes      | `4`       | Row and column gap.                                                             |
| `row-gap`       | `0 \| 1 \| 2 \| 3 \| 4`             | yes      | `gap`     | Optional row gap override.                                                      |
| `align`         | `stretch \| start \| center \| end` | yes      | `stretch` | Maps to `align-items`.                                                          |
| `justify`       | `stretch \| start \| center \| end` | yes      | `stretch` | Maps to `justify-items`.                                                        |
| `dense`         | `boolean`                           | yes      | `false`   | Maps to `grid-auto-flow: dense`; use only when visual reordering is acceptable. |

### Properties

Mirror attributes with typed properties.

### Events

None. Grid is layout only.

### Event Semantics

Child events pass through light DOM. Grid must not implement keyboard grid behavior.

### Slots

| Name    | Description | Fallback | Slotted Styling Rules                             |
| ------- | ----------- | -------- | ------------------------------------------------- |
| default | grid items  | none     | children are grid items; parent owns track sizing |

### CSS Parts

None.

### CSS Custom Properties

`--ty-grid-min-item-size`, `--ty-grid-gap`, `--ty-grid-row-gap`, `--ty-grid-align`, `--ty-grid-justify`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-grid` and `.ty-grid`:

| Attribute       | CSS Variable              | Mapping                                                                  |
| --------------- | ------------------------- | ------------------------------------------------------------------------ |
| `min-item-size` | `--ty-grid-min-item-size` | valid CSS length string; absent uses `16rem`                             |
| `gap`           | `--ty-grid-gap`           | `0..4` -> `var(--ty-space-*, fallback)`; invalid values fall back to `4` |
| `row-gap`       | `--ty-grid-row-gap`       | `0..4` -> `var(--ty-space-*, fallback)`; absent uses `gap`               |
| `align`         | `--ty-grid-align`         | valid enum value                                                         |
| `justify`       | `--ty-grid-justify`       | valid enum value                                                         |
| `dense`         | `--ty-grid-auto-flow`     | absent -> `row`; present -> `row dense`                                  |

## Behavior

### State Model

- Controlled state: min-item-size, gap, row-gap, align, justify, dense.
- Uncontrolled/default state: auto-fit columns with `16rem` minimum.
- Parent-owned state: available inline size.
- Child-owned state: intrinsic block size and semantics.
- Programmatic update behavior: update CSS values without reparenting children.

### Focus Model

Grid itself is not focusable. Tab order follows DOM order, not visual column position. Interactive grid keyboard behavior belongs to data-grid/table components, not this primitive.

### Keyboard Contract

No keyboard behavior. Arrow keys remain owned by child controls or composite components inside grid items.

## Layout Contract

- Display: grid.
- Intrinsic size: block size from items; inline size from parent.
- Track policy: `repeat(auto-fit, minmax(min(100%, var(--ty-grid-min-item-size)), 1fr))`.
- Shrink policy: tracks shrink to container width before wrapping; children should set `min-inline-size: 0` when their content may shrink.
- Wrap policy: automatic track wrapping.
- Flexible slots: all default children as grid items.
- Fixed slots: none.
- Parent owns: available width and placement.
- Component owns: track creation, gap, item alignment.
- Container-query thresholds: none; CSS grid auto-fit handles the response.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: no internal scroll; parent owns horizontal scroll if content cannot shrink.

## Styling Contract

### Public Tokens

Use `--ty-grid-*` tokens. Design layers may set different minimum item sizes for dashboards, forms, and galleries.

### Private Implementation Variables

Private variables use `--_ty-*`.

### Styling State Surface

Attributes and public tokens only.

- Forced-colors behavior: none beyond children.
- Reduced-motion behavior: no motion.
- App-variant hooks: host attributes, utility class, public tokens.

## Accessibility

- Role: none by default.
- Accessible name: none.
- ARIA attributes: do not add `role="grid"` to this primitive.
- Reading order: DOM order is the accessible order. Avoid `dense` when visual order must match reading order.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Grid adds no interaction and does not implement ARIA grid behavior.
- Define idempotently through `defineTyuiGrid`.
- Export `@toyu-ui/elements/grid` and `@toyu-ui/define/grid`.
- Provide `.ty-grid` utility CSS.
- Use CSS Grid auto-fit; do not calculate columns in JavaScript.
- Do not add ARIA grid semantics.

## Examples

### Storybook Examples

```html story title="Auto Fit Cards"
<tyui-grid min-item-size="14rem" gap="4">
  <section style="padding:16px;border:1px solid CanvasText;">Alpha</section>
  <section style="padding:16px;border:1px solid CanvasText;">Beta</section>
  <section style="padding:16px;border:1px solid CanvasText;">Gamma</section>
  <section style="padding:16px;border:1px solid CanvasText;">Delta</section>
</tyui-grid>
```

```html story title="Settings Panels"
<tyui-grid min-item-size="18rem" gap="3">
  <tyui-flex direction="column" gap="2">
    <strong>Account</strong>
    <tyui-input label="Display name" value="Ada"></tyui-input>
  </tyui-flex>
  <tyui-flex direction="column" gap="2">
    <strong>Notifications</strong>
    <tyui-checkbox checked>Email updates</tyui-checkbox>
  </tyui-flex>
</tyui-grid>
```

```html story title="Centered Items"
<tyui-grid min-item-size="10rem" align="start" justify="center" gap="2">
  <tyui-button>One</tyui-button>
  <tyui-button>Two</tyui-button>
  <tyui-button>Three</tyui-button>
</tyui-grid>
```

### Invalid Examples

```html
<!-- Do not use layout Grid for tabular data. -->
<tyui-grid>
  <div>Name</div>
  <div>Status</div>
  <div>Ada</div>
  <div>Active</div>
</tyui-grid>
```

## Tests

| Requirement            | Setup                                                                          | Action                         | Expected Result                        |
| ---------------------- | ------------------------------------------------------------------------------ | ------------------------------ | -------------------------------------- |
| Auto-fit works         | Render four items                                                              | Resize container               | Column count changes without JS.       |
| Min item size maps     | Set `min-item-size="20rem"`                                                    | Read computed grid template    | Tracks respect 20rem minimum.          |
| No grid role           | Render Grid                                                                    | Inspect accessibility tree/DOM | Host has no ARIA grid role by default. |
| DOM order stays stable | Render interactive children                                                    | Press Tab                      | Focus follows DOM order.               |
| Element/utility parity | Compare `.ty-grid` with matching CSS variables and `tyui-grid` with attributes | Read core styles               | Core grid rules match.                 |

## Agent Guidance

- Use `tyui-grid` for peer cards and panels.
- Do not use it for data with headers or arrow-key cell navigation.
- Set `min-item-size` from content, not viewport width.
- Keep item semantics inside the child elements.


## image

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


## input

---
component: tyui-input
status: draft
manifest: ../../custom-elements.json
source: ../../libs/elements/src/input/input.ts
designMetadata: ../../libs/elements/src/input/input.design.json
---

# Input

## Identity

- Component name: Input
- Tag name: `tyui-input`
- Package entry point: `@toyu-ui/elements/input`
- Status: Draft
- Source file: `libs/elements/src/input/input.ts`
- Manifest reference: `custom-elements.json#/modules/.../declarations/TyuiInput`
- Design metadata file: `libs/elements/src/input/input.design.json`
- Component family: Form field
- Pattern type: Native text input wrapper
- Closest native element or ARIA pattern: `<input>` with implicit textbox/searchbox/spinbutton semantics depending on type
- Fluent / reference analogue: Fluent UI v9 `Input`; Teams MCP `<ds-input>`
- Related components: future `tyui-field`, `tyui-textarea`, `tyui-search-box`, `tyui-select`, `tyui-combobox`

## Intent

Use `tyui-input` for single-line text entry where users type short freeform values such as names, email addresses, URLs, search terms, telephone numbers, passwords, or numeric text.

Do not use it for multiline text; use `tyui-textarea`. Do not use it for rich option picking; use select, combobox, or tag picker patterns. Do not use placeholder text as the only label.

## Selection Guidance

- Use when: a single-line native text input is the right semantic control.
- Do not use when: the value is multiline, selected from a constrained list, date/time-like, color-like, or requires custom option rendering.
- Prefer instead: `tyui-textarea` for multiline text, `tyui-select` for simple native single choice, `tyui-combobox` for richer listbox behavior, future date/time pickers for date/time values, `tyui-search-box` for search with clear affordance.
- Product-level variant preferences: product `design-app.md` may prefer one default appearance and size, but must keep accessible labeling and contrast requirements.
- One semantic target / one action rule: the input edits text only. Icons in content slots are decorative unless a future specialized component exposes separate clear/search actions.

## Composition Contract

- Allowed children: optional decorative or supplemental content in `slot="contentBefore"` and `slot="contentAfter"`.
- Required parent: none; future `tyui-field` is recommended for label, hint, validation, and required indicators.
- Required child components: none.
- Optional child components: decorative `tyui-icon` in content slots.
- Allowed slots: `contentBefore`, `contentAfter`.
- Disallowed nested interactive content: buttons, links, checkboxes, menus, or focusable controls in content slots for the base input.
- Composition anti-patterns: placeholder-only labeling; placing a clear button in `contentAfter` without using a dedicated search/clear component; using `type="date"` or other browser date/time types to fake a picker.

## API

### Attributes

| Name            | Type                                                          | Reflected Property | Default   | Description                                                                                                 |
| --------------- | ------------------------------------------------------------- | ------------------ | --------- | ----------------------------------------------------------------------------------------------------------- |
| `appearance`    | `outline \| filled-darker \| filled-lighter`                  | `appearance`       | `outline` | Base field style. Fluent underline is a design-system variant, not a base component appearance.             |
| `default-value` | `string`                                                      | `defaultValue`     | `''`      | Seeds `value` once on first connection when `value` is empty. Later changes do not overwrite current value. |
| `disabled`      | `boolean`                                                     | `disabled`         | `false`   | Disables the internal native input.                                                                         |
| `invalid`       | `boolean`                                                     | `invalid`          | `false`   | Reflected visual/ARIA invalid state. Also set by required validity sync.                                    |
| `name`          | `string`                                                      | `name`             | `''`      | Form field name used by ElementInternals.                                                                   |
| `placeholder`   | `string`                                                      | `placeholder`      | `''`      | Placeholder forwarded to native input; not a label substitute.                                              |
| `readonly`      | `boolean`                                                     | `readonly`         | `false`   | Forwards to native `readOnly`; focusable and selectable, but user edits do not mutate value.                |
| `required`      | `boolean`                                                     | `required`         | `false`   | Forwards to native input and drives ElementInternals `valueMissing`.                                        |
| `size`          | `small \| medium \| large`                                    | `size`             | `medium`  | Field density and typography.                                                                               |
| `type`          | `text \| email \| password \| search \| tel \| url \| number` | `type`             | `text`    | Native input type subset. Date/time types are intentionally excluded.                                       |
| `value`         | `string`                                                      | `value`            | `''`      | Initial value when authored as an attribute; property is authoritative after upgrade.                       |

### Properties

| Name           | Type                       | Attribute       | Default   | Description                                                                                 |
| -------------- | -------------------------- | --------------- | --------- | ------------------------------------------------------------------------------------------- |
| `appearance`   | same as attribute          | `appearance`    | `outline` | Reflects to host.                                                                           |
| `defaultValue` | `string`                   | `default-value` | `''`      | Seeds initial value once.                                                                   |
| `disabled`     | `boolean`                  | `disabled`      | `false`   | Reflects to host and internal input.                                                        |
| `invalid`      | `boolean`                  | `invalid`       | `false`   | Reflects to host and should mirror `aria-invalid` to internal input when true.              |
| `name`         | `string`                   | `name`          | `''`      | Used for form submission.                                                                   |
| `placeholder`  | `string`                   | `placeholder`   | `''`      | Forwarded to internal input.                                                                |
| `readonly`     | `boolean`                  | `readonly`      | `false`   | Reflects to host and internal input.                                                        |
| `required`     | `boolean`                  | `required`      | `false`   | Reflects to host and internal input.                                                        |
| `size`         | `small \| medium \| large` | `size`          | `medium`  | Reflects to host.                                                                           |
| `type`         | supported type union       | `type`          | `text`    | Reflects to host and internal input.                                                        |
| `value`        | `string`                   | `value`         | `''`      | Updates internal input and form value. Programmatic writes do not emit `input` or `change`. |

### Events

| Name     | Detail Type                      | Bubbles | Composed | Description                                           |
| -------- | -------------------------------- | ------- | -------- | ----------------------------------------------------- |
| `input`  | `CustomEvent<{ value: string }>` | yes     | yes      | Fired for user text input after host `value` updates. |
| `change` | `Event`                          | yes     | yes      | Fired when the native input commits a change.         |

### Event Semantics

- User-initiated events: typing dispatches `input` with `detail.value`; native commit dispatches `change`.
- Programmatic state changes that must not emit user events: setting `value`, `defaultValue`, `appearance`, `size`, `type`, `disabled`, `readonly`, `required`, or `invalid`.
- Native events that are re-dispatched: inner native `input` is stopped and re-dispatched from the host as `CustomEvent`; inner `change` is stopped and re-dispatched from the host as composed `Event`.
- Internal coordination events: none.
- Cancellation behavior: ordinary text input is native; do not cancel editing keys.

### Slots

| Name            | Description                                                                    | Fallback | Slotted Styling Rules                                                                   |
| --------------- | ------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------- |
| `contentBefore` | Decorative or supplemental content before typed text, inside the field border. | none     | Slotted SVG/icons are sized by `--_ty-input-icon-size` and inherit muted foreground.    |
| `contentAfter`  | Decorative or supplemental content after typed text, inside the field border.  | none     | Must not be focusable in the base input. Use a specialized component for clear buttons. |

### CSS Parts

| Name             | Description                                    | Allowed Use                                                               | Required State Qualifiers                                                          |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `control`        | Wrapper surface around slots and native input. | Advanced border/background/radius treatment when tokens are insufficient. | Qualify by host `[appearance]`, `[size]`, `[invalid]`, `[disabled]`, `[readonly]`. |
| `input`          | Internal native `<input>`.                     | Rare typography or input-specific styling.                                | Avoid changing semantics or hiding text.                                           |
| `content-before` | Wrapper around `contentBefore` slot.           | Slot wrapper alignment/color adjustments.                                 | Qualify by host state when needed.                                                 |
| `content-after`  | Wrapper around `contentAfter` slot.            | Slot wrapper alignment/color adjustments.                                 | Qualify by host state when needed.                                                 |

### Forwarded CSS Parts

| Name | Source Component | Description                                                    |
| ---- | ---------------- | -------------------------------------------------------------- |
| N/A  | N/A              | Base input does not compose nested TYUI components internally. |

### CSS Custom Properties

#### Public Tokens

| Name                                   | Default                            | Description                 |
| -------------------------------------- | ---------------------------------- | --------------------------- |
| `--ty-input-background`                | `var(--ty-color-surface)`          | Resting field background.   |
| `--ty-input-background-filled-darker`  | `var(--ty-color-surface-pressed)`  | Filled darker background.   |
| `--ty-input-background-filled-lighter` | `var(--ty-color-surface-hover)`    | Filled lighter background.  |
| `--ty-input-foreground`                | `var(--ty-color-text)`             | Input text color.           |
| `--ty-input-placeholder-color`         | `var(--ty-color-text-muted)`       | Placeholder color.          |
| `--ty-input-border-color`              | `var(--ty-color-border)`           | Resting border.             |
| `--ty-input-border-color-strong`       | `var(--ty-color-border-strong)`    | Hover/focus-capable border. |
| `--ty-input-invalid-border-color`      | `var(--ty-color-danger)`           | Invalid border.             |
| `--ty-input-focus-indicator-color`     | `var(--ty-color-accent)`           | Focus outline color.        |
| `--ty-input-radius`                    | `var(--ty-control-radius)`         | Control radius.             |
| `--ty-input-min-block-size`            | size-derived token                 | Minimum field height.       |
| `--ty-input-padding-inline`            | `var(--ty-control-padding-inline)` | Inline field padding.       |
| `--ty-input-padding-block`             | `var(--ty-control-padding-block)`  | Native input block padding. |
| `--ty-input-gap`                       | `var(--ty-control-gap)`            | Slot/text gap.              |
| `--ty-input-font-size`                 | `var(--ty-control-font-size)`      | Text size.                  |

#### Private Implementation Variables

Private variables use the `--_ty-*` prefix. List them only so reviewers can distinguish implementation details from consumer hooks; consumers must not depend on them.

| Name                    | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `--_ty-input-icon-size` | Size content slot icons per input size. |

### Styling State Surface

| State      | Surface                                                    | Public               | Notes                                                                    |
| ---------- | ---------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| Appearance | Host `[appearance]`                                        | Yes                  | Drives outline, filled-darker, and filled-lighter.                       |
| Size       | Host `[size]`                                              | Yes                  | Drives min block size, padding, icon size, font size.                    |
| Disabled   | Host `[disabled]`; internal native `disabled`              | Yes                  | Removes editing and normal focus.                                        |
| Readonly   | Host `[readonly]`; internal native `readOnly`              | Yes                  | Remains focusable/selectable.                                            |
| Required   | Host `[required]`; internal native `required`              | Yes                  | Drives validity.                                                         |
| Invalid    | Host `[invalid]`; internal `aria-invalid="true"` when true | Yes                  | Can be set directly or by validity sync.                                 |
| Focus      | `:focus-within` on control                                 | Yes through behavior | Shows neutral focus outline; design layers may restyle documented parts. |
| Hover      | `:hover` on control when not disabled                      | Yes through behavior | Visual only.                                                             |

## Behavior

### State Model

- Controlled state: property `value` is authoritative when set programmatically; programmatic writes update the internal input and form value without firing `input`.
- Uncontrolled / default state: `defaultValue` seeds `value` once on first connection only when `value` is empty.
- Derived internal state: validity-derived `invalid` when required and empty.
- Parent-owned state: form, field wrapper, and app own label, hint, validation message, and submitted context.
- Child-owned state: internal native input owns text editing, selection, IME, undo, and keyboard behavior.
- Programmatic update behavior: property updates synchronize native input and ElementInternals.
- User update behavior: typing updates host `value`, form value, validity, and dispatches `input`.
- State reset behavior: form reset behavior must be defined during implementation; recommended behavior resets to `defaultValue` when present, otherwise empty string.

### State Transition Matrix

| Current State              | User / Programmatic Action | Next State               | Event                                 | Focus Result             | Notes                                                             |
| -------------------------- | -------------------------- | ------------------------ | ------------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| Empty optional             | User types `x`             | Value `x`, valid         | `input` with `{ value: 'x' }`         | Focus remains in input   | Native editing.                                                   |
| Empty required             | `checkValidity()`          | Invalid                  | none                                  | Focus unchanged          | ElementInternals reports `valueMissing`; host reflects `invalid`. |
| Invalid required           | User types non-empty value | Valid                    | `input`                               | Focus remains in input   | Clears invalid.                                                   |
| Any                        | Programmatic `value='abc'` | Value `abc`              | none                                  | Focus unchanged          | Internal input updates.                                           |
| Empty with `default-value` | First connection           | Value seeded             | none                                  | N/A                      | Later `defaultValue` changes ignored.                             |
| Enabled                    | `disabled=true`            | Disabled                 | none                                  | Native disabled behavior | Internal input disabled.                                          |
| Readonly                   | User types                 | Readonly value unchanged | native behavior; no host value change | Focus remains possible   | Native readOnly.                                                  |

### Native Behavior First

- Native element used: internal `<input>`.
- Native behavior preserved: text editing, selection, IME, clipboard, type-specific keyboard behavior, required validity target, readonly, disabled, placeholder.
- Custom behavior added: ElementInternals form association, host event re-dispatch, default-value seed, host ARIA mirroring, tokenized visual wrapper.
- Why custom behavior is necessary: custom element host needs form participation and shadow-boundary events/ARIA.

### Focus Model

- Focus owner: internal native input.
- `delegatesFocus`: yes; host `focus()` routes to internal input.
- Tabbable elements: one internal input when enabled; none when disabled.
- Roving tabindex: N/A.
- Active descendant: N/A for base input.
- Focus restoration: app/form responsibility.
- Focus trap: N/A.
- Focus-visible treatment: focus indicator is a neutral outline on `:focus-within`.
- Pointer focus treatment: pointer focus also shows the focus-within indicator because native input owns focus.

### Keyboard Contract

| Key                 | Context                | Action                                       | Prevent Default | Event                            | Notes                                |
| ------------------- | ---------------------- | -------------------------------------------- | --------------- | -------------------------------- | ------------------------------------ |
| Text editing keys   | Enabled input          | Native editing                               | no              | `input` as native emits          | Includes IME and selection behavior. |
| Enter               | Text input inside form | Native form submit behavior where applicable | no              | `change`/submit per browser      | App handles form.                    |
| Tab                 | Enabled input          | Move focus to next tabbable                  | no              | native blur/change as applicable | Disabled input skipped.              |
| Arrow keys/Home/End | Enabled input          | Native caret movement                        | no              | none or native                   | Do not override.                     |

### Pointer And Hit Target Contract

- Primary hit target: internal native input and visual control wrapper.
- Secondary hit targets: none in base input.
- Hover behavior: border treatment only, no value change or focus movement.
- Pressed / active behavior: native input behavior only.
- Minimum target size: small 24px, medium 32px, large 40px minimum block size; products targeting touch may increase through tokens.
- Touch / pen considerations: native input should remain large enough for platform editing.
- Overloaded-target risks: `contentAfter` clear buttons must not be added to base input; use future search/clear component.

### Popup / Overlay Contract

N/A - base Input owns no popup. Combobox/search suggestions must use a specialized component with active descendant and popup focus rules.

### Form Contract

- Form-associated: yes, through ElementInternals.
- Submitted value: `value` submitted under `name`.
- `FormData` behavior: one name/value entry when `name` is non-empty and control is successful.
- Validity states: required empty sets `valueMissing` and `invalid`; non-empty clears.
- `checkValidity()` / `reportValidity()`: delegate to ElementInternals.
- Name propagation: host `name` supplies submitted field name.
- Required / readonly / disabled behavior: required participates in validity; readonly remains focusable; disabled removes from submission and focus.

### Lifecycle And Cleanup

- External event listeners: none.
- Observers: none.
- Timers: none.
- Generated IDs: none required for base input.
- Slotchange work: not required unless implementation derives slot presence for padding.
- Cleanup requirements: remove any future external listeners/observers.

## Layout Contract

- Display: host `inline-block`; control `inline-flex`.
- Intrinsic size: wrapper has a default minimum inline size, but parent owns final width.
- Shrink policy: internal input uses `min-inline-size: 0` and flexes.
- Wrap policy: no wrapping inside the control.
- Minimum target token: `--ty-input-min-block-size`.
- Minimum visual target: 24px small, 32px medium, 40px large; product may increase.
- Flexible slots: input text region.
- Fixed slots: contentBefore/contentAfter.
- Parent owns: width, margins, grid/flex placement, label/hint/validation layout.
- Component owns: internal padding, gap, min block size, focus outline, slot alignment.
- Container-query thresholds: N/A for base input.
- Scroll / overflow policy: native input handles horizontal text scrolling.
- Top-layer / popover policy: N/A.

### Regions / Slots

| Region / Slot | Flex       | Min Inline Size   | Wraps | Scrolls | Notes                  |
| ------------- | ---------- | ----------------- | ----- | ------- | ---------------------- |
| contentBefore | `0 0 auto` | icon/content size | no    | no      | Decorative by default. |
| input         | `1 1 auto` | `0`               | no    | native  | Native text field.     |
| contentAfter  | `0 0 auto` | icon/content size | no    | no      | Decorative by default. |

## Styling Contract

- Semantic tokens: color, control radius, control padding, focus, danger, motion.
- Component tokens: all `--ty-input-*` listed above.
- Private `--_ty-*` variables: icon size only.
- Public parts: `control`, `input`, `content-before`, `content-after`.
- Forwarded parts: none.
- Slots and slotted-content rules: content slots are inside the field border and are not interactive.
- Allowed `::part()` use: advanced control/input styling only when tokens are insufficient.
- Host class guidance: use host classes for width, margins, and scoped token overrides.
- Inline style guidance: dynamic per-instance width or tokens only.
- Forced-colors behavior: control uses `Field`, `FieldText`, `GrayText`, `Highlight`; focus outline remains visible.
- Reduced-motion behavior: focus transition collapses to `0ms`.
- App-variant hooks: app variants may remap public tokens under host attributes; generated CSS must not target private internals.

Consumer override order for this component:

1. Attributes and properties: `appearance`, `size`, `type`, `disabled`, `readonly`, `required`, `invalid`.
2. Host classes / app-local CSS: layout and scoped token overrides.
3. Public CSS custom properties: `--ty-input-*`.
4. Documented `::part()` selectors: `control`, `input`, `content-before`, `content-after`.
5. Inline `style` for dynamic per-instance values.

## Accessibility

- Role: implicit native role from internal input. `type="text"`, `email`, `password`, `tel`, `url`, and `search` use native textbox/search semantics; `number` uses native number input semantics.
- Accessible name: author must provide label association through future `tyui-field`, `aria-label`, or `aria-labelledby`.
- ARIA attributes: host `aria-label`, `aria-labelledby`, `aria-describedby`, and invalid state must be mirrored to internal input where needed.
- ARIA relationships: description IDs must resolve from the internal input's accessible context; mirror values rather than relying on shadow-boundary IDREF resolution.
- Label / description source: author or field wrapper.
- Consumer ARIA preservation: preserve supplied host ARIA; do not overwrite with empty strings.
- Shadow-boundary ARIA mirroring: required for label and description.
- Decorative content: content slot icons should be `aria-hidden` unless their meaning is also present in the label/description.
- Disabled vs disabled-focusable behavior: base input supports disabled only; disabled-focusable is N/A.
- Loading / status semantics: N/A.
- Screen reader expectations: announces editable field, name, required/invalid/readonly/disabled state, and description.
- High contrast expectations: text, field, border, invalid state, and focus outline remain visible.

### Accessibility Guidance

- Do: pair with a visible label or `aria-label`.
- Do: use field composition for hint and validation messages when available.
- Do not: rely on placeholder as the only label.
- Do not: put interactive controls in content slots.
- Author responsibilities: provide label, description, validation message, and type appropriate to value.
- Known tradeoffs: default and hover borders may be subtle by design; focus outline is the required strong indicator.

## Motion Contract

- Motion tokens: focus feedback duration/easing.
- CSS-only motion: yes, focus feedback transition.
- Reduced-motion behavior: focus transition becomes `0ms`.
- Delayed unmount behavior: N/A.
- Interaction behavior during motion: editing behavior independent of focus transition.
- Motion can be disabled by: reduced-motion media query or token override.

## Icons And Media

- Icon source: prefer TYUI icon component or known system icons.
- Icon accessible name policy: decorative by default; meaningful icons require equivalent label/description text.
- Decorative icon policy: `aria-hidden="true"`.
- Media slot behavior: simple inline icons only.
- Media cloning behavior: N/A.
- Image fallback behavior: N/A.

## Examples

### Storybook Examples

```html story title="Default"
<tyui-input aria-label="Project name" placeholder="Project name"></tyui-input>
```

```html story title="Appearances"
<div style="display:grid;gap:14px;max-width:360px;">
  <tyui-input aria-label="Outline input" appearance="outline" placeholder="outline"></tyui-input>
  <tyui-input
    aria-label="Filled darker input"
    appearance="filled-darker"
    placeholder="filled-darker"
  ></tyui-input>
  <tyui-input
    aria-label="Filled lighter input"
    appearance="filled-lighter"
    placeholder="filled-lighter"
  ></tyui-input>
</div>
```

```html story title="States"
<div style="display:grid;gap:14px;max-width:420px;">
  <tyui-input aria-label="Required value" placeholder="Required" required></tyui-input>
  <tyui-input
    aria-label="Invalid value"
    placeholder="Invalid"
    invalid
    value="not enough"
  ></tyui-input>
  <tyui-input
    aria-label="Readonly value"
    placeholder="Readonly"
    readonly
    value="Readonly value"
  ></tyui-input>
  <tyui-input
    aria-label="Disabled value"
    placeholder="Disabled"
    disabled
    value="Disabled value"
  ></tyui-input>
</div>
```

### Design Examples

```html design title="Atmospheric Glass"
<div
  data-design-system="atmospheric-glass"
  style="box-sizing:border-box;min-height:420px;padding:40px;display:flex;align-items:center;justify-content:center;"
>
  <section
    class="ty-glass-surface"
    data-elevation="elevated"
    data-shine="true"
    style="box-sizing:border-box;width:min(100%,720px);padding:28px;display:grid;gap:20px;"
  >
    <div style="display:grid;gap:8px;">
      <div class="ty-metric-label">Atmospheric Glass</div>
      <div style="font-size:28px;font-weight:700;line-height:1.15;">Input composition</div>
    </div>
    <div style="display:grid;gap:14px;">
      <tyui-input aria-label="Search weather maps" type="search" placeholder="Search weather maps">
        <svg
          slot="contentBefore"
          viewBox="0 0 20 20"
          aria-hidden="true"
          style="width:1em;height:1em;"
        >
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
          ></path>
        </svg>
      </tyui-input>
      <tyui-input aria-label="System name" appearance="filled-darker" value="North Atlantic system">
        <svg
          slot="contentAfter"
          viewBox="0 0 20 20"
          aria-hidden="true"
          style="width:1em;height:1em;"
        >
          <path
            fill="currentColor"
            d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm3.36 5.65-4.2 4.2-1.95-1.96-1.06 1.06 3.01 3.01 5.26-5.25-1.06-1.06Z"
          ></path>
        </svg>
      </tyui-input>
      <tyui-input
        aria-label="Optional notes"
        appearance="outline"
        placeholder="Optional notes"
      ></tyui-input>
    </div>
  </section>
</div>
```

```html design title="Fluent Web"
<div
  data-design-system="fluent-web"
  style="box-sizing:border-box;min-height:420px;padding:32px;background:var(--ty-color-background);"
>
  <section
    class="ty-fluent-panel"
    data-elevation="raised"
    style="box-sizing:border-box;width:min(100%,760px);padding:20px;display:grid;gap:18px;"
  >
    <div style="display:grid;gap:4px;">
      <div class="ty-fluent-title">Fluent Web inputs</div>
      <div class="ty-fluent-caption">
        Outline by default, Fluent underline for density, and filled search fields for app chrome.
      </div>
    </div>
    <div class="ty-fluent-form-grid">
      <tyui-input
        aria-label="Display name"
        placeholder="Display name"
        value="Adele Vance"
      ></tyui-input>
      <tyui-input
        aria-label="Email"
        type="email"
        placeholder="Email"
        value="adele@example.com"
      ></tyui-input>
      <tyui-input
        aria-label="Alias"
        class="ty-fluent-input-underline"
        placeholder="Alias"
        value="adelev"
      ></tyui-input>
      <tyui-input
        aria-label="Search people"
        appearance="filled-lighter"
        type="search"
        placeholder="Search people"
      >
        <svg
          slot="contentBefore"
          viewBox="0 0 20 20"
          aria-hidden="true"
          style="width:1em;height:1em;"
        >
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
          ></path>
        </svg>
      </tyui-input>
    </div>
  </section>
</div>
```

### Valid Example

```html
<label for="email">Email</label>
<tyui-input id="email" name="email" type="email" required placeholder="name@example.com" />
```

### Invalid Example

Reason: placeholder text is not a sufficient accessible label.

```html
<tyui-input placeholder="Email" />
```

### Edge Case Example

Reason: content slots may decorate the field but must not add unlabeled actions.

```html
<tyui-input aria-label="Search" type="search" placeholder="Search">
  <tyui-icon slot="contentBefore" name="search" aria-hidden="true" />
</tyui-input>
```

## Agent Guidance

- Preferred intent: single-line native text entry.
- Common misuse: placeholder-only label, custom date/time input, interactive clear button in content slot, using input for option selection.
- Safe composition patterns: field with label/hint/error, form row, search field without clear action.
- `design-app.md` notes: generated app variants may remap public `--ty-input-*` tokens and documented parts only.
- Library gaps to report: `tyui-field`, `tyui-search-box`, date/time pickers, clearable input if product design needs those.
- Required source docs to read before implementation: this document, `spec/behavior.md`, `spec/styling.md`, `spec/layout.md`, `spec/testing.md`.
- Implementation pitfalls: do not clobber consumer ARIA; do not set empty ARIA attributes; programmatic value writes must not emit input; `defaultValue` seeds only once; required validity should not create event loops.

## Tests

### Unit / Contract Tests

| Requirement                           | Setup                                                                 | Action                                               | Validation                                                                                |
| ------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Renders native input.                 | Mount `<tyui-input></tyui-input>`.                                    | Query shadow DOM.                                    | Internal `<input>` exists.                                                                |
| Value binds to internal input.        | Mount input, set `el.value='abc'`.                                    | Await update.                                        | Internal input value is `abc`; no `input` event emitted.                                  |
| Attribute value initializes property. | Mount with `value="hello"`.                                           | Await upgrade.                                       | Host and internal input value are `hello`.                                                |
| `defaultValue` seeds once.            | Mount with `default-value="seed"`, then set `defaultValue='changed'`. | Inspect values.                                      | Initial value is `seed`; later default update does not overwrite.                         |
| `value` wins over `defaultValue`.     | Mount with both.                                                      | Inspect value.                                       | Explicit value is used.                                                                   |
| User input emits payload.             | Mount with listener.                                                  | Dispatch native input after changing internal value. | Host value updates and event detail equals `{ value }`.                                   |
| Native change re-dispatches.          | Mount with listener.                                                  | Dispatch native `change`.                            | Host `change` fires, bubbles, and is composed.                                            |
| ARIA label mirrors.                   | Mount with `aria-label`.                                              | Inspect internal input.                              | Internal input has same `aria-label`.                                                     |
| ARIA description mirrors.             | Mount with `aria-describedby`.                                        | Inspect internal input.                              | Internal input has same `aria-describedby`, and absent source does not create empty attr. |
| Appearance reflects.                  | Mount each appearance.                                                | Inspect host.                                        | Host attribute matches.                                                                   |
| Size reflects.                        | Mount each size.                                                      | Inspect host.                                        | Host attribute matches.                                                                   |
| Type forwards.                        | Mount each supported type.                                            | Inspect internal input.                              | Native input `type` matches or falls back only where browser requires.                    |
| Readonly forwards.                    | Mount readonly.                                                       | Inspect internal input.                              | `readOnly` is true.                                                                       |
| Required validity works.              | Mount required empty, then set value.                                 | Call `checkValidity()`.                              | Empty is invalid/valueMissing; non-empty is valid and clears invalid.                     |
| Form submission works.                | Put named input in form.                                              | Construct `FormData`.                                | FormData contains name/value.                                                             |
| Focus delegates.                      | Call `el.focus()`.                                                    | Inspect shadow active element.                       | Internal input is focused.                                                                |
| Slots are exposed.                    | Mount contentBefore/contentAfter.                                     | Query slots.                                         | Each slot has assigned content.                                                           |
| Focus outline is present.             | Inspect stylesheet.                                                   | Search rules.                                        | Control `:focus-within` uses focus indicator token for a visible outline.                 |

### Browser E2E Tests

| Requirement                           | Setup                                     | Action                        | Validation                                                |
| ------------------------------------- | ----------------------------------------- | ----------------------------- | --------------------------------------------------------- |
| Native textbox semantics render.      | Open default story.                       | Query internal input.         | Tag is `input`, default type is `text`, role is native.   |
| Programmatic value updates UI.        | Open filled story.                        | Set host `value='Updated'`.   | Internal input value updates.                             |
| `default-value` seeds fresh element.  | Inject fresh element in browser.          | Set attribute before append.  | Internal input value is seeded.                           |
| Typing updates host and event detail. | Open default story with listener.         | Fill internal input.          | Host `value` and captured detail match typed value.       |
| ARIA forwarding works in browser.     | Inject input with ARIA label/description. | Inspect internal input.       | Attributes are mirrored.                                  |
| Form submission includes value.       | Open form story.                          | Fill and submit.              | Submitted data contains expected name/value.              |
| Disabled is skipped by Tab.           | Open disabled story.                      | Press Tab.                    | Disabled input does not receive focus.                    |
| Readonly remains focusable.           | Open readonly story.                      | Press Tab and attempt typing. | Focus enters input; value does not mutate through typing. |

### Accessibility Tests

| Requirement                           | Setup                                              | Action                                   | Validation                                      |
| ------------------------------------- | -------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Label is required.                    | Mount without label or ARIA in validation fixture. | Run accessibility check.                 | Missing accessible name is reported.            |
| Placeholder-only is invalid guidance. | Validate invalid example.                          | Run docs/example validator.              | Example is rejected.                            |
| Required state is exposed.            | Mount required input.                              | Inspect accessibility tree/native attrs. | Required is announced/exposed.                  |
| Invalid state is exposed.             | Mount invalid input.                               | Inspect internal input.                  | `aria-invalid="true"` or equivalent is present. |
| Decorative slots are hidden.          | Mount icons with `aria-hidden`.                    | Inspect accessibility tree.              | Icons do not pollute field name.                |
| Consumer ARIA is preserved.           | Mount with author ARIA.                            | Inspect host and internal input.         | Author values remain intact and mirrored.       |

### Visual And Contrast Tests

| Requirement                                | Setup                                      | Action                                   | Validation                                                                      |
| ------------------------------------------ | ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------- |
| Appearance matrix renders.                 | Render all base appearances in light/dark. | Capture visual snapshots.                | Outline, filled-darker, and filled-lighter match expected geometry.             |
| Size matrix renders.                       | Render small, medium, large.               | Capture visual snapshots.                | Min heights, icon sizes, and padding match matrix.                              |
| Content slots render.                      | Render contentBefore/contentAfter icons.   | Capture visual snapshots.                | Icons align and inherit muted color.                                            |
| Text contrast meets AA.                    | Load light and dark themes.                | Compare text on surface.                 | Text contrast is at least 4.5:1.                                                |
| Focus outline contrast meets non-text AA.  | Load light and dark themes.                | Compare focus indicator against surface. | Contrast is at least 3:1.                                                       |
| Border waivers are explicit.               | Run contrast tests.                        | Inspect skipped/waived assertions.       | Default/hover border waivers are documented and not counted as passed coverage. |
| Forced-colors mode is usable.              | Emulate forced colors.                     | Render focus, disabled, invalid.         | Uses `Field`, `FieldText`, `GrayText`, `Highlight`; focus visible.              |
| Reduced motion collapses focus transition. | Emulate reduced motion.                    | Inspect computed transition.             | Focus transition is 0ms or token-collapsed.                                     |

### Generated Design / AI Contract Tests

| Requirement                                 | Setup                              | Action                           | Validation                                                                             |
| ------------------------------------------- | ---------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| Manifest sync.                              | Generate `custom-elements.json`.   | Compare docs.                    | Attributes, properties, slots, parts, and tokens in this doc exist in manifest/source. |
| Design metadata sync.                       | Validate `.design.json`.           | Compare intent and alternatives. | Misuse alternatives include textarea, select, combobox, search box, field.             |
| Generated app CSS uses public surface only. | Generate `component-variants.css`. | Lint selectors.                  | Uses host attrs, public `--ty-input-*`, documented parts, or app-owned classes only.   |
| Examples compile.                           | Run TSX example smoke tests.       | Compile Solid JSX.               | Valid examples pass; invalid examples fail validation.                                 |

### Coverage Checklist

- Core behavior: value/defaultValue/input/change.
- DOM contract: native input, control wrapper, content slots.
- Public API reflection: appearance, size, type, disabled, readonly, required, invalid.
- Events: `input` detail and `change`.
- Slots: contentBefore/contentAfter.
- Parts and forwarded parts: control, input, content-before, content-after; no forwarded parts.
- Styling tokens: `--ty-input-*`.
- Private styling boundary: `--_ty-input-icon-size`.
- Accessibility: label, ARIA mirroring, required, invalid, disabled, readonly.
- Keyboard: native text editing.
- Focus: delegated focus and focus-within indicator.
- Pointer: hover visual only.
- Form behavior: ElementInternals, FormData, validity.
- Popup / overlay behavior: N/A.
- Motion and reduced motion: focus transition.
- Forced colors: system-color mapping.
- Contrast: text/focus and border waivers.
- Cleanup: no external listeners.
- Solid typing: intrinsic element, properties, and input/change event typing.
- Example smoke coverage: valid and invalid examples.
- Manifest/doc sync: required.
- Design metadata sync: required.


## label

# Label — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-label`
- Define: `@toyu-ui/define/label`
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


## link

# Link — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-link`
- Define: `@toyu-ui/define/link`
- Status: draft
- Native substrate: **native `<a href>`** when navigating; **native `<button>`** when there is no `href` (action styled as a link). `<span role=button>` only for the inline-wrapping edge case.
- Shadow DOM: optional/minimal. Prefer light DOM or a shadow root that renders the chosen native element with `part="control"`; native `href`, focus, context menu, middle-click, and "open in new tab" must be preserved on a real `<a>`.
- Category: navigation / action
- Component family: navigation/action text
- Pattern type: native link; button only for no-href action form
- Fluent / reference analogue: see API and Accessibility.

## Intent

Navigate to another location (primary use → real `<a href>`).
A link styled as text may also trigger an in-page action when there is no destination (→ `<button>`), but **prefer `tyui-button` for actions** and reserve Link for navigation or inline-text affordances.

Alternatives: `tyui-button` (actions), `tyui-menu` item link (`MenuItemLink`).

## Selection Guidance

- Use when: navigate to a URL with native anchor behavior.
- Do not use when: commands without href, disabled links that still navigate, or nested interactive content.
- Prefer instead: Button for commands, MenuItemLink inside menus.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: One link target; hover may style but not navigate until activation.

## Composition Contract

- Allowed children: phrasing content and optional icon; no interactive descendants.
- Required parent: none; navigation containers may group links.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  | Name | Description |
  | ------- | ------------------------------------ |
  | default | link text (and optional inline icon) |
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-link onclick="save()">Save</tyui-link>

## API

### Attributes

| Name                          | Type                | Reflects | Default   | Notes                                                 |
| ----------------------------- | ------------------- | -------- | --------- | ----------------------------------------------------- |
| `href`                        | `string`            | →a       | —         | presence selects `<a>` vs `<button>`                  |
| `target` / `rel` / `download` | `string`            | →a       | —         | native; auto-add `rel="noopener"` for `target=_blank` |
| `appearance`                  | `default \| subtle` | yes      | `default` |                                                       |
| `inline`                      | `boolean`           | yes      | `false`   | underline + inline-flow styling                       |
| `disabled`                    | `boolean`           | yes      | `false`   |                                                       |
| `disabled-focusable`          | `boolean`           | yes      | `false`   | keeps focus, sets `aria-disabled`                     |

### Properties

Mirror attributes. No methods.

### Events

Default: rely on native navigation/`click`. Expose a composed `activate` event **only** for the no-`href` action form, mirroring `tyui-button`, so app code can hear it across the boundary. Navigation links emit no custom event.

### Slots

| Name    | Description                          |
| ------- | ------------------------------------ |
| default | link text (and optional inline icon) |

### CSS parts

`control` — the native `<a>`/`<button>`.

### CSS custom properties

`--ty-link-color`, `--ty-link-color-hover`, `--ty-link-color-pressed`, `--ty-link-underline` (`none`/`currentColor`), `--ty-link-focus-color`. Defaults from semantic tokens; `appearance=subtle` remaps color.

### Event Semantics

- User-initiated events: Default: rely on native navigation/`click`. Expose a composed `activate` event **only** for the no-`href` action form, mirroring `tyui-button`, so app code can hear it across the boundary. Navigation links emit no custom event.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: none; navigation containers may group links.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                             | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                                          | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | With href: native Tab/Enter link behavior. Without href/action form: native button Space/Enter behavior. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                                          | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- With `href`: emit `<a href>` — navigation, `target`, `rel`, keyboard (Enter), context menu, status-bar URL, and modified-click are **all native, zero JS**.
- Without `href`: emit `<button type=button>` so Space/Enter activation and disabled semantics are native (Fluent does exactly this).
- `inline`/`appearance`/underline policy = pure CSS. No scripted hover/focus state.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: With href: native Tab/Enter link behavior. Without href/action form: native button Space/Enter behavior.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: none; navigation containers may group links.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: With href: native Tab/Enter link behavior. Without href/action form: native button Space/Enter behavior.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                                   | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | With href: native Tab/Enter link behavior. Without href/action form: native button Space/Enter behavior. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                                         | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                                    | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                              | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: One link target; hover may style but not navigate until activation.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A for component-owned overlays. Links navigate using native anchor behavior; overlay destinations are app-owned.
- Closes on: N/A.
- DOM focus while open: N/A.
- Next Tab behavior: native sequential focus.
- Arrow-key entry behavior: N/A.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: visual transitions never delay navigation activation semantics.

### Form Contract

- Form-associated: Not form-associated.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated.

### Lifecycle And Cleanup

- External event listeners: No external listeners for normal navigation; optional action-mode listener cleans up on disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: native focusability of `<a href>`/`<button>`. Visible `:focus-visible` ring (document this in the contract). `disabled-focusable` keeps the element in tab order with `aria-disabled="true"` (behavior.md disabled-focusable parity case).
- **Hit targets**: exactly one action — navigate **or** act, never both. Do not attach an extra hover/secondary behavior.
- **Native behavior**: Enter activates link; Space+Enter activate button; modified-click, context menu, middle-click preserved. No scripted key handling except the `<span role=button>` fallback.
- **State & events**: navigation needs no event. The action form emits `activate` (bubbles, composed). Programmatic focus changes emit nothing.
- **Disabled/readonly/loading**: `disabled` removes from interaction/tab order (native on `<button>`; on `<a>` remove `href` + `aria-disabled`). `disabled-focusable` retains focus, suppresses activation, sets `aria-disabled`. No loading state.
- **Motion**: none beyond a tokenized color/underline transition; reduced-motion safe.

## Layout Contract

- Display: inline text by default; block/standalone variants preserve readable hit target.
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

| Name    | Description                          |
| ------- | ------------------------------------ |
| default | link text (and optional inline icon) |

## Styling Contract

### Public Tokens

`--ty-link-color`, `--ty-link-color-hover`, `--ty-link-color-pressed`, `--ty-link-underline` (`none`/`currentColor`), `--ty-link-focus-color`. Defaults from semantic tokens; `appearance=subtle` remaps color.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`control` — the native `<a>`/`<button>`.

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

| Render                 | Role                                          | Notes                                                   |
| ---------------------- | --------------------------------------------- | ------------------------------------------------------- |
| `<a href>`             | `link` (native)                               | preferred                                               |
| `<button>` (no href)   | `button` (native)                             | action-as-link                                          |
| `<span>` (inline wrap) | `role="button"` + `tabindex=0` + key handling | only when inline text wrapping across lines is required |

### Reference Requirements

- **APG reference**: Patterns: [APG Link](https://www.w3.org/WAI/ARIA/apg/patterns/link/) for navigation and [APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) only for the no-`href` action form.
  - Direct requirements:
    - Navigation uses a native `<a href>` whenever possible.
    - Applying `role="link"` to a non-link does not add navigation, context menu, or browser link behavior; authors would own all missing behavior, so TYUI should avoid it.
    - Link and button functions must not be confused: a link references a resource; a button triggers an action.
    - Action-styled-as-link uses a native button and Enter/Space activation.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Link`.
  - Direct requirements:
    - Underlines are required except in discrete link-only or interactive-only regions, icon-marked links, or clear surrounding context.
    - Without `href`, Link renders as an HTML button.
    - `as="span"` may be used for inline wrapping and requires `role="button"`.
    - `disabled` and `disabledFocusable` are supported; disabled focusable remains in tab order but inert.
    - `appearance` supports default and subtle; `inline` changes text-flow styling.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- **Underline accessibility**: a non-underlined link is only allowed in the discrete contexts Fluent lists (nav region, all-interactive area, icon-marked, clear context). The spec must require `inline`/underline by default and treat no-underline as an explicit, justified choice.
- A disabled native `<a>` is not truly inert — must drop `href` and add `aria-disabled` (and prevent default) rather than rely on a non-existent `disabled` attribute.
- `<span role=button>` wraps across lines (Fluent's `as="span"`); it loses native activation, so it requires manual Space/Enter + `tabindex` — flag as the heaviest variant, use sparingly.
- Auto-apply `rel="noopener noreferrer"` whenever `target="_blank"`.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: inline text by default; block/standalone variants preserve readable hit target remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: icons are decorative unless link text is absent, then accessible name is required.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: icons are decorative unless link text is absent, then accessible name is required.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-link href="/docs">Read documentation</tyui-link>
```

### Invalid

```html
<tyui-link onclick="save()">Save</tyui-link>
```

## Agent Guidance

- **Selection guidance** (`ai/components/link.md`): "Use `tyui-link` for navigation. For in-page actions prefer `tyui-button`; only use the no-`href` Link for inline-text affordances. Links must be underlined unless in a discrete all-interactive region."
- **Alternatives map** (`x-design-system.alternatives`): `action → tyui-button`, `menu navigation → tyui-menu-item[href]`, `toggle → tyui-toggle-button`.
- **Layout ownership**: component owns intrinsic inline sizing + wrapping policy; parent owns placement. Inline links flow with text (`display:inline`), standalone links are `inline-block` — document the wrapping difference (Fluent `as=span` note).
- **Token usage**: color/underline via `--ty-link-*`; reject literal colors.
- **Anti-patterns to reject**: `tyui-link` with an `activate`/click handler used purely for navigation (use `href`); non-underlined inline link in body text; `target=_blank` without `rel`; overloading a link with a second action.
- **x-design-system metadata**:
  ```json
  {
    "intent": "navigation",
    "focusable": true,
    "alternatives": { "action": "tyui-button" },
    "accessibility": {
      "underlineRequiredOutsideDiscreteRegions": true,
      "requiresAccessibleName": true
    }
  }
  ```
- **Validation gates**: flag navigation links implemented as `<button>`+JS; flag missing underline on inline links; flag `_blank` without `rel`.

## Tests

### Unit / Contract Tests

| Requirement                                              | Setup                  | Action                                    | Validation                                        |
| -------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Native link navigation attributes                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Action mode emits composed `activate`                    | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Programmatic attribute changes are silent                | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled removes from Tab and suppresses click           | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled-focusable keeps focus but suppresses activation | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| `_blank` rel hardening                                   | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Inline link underline validation                         | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Focus-visible distinct from hover                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                      | Setup                                                    | Action                                        | Validation                                                                                                         |
| -------------------------------- | -------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| APG: Native link behavior        | Render `tyui-link href="/settings" target="_blank"`.     | Middle-click, open context menu, press Enter. | Browser link behaviors work; host forwards `href`, `target`, and hardened `rel`                                    |
| APG: No button-based navigation  | Render a no-`href` link with a navigation click handler. | Run design validation.                        | Validation rejects JS navigation and requires `href`                                                               |
| APG: Action form is button       | Render `tyui-link` with no `href`.                       | Press `Enter` and `Space`.                    | Internal native button activates for both keys and emits the documented action event                               |
| APG: One semantic target         | Render a link with secondary hover action.               | Run validation.                               | Secondary behavior is rejected; use a separate control                                                             |
| Fluent UI: Inline underline rule | Render inline body-text link with underline disabled.    | Run accessibility/style validation.           | Validation fails unless one of the documented discrete-context exceptions is present                               |
| Fluent UI: Span action fallback  | Render `as="span" inline` action link.                   | Press `Enter` and `Space`.                    | Role, tabindex, and key handling provide button-equivalent activation; generator warns it is the heaviest variant  |
| Fluent UI: Disabled link states  | Render disabled and disabled-focusable links.            | Press Tab and activate by keyboard/mouse.     | Disabled link is skipped and inert; disabled-focusable is reachable, announces disabled, and suppresses activation |
| Fluent UI: Subtle appearance     | Render default and subtle links.                         | Inspect styles.                               | Appearance remaps tokens only and preserves accessible name/role                                                   |

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
| behavior.md | Native semantics first → `<a>` for nav, `<button>` for action.  |
| behavior.md | One target = one action → navigate xor act.                     |
| behavior.md | Focus visible; disabled-focusable handled with `aria-disabled`. |
| behavior.md | Events: navigation silent; action emits composed `activate`.    |
| behavior.md | Disabled removes from tab order; readonly N/A.                  |
| behavior.md | Motion tokenized, reduced-motion safe.                          |


## menu

# Menu / MenuItem — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-menu`, `tyui-menu-trigger`, `tyui-menu-popover`, `tyui-menu-list`, `tyui-menu-item`, `tyui-menu-item-checkbox`, `tyui-menu-item-radio`, `tyui-menu-item-link`, `tyui-menu-group`, `tyui-menu-group-header`, `tyui-menu-divider`
- Define: `@toyu-ui/define/menu`
- Status: draft
- Native substrate: **Popover API** (`popover`) for the surface + **CSS Anchor Positioning**; items are native `<button>`/`<a>` (link items) carrying menu roles; roving focus via the **`focusgroup` polyfill**. There is **no** native menu _widget_, so this is the one component here that genuinely needs an ARIA composite — but the surface/dismiss/top-layer still come from the platform.
- Shadow DOM: minimal (surface + slots). Items are light-DOM native buttons/links with menu roles.
- Category: composite overlay (actions list)
- Component family: composite popup
- Pattern type: menu button plus menu/menubar
- Fluent / reference analogue: see API and Accessibility.

## Intent

Present a list of **actions** (and selectable checkbox/radio items) triggered by a button.
Do **not** use for navigation between peer views (→ `tyui-tablist`), for form selection from data (→ `tyui-select`/combobox), or for non-action content (→ `tyui-popover`).

## Selection Guidance

- Use when: transient command list opened from a trigger.
- Do not use when: form data selection, persistent navigation lists, tabs, or arbitrary focusable content.
- Prefer instead: Select/Listbox for data selection, Toolbar for visible commands, Popover for rich content.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Each item is one command/toggle/link; no interactive descendants inside items.

## Composition Contract

- Allowed children: trigger first; popover contains one menu list; items/groups/dividers only. The trigger may be a native `<button>` or a `tyui-button` only when `tyui-button` exposes native-equivalent button semantics on the host and accepts/forwards `aria-haspopup`, `aria-expanded`, activation, focus, and disabled state.
- Required parent: none; submenus are separate menu instances owned by parent item handoff.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  Menu: `trigger`, `popover`/`list`. Item slots as above.
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-menu-item><button>Nested button</button></tyui-menu-item>

## API

### tyui-menu

| Name                    | Type                               | Reflects | Default | Notes                                     |
| ----------------------- | ---------------------------------- | -------- | ------- | ----------------------------------------- |
| `open` / `default-open` | `boolean`                          | yes/no   | `false` | controlled/uncontrolled                   |
| `open-on-hover`         | `boolean`                          | yes      | `false` | hover-open (menu exception, see behavior) |
| `open-on-context`       | `boolean`                          | yes      | `false` | right-click; disables other triggers      |
| `persist-on-item-click` | `boolean`                          | yes      | `false` | keep open after activation                |
| `has-icons`             | `boolean`                          | yes      | `false` | alignment column                          |
| `has-checkmarks`        | `boolean`                          | yes      | `false` | alignment column                          |
| `checked-values`        | property `Record<string,string[]>` | —        | —       | checkbox/radio state                      |
| `hover-delay`           | number                             | —        | —       |                                           |
| `positioning`           | property                           | —        | auto    | CSS anchor                                |
| `inline`                | `boolean`                          | yes      | `false` | render in DOM order                       |
| `close-on-scroll`       | `boolean`                          | yes      | `false` |                                           |

### tyui-menu-item

`disabled` (kept focusable — Fluent: disabled is focusable by default in menus), `has-submenu`, `persist-on-click`; slots `icon`, `content`, `secondary-content` (shortcut text), `submenu-indicator`, `checkmark`, `sub-text`.

### Events

- `open-change` — composed; `{ open, reason }`.
- `checked-value-change` — composed; `{ name, checkedItems }` for checkbox/radio items.
- per-item activation surfaces as a composed `activate` from the item (consumer hears it), aggregated by the menu. User-initiated only.

### Slots

Menu: `trigger`, `popover`/`list`. Item slots as above.

### CSS parts

`popover`, `list`, `item`, `icon`, `checkmark`, `submenu-indicator`, `secondary-content`, `divider`, `group-header`.

### CSS custom properties

`--ty-menu-background`, `--ty-menu-radius`, `--ty-menu-item-padding`, `--ty-menu-item-hover`, `--ty-menu-item-foreground`, `--ty-menu-min-inline-size`, `--ty-menu-icon-size`.

### Event Semantics

- User-initiated events: see Events above, including `open-change` — composed; `{ open, reason }`.
- `checked-value-change` — composed; `{ name, checkedItems }` for checkbox/radio items.
- per-item activation surfaces as a composed `activate` from the item (consumer hears it), aggregated by the menu. User-initiated only.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: none; submenus are separate menu instances owned by parent item handoff.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                                                   | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                                                                | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Enter/Space/Arrow opens; arrows/Home/End/typeahead move roving focus; Escape closes and restores focus; Tab leaves and closes. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                                                                | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- Surface uses the **Popover API**: top-layer, light-dismiss, Esc, one-open-at-a-time — **free**. Positioning via **CSS anchor**; submenu offset via `position-area`.
- Items are real `<button>`/`<a>` → native activation, Enter/Space, link semantics for `MenuItemLink`.
- The menu **composite** layer (roles `menu`/`menuitem(checkbox/radio)`, arrow-key roving, typeahead, submenu open on ArrowRight/hover) is the irreducible ARIA work — implement roving with the **focusgroup polyfill** + a tiny keyboard controller. This is the deliberate exception behavior.md allows ("custom ARIA widgets only when native elements cannot express the interaction").
- Trigger uses native `popovertarget` where the trigger is a real `<button>` and ids resolve in the same tree; `tyui-button` and other custom triggers use the component's JS open API/trigger adapter.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Enter/Space/Arrow opens; arrows/Home/End/typeahead move roving focus; Escape closes and restores focus; Tab leaves and closes.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: none; submenus are separate menu instances owned by parent item handoff.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Enter/Space/Arrow opens; arrows/Home/End/typeahead move roving focus; Escape closes and restores focus; Tab leaves and closes.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                                                         | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Enter/Space/Arrow opens; arrows/Home/End/typeahead move roving focus; Escape closes and restores focus; Tab leaves and closes. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                                                               | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                                                          | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                                                    | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Each item is one command/toggle/link; no interactive descendants inside items.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: trigger click, Enter, Space, optional ArrowDown/ArrowUp, context menu, or opt-in hover.
- Closes on: item activation unless persistent, Escape, Tab/Shift+Tab leaving the menu, outside click, parent submenu handoff, or close-on-scroll when enabled.
- DOM focus while open: keyboard open moves focus to first/last item; pointer open keeps trigger focus until keyboard navigation or moves to first item only if configured explicitly.
- Next Tab behavior: Tab and Shift+Tab close the menu and move to the next/previous page focus target; they do not rove among menu items.
- Arrow-key entry behavior: ArrowDown/ArrowUp may open from trigger; arrows rove inside menu; ArrowRight/ArrowLeft open/close submenus.
- Outside click / pointerdown behavior: light-dismiss closes the surface without activating items.
- Escape behavior: closes current menu/submenu and returns focus to parent item or trigger.
- Focus restoration on close: return to trigger for root menu; return to parent item for submenu close.
- Behavior while enter / exit motion is running: closed state immediately removes menu from roving focus and accessibility tree.

### Form Contract

- Form-associated: Not a form field; checkbox/radio menu state emits events but does not submit without app wiring.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not a form field; checkbox/radio menu state emits events but does not submit without app wiring.

### Lifecycle And Cleanup

- External event listeners: Popover, roving focus, typeahead, submenu, hover-delay, and context-menu listeners clean up on close/disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: keyboard open moves focus into the menu (first/last item by key); pointer open keeps focus on the trigger until keyboard navigation unless `focus-on-open="first"` is explicitly configured. **Roving tabindex** inside (one tab stop); `ArrowUp/Down` move items, `Home`/`End`, typeahead to match labels, `ArrowRight`/`ArrowLeft` open/close submenus, Esc closes and returns focus to the trigger. This is the documented **menu exception** where directional arrows move focus (behavior.md Focus + Composite sections).
- **Hit targets**: each item is one action/toggle with its own target. A submenu parent is a single item that opens a submenu (separate composite) — not overloaded with a second action. Don't put focusable/clickable elements _inside_ a menu item (Fluent).
- **Native behavior**: items are native buttons/links (Enter/Space/native link). Surface dismissal is native Popover light-dismiss/Esc.
- **Composite widgets**: the menu **owns** roving focus, open state, and checkbox/radio checked state; items dispatch narrow internal events the menu aggregates. Submenus are separate `tyui-menu`s; the parent ignores the submenu's internal arrow events except the documented open/close handoff (behavior.md: ignore events from composites it doesn't own).
- **State & events**: `open`/`aria-expanded` reflected; checkbox/radio reflect `aria-checked`; user actions emit composed events; programmatic state is silent. By default the menu closes on item activation unless `persist-on-item-click`.
- **Disabled/readonly/loading**: disabled items stay **focusable** (`aria-disabled`) to keep arrow/typeahead order stable (Fluent + behavior.md disabled-focusable). No readonly. Async items use `aria-busy` on the item.
- **Motion**: surface fade/scale via tokens, reduced-motion safe; submenu open is fast. Hover-open uses `hover-delay`; during exit the surface is logically closed (behavior.md delayed-unmount).

## Layout Contract

- Display: anchored top-layer popover with alignment columns and internal scroll/auto-size.
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

Menu: `trigger`, `popover`/`list`. Item slots as above.

## Styling Contract

### Public Tokens

`--ty-menu-background`, `--ty-menu-radius`, `--ty-menu-item-padding`, `--ty-menu-item-hover`, `--ty-menu-item-foreground`, `--ty-menu-min-inline-size`, `--ty-menu-icon-size`.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`popover`, `list`, `item`, `icon`, `checkmark`, `submenu-indicator`, `secondary-content`, `divider`, `group-header`.

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

- Trigger: `aria-haspopup="menu"` + `aria-expanded` + `aria-controls` (menu id).
- Surface list: `role="menu"` (or `menubar` only for a persistent bar).
- Items: `role="menuitem"` / `menuitemcheckbox` (`aria-checked`) / `menuitemradio` (within a `role="group"`). Link items are `<a role="menuitem">`.
- Submenu parent item: `aria-haspopup="menu"` + `aria-expanded`; submenu is a separate nested `tyui-menu`.
- `has-icons`/`has-checkmarks` reserve alignment columns (CSS), not roles.

### Reference Requirements

- **APG reference**: Patterns: [APG Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) and [APG Menu and Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).
  - Direct requirements:
    - Trigger is a button with `aria-haspopup="menu"`, `aria-expanded`, and optional `aria-controls`.
    - Enter and Space on the trigger open the menu and place focus on the first menu item; optional Down/Up Arrow open to first/last item.
    - Menu container has `role="menu"`; items are `menuitem`, `menuitemcheckbox`, or `menuitemradio`.
    - Tab and Shift+Tab leave the menu and close it; they do not move among menu items.
    - Arrow keys move focus inside the menu; Home/End move to first/last when supported; printable characters may typeahead.
    - Escape closes the menu and returns focus to the invoking button or parent item.
    - Disabled menu items are focusable but cannot be activated; separators are not focusable.
    - Submenu parent items expose `aria-haspopup` and `aria-expanded`; checked items expose `aria-checked`.
- **Fluent UI reference**: Source components: Fluent UI React v9 `Menu` and `MenuList`.
  - Direct requirements:
    - `MenuTrigger` is the first child of `Menu`.
    - `MenuList` is the only child of `MenuPopover`.
    - Nested menus are separate components and limited to two levels.
    - `hasIcons` and `hasCheckmarks` reserve alignment columns when only some items have icons/selectable state.
    - `MenuItemLink` is used for navigation.
    - `positioning.autoSize` is used when the menu can be clipped at high zoom or small viewports.
    - Do not render focusable/clickable elements inside menu items.
    - Do not mix checkbox and radio items without `MenuGroup`.
    - `persistOnItemClick`, `openOnContext`, `openOnHover`, `closeOnScroll`, and `hoverDelay` are explicit behavior props.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- **Hover-open is the menu exception**: behavior.md generally forbids hover from moving focus, but menus may open submenus on hover. Even so, hover-open must not _steal_ DOM focus until a key/click; define the next-keyboard-action. Keep `open-on-hover` opt-in.
- **No native menu element** — the roving/typeahead/submenu logic is unavoidable JS; the focusgroup polyfill covers roving, but typeahead + submenu handoff remain a small controller. This is the only component where we accept a real ARIA composite.
- **≤2 nesting levels** (Fluent); deeper menus are an anti-pattern.
- **id resolution across shadow DOM**: `popovertarget`/`aria-controls` between a light-DOM trigger and a shadow surface won't resolve — own both in one root or use the JS open API (shared overlay convention).
- **`MenuItemLink`** must remain a real `<a href>` so middle-click/open-in-new-tab work, while still carrying `role="menuitem"`.
- Don't mix checkbox and radio items without a `MenuGroup`/`role="group"` (Fluent) — keep semantics clean.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: anchored top-layer popover with alignment columns and internal scroll/auto-size remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: item icons/checkmarks have reserved columns and are decorative unless item text is absent.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: item icons/checkmarks have reserved columns and are decorative unless item text is absent.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-menu>
  <tyui-menu-trigger><tyui-button>More</tyui-button></tyui-menu-trigger>
  <tyui-menu-popover>
    <tyui-menu-list><tyui-menu-item>Rename</tyui-menu-item></tyui-menu-list>
  </tyui-menu-popover>
</tyui-menu>
```

### Invalid

```html
<tyui-menu-item><button>Nested button</button></tyui-menu-item>
```

## Agent Guidance

- **Selection guidance** (`ai/components/menu.md`): "Use for action lists from a trigger button. Use `tyui-menu-item-link` for navigation items, checkbox/radio items for toggles (wrap in groups). ≤2 nesting levels. Don't put focusable elements inside items."
- **Alternatives map**: `peer views → tyui-tablist`, `data selection → tyui-select/combobox`, `non-action content → tyui-popover`, `2–3 always-visible commands → tyui-toolbar`.
- **Layout ownership**: menu owns item layout, alignment columns, and surface min-inline-size; **placement owned by anchor positioning**; overflow scrolls inside (`autoSize` parity). layout.md: anchor + container scroll, not viewport math.
- **Token usage**: colors/padding via `--ty-menu-*`; checked state shown by checkmark + `aria-checked`, never color alone.
- **Anti-patterns to reject**: focusable/interactive elements inside a menu item; >2 nesting; navigation menu items as `<button>`+JS (use link items); mixing checkbox/radio without a group; hover-open that steals focus; menu used for form data selection.
- **x-design-system metadata**:
  ```json
  {
    "intent": "action-menu",
    "composite": true,
    "nativeApi": "popover + anchor-positioning",
    "rovingFocus": "focusgroup-polyfilled",
    "topLayer": true,
    "accessibility": {
      "triggerHaspopupMenu": true,
      "menuExceptionArrowsMoveFocus": true,
      "disabledItemsFocusable": true,
      "linkItemsAreAnchors": true
    },
    "alternatives": { "tabs": "tyui-tablist", "dataSelect": "tyui-select" }
  }
  ```
- **Validation gates**: flag interactive children inside menu items; flag `<button>`+JS navigation items; flag missing `aria-haspopup`/`aria-expanded` on trigger; flag >2 nesting; flag checkbox/radio mix without group.

## Tests

### Unit / Contract Tests

| Requirement                                        | Setup                  | Action                                    | Validation                                        |
| -------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Trigger click/keyboard opens and focuses correctly | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Arrow/Home/End/typeahead navigation                | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled items focusable but inert                 | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Enter/Space activation closes unless persistent    | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Checkbox/radio `checked-value-change`              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Link item preserves anchor behavior                | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Submenu ArrowRight/Left and hover delay            | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Esc returns focus to opener                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                      | Setup                                                                                               | Action                                                                                               | Validation                                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard and focus contract      | Render the component in a direct Vite fixture with realistic surrounding focus targets.             | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract.                                                                                  |
| Pointer and target ownership     | Render primary and secondary targets documented by the Composition Contract.                        | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.                                                                                     |
| `tyui-button` trigger end-to-end | Render `<tyui-menu-trigger><tyui-button>More</tyui-button></tyui-menu-trigger>` with several items. | Tab to the button, press Enter, Space, ArrowDown, Escape, and click.                                 | Menu opens per APG, trigger `aria-haspopup/expanded` are exposed on the accessible button, roving focus enters items, and Escape restores focus to `tyui-button`. |

### Accessibility Tests

| Requirement                               | Setup                                                                         | Action                                                               | Validation                                                                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| APG: Trigger opens per APG                | Focus the menu trigger.                                                       | Press `Enter`, `Space`, `ArrowDown`, and `ArrowUp` in separate runs. | Menu opens, trigger `aria-expanded` becomes true, and focus lands on first or last item as specified                                      |
| APG: Roving menu navigation               | Open a menu with five items, one disabled item, and a separator.              | Press arrows, Home, End, and a printable character.                  | Focus moves only among items, includes disabled item as focusable, skips separator, and typeahead matches labels                          |
| APG: Activation and close                 | Focus a normal item and press `Enter`; focus checkbox item and press `Space`. | Observe menu state and events.                                       | Normal item activates and closes unless persistent; checkbox/radio updates `aria-checked` according to documented close policy            |
| APG: Escape return                        | Open submenu from parent item.                                                | Press `Escape` and `ArrowLeft`.                                      | Submenu closes and focus returns to parent item or trigger according to APG handoff                                                       |
| Fluent UI: Composition shape              | Render Menu with trigger not first or two lists in popover.                   | Run contract validation.                                             | Validation fails and names the required MenuTrigger/MenuPopover/MenuList shape                                                            |
| Fluent UI: Link item preservation         | Render a navigation menu item.                                                | Inspect DOM and middle-click the item.                               | Item is a real `<a href>` with `role="menuitem"`; native link behaviors are preserved                                                     |
| Fluent UI: Selectable item grouping       | Render checkbox and radio menu items together without a group.                | Run validation.                                                      | Validation fails until groups/names make state ownership explicit                                                                         |
| Fluent UI: No interactive descendants     | Put a button inside a `tyui-menu-item`.                                       | Run validation and keyboard E2E.                                     | Validation rejects it; keyboard focus never enters nested controls inside an item                                                         |
| Fluent UI: Clipping policy                | Render a tall menu near viewport edge at high zoom.                           | Open the menu.                                                       | Menu uses documented auto-size/scroll behavior instead of overflowing off screen                                                          |
| Fluent UI: `tyui-button` trigger contract | Render `tyui-button` as `MenuTrigger`.                                        | Open by click and keyboard, close by item activation and Escape.     | Trigger adapter forwards activation/focus/ARIA without piercing private shadow DOM; disabled/loading `tyui-button` does not open the menu |

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

| Area        | Required coverage                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| behavior.md | Native where possible (Popover API surface, native button/link items); ARIA composite only for the menu pattern (justified exception). |
| behavior.md | Roving tabindex (focusgroup) + typeahead; Esc returns focus to trigger.                                                                |
| behavior.md | Menu exception: arrows move focus / open submenus, documented; hover-open opt-in and non-focus-stealing.                               |
| behavior.md | One item = one action; submenu parent not overloaded; no focusable children in items.                                                  |
| behavior.md | Composite owns roving + open + checked state; ignores submenu-owned events except handoff.                                             |
| behavior.md | User actions → composed `activate`/`checked-value-change`/`open-change`; programmatic silent.                                          |
| behavior.md | Disabled items focusable for stable order; loading via `aria-busy`.                                                                    |
| behavior.md | Motion tokenized; logically closed during exit; reduced-motion safe.                                                                   |


## message-bar

# MessageBar — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-message-bar` (+ optional `tyui-message-bar-group`)
- Define: `@toyu-ui/define/message-bar`
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


## popover

# Popover — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-popover` (+ `tyui-popover-trigger`, `tyui-popover-surface`)
- Define: `@toyu-ui/define/popover`
- Status: draft
- Native substrate: **HTML Popover API** (`popover` attribute + `popovertarget`) for the surface; **CSS Anchor Positioning** for placement; native `<dialog>`-style focus trap only when `trap-focus` is set.
- Shadow DOM: minimal. Host renders `<div popover part="surface">`; trigger projected via slot. Top-layer, light-dismiss, and Esc come from the platform.
- Category: overlay (non-modal contextual content)
- Component family: popup/overlay
- Pattern type: disclosure; dialog only when focus-trapped
- Fluent / reference analogue: see API and Accessibility.

## Intent

Show contextual, non-essential content on top of other content, anchored to a trigger.
Do **not** use for required decisions (→ `tyui-dialog`), simple text hints (→ `tyui-tooltip`), or action lists (→ `tyui-menu`). Don't pour large/primary content into a popover.

## Selection Guidance

- Use when: non-modal contextual content opened from an explicit trigger.
- Do not use when: menus, tooltips, blocking workflows, or passive-only hover content.
- Prefer instead: Menu for commands, Tooltip for descriptions, Dialog for modal tasks.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Outside click/light dismiss closes when configured; hover preview never steals focus.

## Composition Contract

- Allowed children: trigger plus popover surface content; actions inside surface must be separate controls. The trigger may be a native `<button>` or a `tyui-button` only when `tyui-button` exposes native-equivalent button semantics on the host (focusable, Enter/Space activation, disabled behavior, accessible name) and forwards/accepts the required trigger ARIA.
- Required parent: trigger/controller owns open state; popover owns surface lifecycle.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  `trigger`, default (surface content).
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-popover open-on-hover trap-focus>Hover-only modal</tyui-popover>

## API

### tyui-popover

| Name                | Type                              | Reflects | Default      | Notes                                      |
| ------------------- | --------------------------------- | -------- | ------------ | ------------------------------------------ |
| `open`              | `boolean`                         | yes      | `false`      | controlled                                 |
| `default-open`      | `boolean`                         | no       | `false`      | uncontrolled                               |
| `trap-focus`        | `boolean`                         | yes      | `false`      | native inert trap for interactive content  |
| `open-on-hover`     | `boolean`                         | yes      | `false`      | hover-open (must not steal focus)          |
| `open-on-context`   | `boolean`                         | yes      | `false`      | context-menu open; disables other triggers |
| `close-on-scroll`   | `boolean`                         | yes      | `false`      |                                            |
| `with-arrow`        | `boolean`                         | yes      | `false`      | anchor-positioned arrow                    |
| `size`              | `small \| medium \| large`        | yes      | `medium`     | padding + arrow                            |
| `appearance`        | `brand \| inverted`               | yes      | —            | styling                                    |
| `positioning`       | property (`PositioningShorthand`) | —        | `above`/auto | → CSS anchor `position-area`               |
| `mouse-leave-delay` | number                            | —        | —            | hover close delay                          |

### Events

- `open-change` — composed; `{ open, reason }` (`triggerClick \| escapeKeyDown \| outsideClick \| scroll \| hover`). User-initiated.

### Slots

`trigger`, default (surface content).

### CSS parts

`surface`, `arrow`.

### CSS custom properties

`--ty-popover-background`, `--ty-popover-foreground`, `--ty-popover-radius`, `--ty-popover-padding`, `--ty-popover-shadow`, `--ty-popover-arrow-size`, `--ty-popover-max-inline-size`.

### Event Semantics

- User-initiated events: see Events above, including `open-change` — composed; `{ open, reason }` (`triggerClick \| escapeKeyDown \| outsideClick \| scroll \| hover`). User-initiated.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: trigger/controller owns open state; popover owns surface lifecycle.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                                                    | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                                                                 | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Trigger opens with Enter/Space/click; Escape closes; next Tab path into or past surface is explicit; trapped mode cycles focus. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                                                                 | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- **Popover API** gives top-layer rendering, **light-dismiss** (click outside), **Esc-to-close**, and one-open-at-a-time **for free** — replacing a popover JS controller + portal + outside-click listener. Core Oat win.
- **`popovertarget`** on the trigger button declaratively toggles the surface — **zero JS** for the basic open/close.
- **CSS Anchor Positioning** (`anchor()`, `position-area`, `position-try`) replaces Floating UI for `positioning`/flip/arrow. Progressive enhancement: small JS fallback where anchor positioning is unsupported.
- `trap-focus` (interactive content) uses the native dialog-style inert trap; default popover is non-trapping.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Trigger opens with Enter/Space/click; Escape closes; next Tab path into or past surface is explicit; trapped mode cycles focus.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: trigger/controller owns open state; popover owns surface lifecycle.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Trigger opens with Enter/Space/click; Escape closes; next Tab path into or past surface is explicit; trapped mode cycles focus.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                                                          | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Trigger opens with Enter/Space/click; Escape closes; next Tab path into or past surface is explicit; trapped mode cycles focus. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                                                                | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                                                           | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                                                     | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Outside click/light dismiss closes when configured; hover preview never steals focus.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: trigger click/Enter/Space, programmatic `open`, optional hover/focus preview when explicitly configured.
- Closes on: Escape, outside click/light-dismiss, trigger toggle, blur/hover delay when configured, or programmatic close.
- DOM focus while open: non-modal popover does not steal focus; trapped mode moves/cycles focus only after explicit activation.
- Next Tab behavior: default path is from trigger into the surface when interactive content exists, otherwise past it; trapped mode cycles within the surface.
- Arrow-key entry behavior: N/A unless slotted content owns a composite pattern.
- Outside click / pointerdown behavior: closes when light-dismiss is enabled without activating the surface.
- Escape behavior: closes and returns focus to trigger when focus was inside.
- Focus restoration on close: return to trigger when opened by keyboard or when focus is inside the surface.
- Behavior while enter / exit motion is running: logical closed state disables pointer/focus/accessibility before exit animation completes.

### Form Contract

- Form-associated: Not form-associated; forms inside use native semantics.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated; forms inside use native semantics.

### Lifecycle And Cleanup

- External event listeners: Anchor, toggle, outside-pointer, Escape, hover/focus delay, and positioning listeners clean up on close/disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: click-open → if `trap-focus`, move focus to first focusable; else leave focus on trigger and let the next Tab move into the surface (behavior.md: define next-keyboard-action; hover-open must NOT steal focus). On close, focus returns to the trigger. `unstable_disableAutoFocus` parity = a `no-autofocus` option.
- **Hit targets**: trigger toggles; surface controls are their own targets. Hover-open is a preview affordance and must not select/dismiss/navigate by hover alone (behavior.md hover rule), except the explicit context-menu mode.
- **Native behavior**: Popover API light-dismiss + Esc; native button activation. No hand-rolled outside-click.
- **Composite widgets**: not a composite itself, but may contain one; it owns only open state. Nested popovers ≤2 levels (Fluent), each a separate component.
- **State & events**: `open` reflected + `aria-expanded` on trigger; user open/close emits `open-change`; programmatic `open` set is silent.
- **Disabled/readonly/loading**: a disabled trigger doesn't open. Loading content inside uses `aria-busy`. No readonly.
- **Motion**: surface fade/scale via tokens, reduced-motion safe. During exit (delayed unmount) the surface is logically closed — not focusable, `aria-hidden`, pointer-inert (behavior.md).

## Layout Contract

- Display: anchored top-layer or positioned surface; parent owns anchor and component owns surface sizing/collision.
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

`trigger`, default (surface content).

## Styling Contract

### Public Tokens

`--ty-popover-background`, `--ty-popover-foreground`, `--ty-popover-radius`, `--ty-popover-padding`, `--ty-popover-shadow`, `--ty-popover-arrow-size`, `--ty-popover-max-inline-size`.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`surface`, `arrow`.

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

- Surface: a generic container; if non-interactive, set `tabindex="-1"` (Fluent). For interactive content with a trap, treat like a dialog (`role="dialog"` + label).
- Trigger: native `<button>` or native-equivalent `tyui-button` with `aria-expanded` reflecting open state and `aria-controls`/surface relationship. Use native `popovertarget` only for a real button in the same tree; for `tyui-button`, the popover trigger wrapper must wire click/keydown/open state through JS or a documented trigger-control API.
- `appearance="inverted"/"brand"` is styling only.

### Reference Requirements

- **APG reference**: Pattern: [APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) for non-modal show/hide behavior. If `trap-focus=true` makes the surface dialog-like, also apply [APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) focus containment requirements.
  - Direct requirements:
    - The trigger is a button that controls whether content is visible.
    - Trigger activation toggles visibility and reflects `aria-expanded`; `aria-controls` links the trigger to the surface when IDs resolve.
    - Non-modal disclosure content does not steal focus on hover.
    - If the surface traps focus, focus moves inside on open, Tab/Shift+Tab are contained, Escape closes, and focus returns to the trigger.
    - Popover does not claim Menu, Tooltip, or Dialog semantics unless its interaction model actually matches those patterns.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Popover`.
  - Direct requirements:
    - Use `trapFocus` when focusable elements are in the Popover.
    - Create nested Popovers as separate components; do not use more than two nested levels.
    - If there are no interactive items, set `tabIndex={-1}` on the surface.
    - Use Popover for non-essential information and avoid too much content.
    - Controlled open state requires extra accessibility care.
    - Trigger children must receive required interaction/accessibility props; custom triggers forward refs/activation and accept ARIA state. `tyui-button` is valid only if it satisfies that custom-trigger contract.
    - `openOnContext` disables other trigger interactions; `openOnHover`, `closeOnScroll`, `mouseLeaveDelay`, `withArrow`, `size`, and `appearance` are explicit behavior/styling controls.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- **Hover-open + focus**: the classic behavior.md tension. Hover opens visually but focus stays on trigger; the **next Tab** must have a documented path into the surface. Don't trap focus for hover popovers.
- **`popovertarget` id resolution across shadow DOM**: an invoker outside the surface's tree can't reference it. Either keep trigger + surface in the same root (component owns both) or fall back to the JS `showPopover()/hidePopover()` API. Document the convention (shared with Dialog/Tooltip/Menu).
- **Anchor positioning support**: where unsupported, fall back to a minimal JS positioner; arrow likewise. Keep it progressive.
- Non-interactive surface should be `tabindex="-1"` (Fluent) so it isn't an empty tab stop.
- `close-on-scroll` and `mouse-leave-delay` are enhancements over the native baseline.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: anchored top-layer or positioned surface; parent owns anchor and component owns surface sizing/collision remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: no media policy except slotted-content responsibilities.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: no media policy except slotted-content responsibilities.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-popover>
  <tyui-button slot="trigger">Details</tyui-button>
  <div slot="surface">More information</div>
</tyui-popover>
```

### Invalid

```html
<tyui-popover open-on-hover trap-focus>Hover-only modal</tyui-popover>
```

## Agent Guidance

- **Selection guidance** (`ai/components/popover.md`): "Use for non-essential contextual content anchored to a trigger. Trap focus only when it contains focusable controls. Hover-open must not steal focus. ≤2 nesting levels."
- **Alternatives map**: `required decision → tyui-dialog`, `text hint → tyui-tooltip`, `actions → tyui-menu`, `inline detail → expand in page`.
- **Layout ownership**: popover owns padding/arrow/max-inline-size; **placement owned by anchor positioning** relative to the trigger (layout.md: prefer CSS anchoring over JS measurement). Content scrolls inside when overflowing (`autoSize` parity).
- **Token usage**: surface/arrow via `--ty-popover-*`.
- **Anti-patterns to reject**: popover for primary/large content; hover-open with focus theft or hover-dismiss-only; >2 nesting; interactive content without `trap-focus`; non-interactive surface left as a tab stop.
- **x-design-system metadata**:
  ```json
  {
    "intent": "contextual-overlay",
    "nativeApi": "popover + anchor-positioning",
    "topLayer": true,
    "accessibility": {
      "triggerAriaExpanded": true,
      "trapFocusWhenInteractive": true,
      "hoverDoesNotStealFocus": true
    },
    "alternatives": { "modal": "tyui-dialog", "hint": "tyui-tooltip" }
  }
  ```
- **Validation gates**: flag interactive popover without trap-focus; flag hover popover that traps/steals focus; flag missing `aria-expanded` on trigger; flag >2 nesting.

## Tests

### Unit / Contract Tests

| Requirement                                                 | Setup                  | Action                                    | Validation                                        |
| ----------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Click/context/hover open reasons                            | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Hover never steals focus and next Tab path is deterministic | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Trap-focus path moves/restores focus                        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Outside click/Esc/scroll close                              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| `aria-expanded` and `open` sync                             | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Anchor-position fallback path                               | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Delayed close logically inert                               | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| >2 nesting and interactive-without-trap validation          | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                      | Setup                                                                                                                           | Action                                                                                               | Validation                                                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Keyboard and focus contract      | Render the component in a direct Vite fixture with realistic surrounding focus targets.                                         | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract.                                                                                               |
| Pointer and target ownership     | Render primary and secondary targets documented by the Composition Contract.                                                    | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.                                                                                                  |
| `tyui-button` trigger end-to-end | Render `<tyui-popover>` with `<tyui-button slot="trigger">Details</tyui-button>` and passive plus interactive surface variants. | Tab to the button, press Enter, Space, click, then Escape/outside click.                             | Popover opens/closes, `aria-expanded`/surface relationship update on the accessible button, focus restoration targets `tyui-button`, and disabled/loading buttons do not open. |

### Accessibility Tests

| Requirement                               | Setup                                                            | Action                                                                     | Validation                                                                                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| APG: Disclosure trigger state             | Render a non-modal popover with one trigger and passive content. | Click trigger, press `Enter`, press `Escape`.                              | `aria-expanded` and `open` sync; Escape closes; focus returns to or remains on trigger according to mode                                          |
| APG: Hover path                           | Render `open-on-hover`.                                          | Hover trigger, then press `Tab`.                                           | Hover opens visually without stealing focus; next Tab path is deterministic and documented                                                        |
| APG: Trap-focus dialog path               | Render `trap-focus` with two controls.                           | Open, press `Tab`, `Shift+Tab`, and `Escape`.                              | Focus is contained while open, closes on Escape, and returns to trigger                                                                           |
| APG: Pattern selection guard              | Render action list or required decision inside Popover.          | Run design validation.                                                     | Validation redirects action lists to Menu and required decisions to Dialog                                                                        |
| Fluent UI: Interactive content trap       | Render popover content with a link/button and no `trap-focus`.   | Run validation.                                                            | Validation fails or requires documented non-trapping Tab path; recommended fix is `trap-focus`                                                    |
| Fluent UI: Passive surface tab index      | Render passive content only.                                     | Press `Tab` after opening.                                                 | Surface is `tabindex="-1"` and does not become an empty tab stop                                                                                  |
| Fluent UI: Nested limit                   | Render three nested popovers.                                    | Run design validation.                                                     | Validation rejects depth greater than two                                                                                                         |
| Fluent UI: Custom trigger ref             | Render custom trigger component.                                 | Open via keyboard and pointer.                                             | Trigger receives required ARIA/open handlers and focus restoration works                                                                          |
| Fluent UI: `tyui-button` trigger contract | Render `tyui-button` as the custom trigger.                      | Open and close with keyboard and pointer, then inspect accessibility tree. | `tyui-button` exposes native-equivalent button role/name, trigger ARIA, event forwarding, and focus restoration without private shadow DOM access |
| Fluent UI: Controlled open accessibility  | Control `open` externally.                                       | Toggle via external state and keyboard.                                    | `aria-expanded`, focus policy, and close reasons remain consistent with uncontrolled mode                                                         |

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

| Area        | Required coverage                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------- |
| behavior.md | Native semantics first → Popover API light-dismiss/Esc/top-layer; anchor positioning.          |
| behavior.md | Hover-open does not steal focus; next-Tab path defined; click-open focuses only when trapping. |
| behavior.md | Focus returns to trigger on close.                                                             |
| behavior.md | Trigger toggle vs surface controls = separate targets; hover never dismisses/selects alone.    |
| behavior.md | User open/close → composed `open-change`; programmatic silent; `aria-expanded` reflected.      |
| behavior.md | Disabled trigger inert; loading via `aria-busy`.                                               |
| behavior.md | Motion tokenized; logically closed during exit; reduced-motion safe.                           |


## progress-bar

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


## radio-group

# RadioGroup Component Contract

## Identity

- Component name: RadioGroup
- Tag name: `tyui-radio-group`
- Package entry point: `@toyu-ui/elements/radio-group`
- Status: planned / implementation-ready
- Source file: `libs/elements/src/radio-group/tyui-radio-group.ts`
- Component family: form controls
- Pattern type: composite form-associated widget
- Closest native element or ARIA pattern: ARIA `radiogroup` with native radio children
- Fluent / reference analogue: Fluent UI v9 RadioGroup and `ds-radio-group`
- Related components: `tyui-radio`

## Intent

RadioGroup lets the user select exactly one option from a small set. It owns shared value, selection synchronization, roving tabindex, keyboard navigation, required state, disabled state, and form submission for child `tyui-radio` items.

## Selection Guidance

- Use when: the user must choose one option from a small visible set.
- Do not use when: options can be combined, hidden in a long list, or loaded through search.
- Prefer instead: `tyui-checkbox` for independent choices and future `tyui-select` for compact long lists.
- Product-level variant preferences: generated themes may tune layout gaps, label treatment, radio indicator tokens, and focus tokens.
- One semantic target / one action rule: each child radio selects exactly one group value.

## Composition Contract

- Allowed children: `tyui-radio` elements and optional non-interactive text nodes.
- Required child components: one or more `tyui-radio` for useful interaction.
- Allowed slots: default radios; optional `label` slot.
- Disallowed nested interactive content: non-radio inputs, buttons, links, or nested composites as selectable items.
- Composition anti-patterns: using checkboxes for mutually exclusive choices; manually setting multiple checked radios after connection.

## API

| Attribute  | Type                                                 | Reflected Property | Default      | Description                                                               |
| ---------- | ---------------------------------------------------- | ------------------ | ------------ | ------------------------------------------------------------------------- |
| `label`    | string                                               | `label`            | `''`         | Internal group label text when no external `aria-labelledby` is supplied. |
| `name`     | string                                               | `name`             | `''`         | Submitted form field name and child radio name.                           |
| `value`    | string                                               | `value`            | `''`         | Current selected option value.                                            |
| `layout`   | `'vertical' \| 'horizontal' \| 'horizontal-stacked'` | `layout`           | `'vertical'` | Group layout.                                                             |
| `disabled` | boolean                                              | `disabled`         | `false`      | Disables the whole group.                                                 |
| `required` | boolean                                              | `required`         | `false`      | Requires one selected value.                                              |

### Events

| Name     | Detail Type         | Bubbles | Composed | Description                        |
| -------- | ------------------- | ------- | -------- | ---------------------------------- |
| `change` | `{ value: string }` | yes     | yes      | Fired when user selection changes. |

Programmatic `value` changes do not emit `change`.

## Styling Contract

### Slots

| Name    | Description                             |
| ------- | --------------------------------------- |
| default | Child radios.                           |
| `label` | Optional external visual label content. |

### CSS Parts

| Name    | Description                         |
| ------- | ----------------------------------- |
| `label` | Generated or slotted label wrapper. |
| `items` | Wrapper around radio children.      |

### Public Tokens

| Name                                   | Default                    | Description                                 |
| -------------------------------------- | -------------------------- | ------------------------------------------- |
| `--ty-radio-group-gap`                 | `--ty-space-2`             | Gap between label/items or vertical radios. |
| `--ty-radio-group-inline-gap`          | `--ty-space-4`             | Gap for horizontal layouts.                 |
| `--ty-radio-group-label-color`         | `--ty-color-text`          | Label color.                                |
| `--ty-radio-group-disabled-foreground` | `--ty-color-disabled-text` | Disabled label color.                       |

## Behavior

- State owner: group owns `value`; children expose checked state as synchronized view.
- Initial value: `value` attribute selects matching radio; if no value is supplied, the first checked child is adopted.
- Click: clicking an enabled child selects it and fires one `change` unless already selected.
- Keyboard: ArrowRight/ArrowDown select next enabled radio; ArrowLeft/ArrowUp select previous enabled radio; navigation wraps and skips disabled radios. Space selects focused unchecked radio.
- Focus: one enabled radio has `tabIndex=0`; checked enabled radio wins, otherwise first enabled radio.
- Disabled group: sets `aria-disabled="true"`, removes child radios from tab order, and blocks click/key selection.
- Layout: `horizontal-stacked` propagates `label-position="below"` to child radios; other layouts use `after`.
- Form-associated: yes.
- Submitted value: `name=value` when a value is selected and group is not disabled.
- Required: host `aria-required="true"`, children required, and missing value is invalid.
- Name propagation: explicit group `name` wins; otherwise unnamed children get a generated shared fallback name while child-supplied names are preserved.

## Accessibility

- Host role defaults to `radiogroup` if consumer did not set one.
- If `aria-labelledby` is supplied, preserve it. Otherwise generate a stable internal label ID from the `label` attribute or `label` slot.
- Child radios keep native radio semantics.
- ID references across shadow boundaries are avoided for child labels; the group label relationship is host-owned.

## Examples

### Storybook Examples

```html story title="Default"
<tyui-radio-group label="Pick one" name="choice">
  <tyui-radio value="a">Option A</tyui-radio>
  <tyui-radio value="b">Option B</tyui-radio>
  <tyui-radio value="c">Option C</tyui-radio>
</tyui-radio-group>
```

```html story title="Selected"
<tyui-radio-group label="Pick one" name="choice" value="b">
  <tyui-radio value="a">Option A</tyui-radio>
  <tyui-radio value="b">Option B</tyui-radio>
  <tyui-radio value="c">Option C</tyui-radio>
</tyui-radio-group>
```

```html story title="Layouts"
<div style="display:grid;gap:24px;">
  <tyui-radio-group label="vertical" layout="vertical" value="b">
    <tyui-radio value="a">A</tyui-radio>
    <tyui-radio value="b">B</tyui-radio>
    <tyui-radio value="c">C</tyui-radio>
  </tyui-radio-group>
  <tyui-radio-group label="horizontal" layout="horizontal" value="b">
    <tyui-radio value="a">A</tyui-radio>
    <tyui-radio value="b">B</tyui-radio>
    <tyui-radio value="c">C</tyui-radio>
  </tyui-radio-group>
  <tyui-radio-group label="horizontal-stacked" layout="horizontal-stacked" value="b">
    <tyui-radio value="a">A</tyui-radio>
    <tyui-radio value="b">B</tyui-radio>
    <tyui-radio value="c">C</tyui-radio>
  </tyui-radio-group>
</div>
```

### Design Examples

```html design title="Atmospheric Glass"
<div
  data-design-system="atmospheric-glass"
  style="box-sizing:border-box;min-height:360px;padding:40px;display:flex;align-items:center;justify-content:center;"
>
  <section
    class="ty-glass-surface"
    data-elevation="elevated"
    data-shine="true"
    style="box-sizing:border-box;width:min(100%,640px);padding:28px;display:grid;gap:18px;"
  >
    <div class="ty-metric-label">Atmospheric Glass</div>
    <tyui-radio-group label="Temperature units" layout="horizontal-stacked" value="metric">
      <tyui-radio value="imperial">Fahrenheit</tyui-radio>
      <tyui-radio value="metric">Celsius</tyui-radio>
      <tyui-radio value="kelvin">Kelvin</tyui-radio>
    </tyui-radio-group>
  </section>
</div>
```

```html design title="Fluent Web"
<div
  data-design-system="fluent-web"
  style="box-sizing:border-box;min-height:360px;padding:32px;background:var(--ty-color-background);"
>
  <section
    class="ty-fluent-panel"
    data-elevation="raised"
    style="box-sizing:border-box;width:min(100%,640px);padding:20px;display:grid;gap:18px;"
  >
    <div>
      <div class="ty-fluent-title">Default view</div>
      <div class="ty-fluent-caption">Mutually exclusive choices use a radio group.</div>
    </div>
    <tyui-radio-group label="Startup page" value="dashboard">
      <tyui-radio value="dashboard">Dashboard</tyui-radio>
      <tyui-radio value="activity">Activity</tyui-radio>
      <tyui-radio value="settings">Settings</tyui-radio>
    </tyui-radio-group>
  </section>
</div>
```

## Tests

| Requirement                 | Setup                                          | Action                     | Validation                                                                        |
| --------------------------- | ---------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| Role and label.             | Mount with `label` and radios.                 | Inspect host/shadow label. | `role=radiogroup`; `aria-labelledby` points to generated label.                   |
| Value selects child.        | Mount with `value="b"`.                        | Inspect children.          | Only radio `b` checked.                                                           |
| First enabled tab stop.     | Mount no value with first radio disabled.      | Inspect tabIndex.          | First enabled child is `0`; others `-1`.                                          |
| Click selection.            | Mount with listener.                           | Click second radio.        | Value changes, checked states sync, one composed bubbling change has `{ value }`. |
| No duplicate change.        | Mount selected radio.                          | Click selected radio.      | No change fires.                                                                  |
| Disabled handling.          | Mount disabled group and disabled child cases. | Click/keydown.             | Value does not change.                                                            |
| Form submission.            | Put named group with selected value in form.   | Construct `FormData`.      | Submitted `name=value`.                                                           |
| Programmatic value.         | Set `group.value`.                             | Inspect children/listener. | Checked syncs; no change fires.                                                   |
| Arrow navigation.           | Focus active radio.                            | Arrow keys.                | Focus and value move, wrapping and skipping disabled radios.                      |
| Space selection.            | Focus unchecked radio.                         | Press Space.               | Value updates and change fires once.                                              |
| Required validity.          | Mount required without value, then set value.  | Call `checkValidity()`.    | Missing value invalid; selected value valid.                                      |
| Non-radio children ignored. | Slot an extra checkbox.                        | Click extra control.       | Group value remains unchanged.                                                    |


## radio

# Radio Component Contract

## Identity

- Component name: Radio
- Tag name: `tyui-radio`
- Package entry point: `@toyu-ui/elements/radio`
- Status: planned / implementation-ready
- Source file: `libs/elements/src/radio/tyui-radio.ts`
- Component family: form controls
- Pattern type: composite child item
- Closest native element or ARIA pattern: `<input type="radio">` inside a radio group
- Fluent / reference analogue: Fluent UI v9 Radio and `ds-radio`
- Related components: `tyui-radio-group`

## Intent

Radio represents one option in a mutually exclusive set. It renders native radio semantics but delegates coordinated selection, roving tabindex, group value, and form association to `tyui-radio-group`.

## Selection Guidance

- Use when: the component appears as one child option inside `tyui-radio-group`.
- Do not use when: the user can select more than one option; use `tyui-checkbox` instead.
- Prefer instead: `tyui-radio-group` for public app markup because the group owns keyboarding, value, required state, and form submission.
- Product-level variant preferences: generated themes may tune indicator fill, label position, spacing, and focus tokens.
- One semantic target / one action rule: the radio indicator and label select the same option only.

## Composition Contract

- Allowed children: phrasing content label in the default slot.
- Required parent: `tyui-radio-group` for production use.
- Allowed standalone use: only for low-level tests or native-like semantics without group coordination.
- Disallowed nested interactive content: buttons, links, inputs, menus, or focusable controls inside label content.

## API

| Attribute        | Type                 | Reflected Property | Default   | Description                                                  |
| ---------------- | -------------------- | ------------------ | --------- | ------------------------------------------------------------ |
| `checked`        | boolean              | `checked`          | `false`   | Whether this option is selected. Usually owned by the group. |
| `disabled`       | boolean              | `disabled`         | `false`   | Disables this option.                                        |
| `required`       | boolean              | `required`         | `false`   | Propagated from group when required.                         |
| `label-position` | `'after' \| 'below'` | `labelPosition`    | `'after'` | Label placement.                                             |
| `name`           | string               | `name`             | `''`      | Native radio name, usually propagated by group.              |
| `value`          | string               | `value`            | `''`      | Option value used by group.                                  |

Radio does not dispatch a public `change` event by itself. The group dispatches `change` with `{ value }`.

## Styling Contract

### CSS Parts

| Name        | Description              |
| ----------- | ------------------------ |
| `root`      | Internal label wrapper.  |
| `indicator` | Indicator wrapper.       |
| `circle`    | Decorative radio circle. |
| `dot`       | Decorative selected dot. |
| `label`     | Label content wrapper.   |

### Public Tokens

| Name                             | Default                    | Description                     |
| -------------------------------- | -------------------------- | ------------------------------- |
| `--ty-radio-size`                | `1rem`                     | Circle size.                    |
| `--ty-radio-dot-size`            | `0.5rem`                   | Selected dot size.              |
| `--ty-radio-gap`                 | `--ty-space-2`             | Circle-label gap.               |
| `--ty-radio-border-color`        | `--ty-color-border-strong` | Circle border.                  |
| `--ty-radio-checked-color`       | `--ty-color-accent`        | Checked circle fill and border. |
| `--ty-radio-checked-dot-color`   | `--ty-color-on-accent`     | Dot color on the checked fill.  |
| `--ty-radio-disabled-foreground` | `--ty-color-disabled-text` | Disabled label and indicator.   |

## Behavior

- Native element used: internal `<input type="radio">` wrapped by `<label>`.
- Focus owner: native shadow input. The host uses `delegatesFocus`, but keyboard focus must land on the internal `<input type="radio">` for reliable browser tabbing.
- Roving tabindex: parent group sets host `tabIndex`; `tyui-radio` must preserve a parent-assigned `tabIndex=0` when it connects and mirror that active tab stop to the inner input. Inactive radios keep both host and input at `tabIndex=-1`.
- Label click: native label routes click to inner input; group hears the composed click on the host.
- Disabled: inner input disabled and host is removed from group tab order.
- Form: standalone radio is not form-associated; group owns form submission.

## Keyboard Contract

| Key                        | Context                         | Action                                                                          | Prevent Default | Event                             | Notes                                                       |
| -------------------------- | ------------------------------- | ------------------------------------------------------------------------------- | --------------- | --------------------------------- | ----------------------------------------------------------- |
| `Space`                    | Standalone focused radio input  | Selects the native radio.                                                       | Native behavior | Native `change` on inner input    | Provided by `<input type="radio">`; no custom host handler. |
| `Space`                    | Radio inside `tyui-radio-group` | Parent group selects the focused radio if unchecked.                            | Yes, by group   | Group `change` with `{ value }`   | Group owns public state and event.                          |
| `ArrowRight` / `ArrowDown` | Radio inside group              | Move focus and selection to next enabled radio, wrapping.                       | Yes, by group   | Group `change` when value changes | Both axes are accepted in all layouts.                      |
| `ArrowLeft` / `ArrowUp`    | Radio inside group              | Move focus and selection to previous enabled radio, wrapping.                   | Yes, by group   | Group `change` when value changes | Disabled radios are skipped.                                |
| `Tab`                      | Group entry                     | Enters the one radio with `tabIndex=0` and delegates focus to its native input. | No              | none                              | Checked enabled radio wins; otherwise first enabled radio.  |

Verification note: standalone Space selection is intentionally delegated to the native shadow `<input type="radio">`. Synthetic unit tests cannot trigger trusted native keyboard defaults reliably, so browser verification must focus the host and press Space. Group arrow/Space behavior is custom and covered by deterministic element tests.

## Accessibility

The native radio input owns the radio semantics. Decorative circle and dot are hidden from assistive technology. `label-position` changes visual layout only.

## Examples

### Storybook Examples

```html story title="Standalone Radio"
<tyui-radio value="metric" checked>Metric</tyui-radio>
```

```html story title="Label Positions"
<div style="display:flex;flex-wrap:wrap;gap:18px;align-items:start;">
  <tyui-radio value="after" checked>Label after</tyui-radio>
  <tyui-radio value="below" label-position="below" checked>Label below</tyui-radio>
  <tyui-radio value="disabled" disabled>Disabled</tyui-radio>
</div>
```

## Tests

| Requirement                         | Setup                                                           | Action                          | Validation                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Native radio exists.                | Mount `<tyui-radio value="a">A</tyui-radio>`.                   | Query shadow DOM.               | `input[type='radio']` exists; value is `a`.                                                                     |
| Checked syncs.                      | Mount with `checked`.                                           | Inspect input.                  | Input is checked.                                                                                               |
| Disabled syncs.                     | Mount with `disabled`.                                          | Inspect input/host.             | Input disabled; host `tabIndex=-1`.                                                                             |
| Standalone default is not tabbable. | Mount enabled radio.                                            | Inspect host/input.             | Host and input are `tabIndex=-1` unless a group or consumer assigns the tab stop.                               |
| Parent roving tab stop preserved.   | Set `radio.tabIndex=0` before connecting.                       | Append to DOM.                  | Host remains `tabIndex=0`; inner input mirrors `tabIndex=0`.                                                    |
| Label position reflects.            | Mount `label-position="below"`.                                 | Inspect part/root data.         | Visual layout state is below.                                                                                   |
| Native label activation.            | Mount standalone radio.                                         | Click slotted label.            | Native input becomes checked.                                                                                   |
| Native Space activation.            | Mount standalone radio in a real browser.                       | Focus host, press Space.        | Native input becomes checked.                                                                                   |
| Browser Tab entry.                  | Mount radio group in direct Vite e2e fixture with value `b`.    | Start from `body`, press `Tab`. | Document focus is the active `tyui-radio`; its shadow `input` is focused; inactive radios remain `tabIndex=-1`. |
| Browser arrow movement.             | Continue from focused checked radio in direct Vite e2e fixture. | Press `ArrowRight`.             | Group value changes to next enabled radio; focus moves to that radio's shadow `input`; roving tab stop updates. |
| Styling hooks exist.                | Mount radio.                                                    | Query parts.                    | `root`, `indicator`, `circle`, `dot`, `label` exist.                                                            |
| Checked visual is filled.           | Mount radio with `checked`.                                     | Inspect CSS/styling.            | Circle fill uses `--ty-radio-checked-color`; dot uses `--ty-radio-checked-dot-color`.                           |


## select

# Select — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-select`
- Define: `@toyu-ui/define/select`
- Status: draft
- Native substrate: **native `<select>`** (Fluent v9's Select is itself a thin wrapper around `<select>`).
- Shadow DOM: minimal. Shadow root holds a styled wrapper + `<slot>` for the `<select>` **or** a forwarded `<select part="select">` plus a decorative chevron `<span part="icon">`. The `<option>` list, popup, keyboard, typeahead, and form submission stay 100% native.
- Category: form control
- Component family: form control
- Pattern type: native select with listbox analogue
- Fluent / reference analogue: see API and Accessibility.

## Intent

Choose one option from a short, known list where a plain native dropdown is sufficient.
Do **not** use for multi-select, free text, async search, or rich option content → that is a future `tyui-combobox`/`tyui-dropdown` (listbox + `aria-activedescendant`). Select is intentionally the cheap, fully-native option.

## Selection Guidance

- Use when: single native choice from a bounded option list.
- Do not use when: rich async filtering, multi-select chips, or menu commands.
- Prefer instead: Combobox/Listbox for rich selection, Menu for commands.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Click/tap opens native picker; option choice changes value.

## Composition Contract

- Allowed children: native option/optgroup-compatible items only.
- Required parent: Field/form.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  | Name | Description |
  | ------- | ---------------------------------- |
  | default | `<option>` / `<optgroup>` elements |
  | `icon` | optional custom chevron |
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-select><button>Not an option</button></tyui-select>

## API

### Attributes

| Name         | Type                                                      | Reflects | Default   | Notes            |
| ------------ | --------------------------------------------------------- | -------- | --------- | ---------------- |
| `appearance` | `outline \| underline \| filled-darker \| filled-lighter` | yes      | `outline` | CSS only         |
| `size`       | `small \| medium \| large`                                | yes      | `medium`  | matches Input    |
| `value`      | `string`                                                  | →select  | —         | controlled value |
| `name`       | `string`                                                  | →select  | —         | form field name  |
| `disabled`   | `boolean`                                                 | →select  | `false`   | native           |
| `required`   | `boolean`                                                 | →select  | `false`   | native           |

### Properties

`value`, `selectedIndex`, `options`, `form`, `validity`, `validationMessage` — forward to the inner `<select>`. Implement form participation via **`ElementInternals`** (`formAssociated = true`) so `tyui-select` submits like a native field.

### Events

Re-dispatch native **`change`** and **`input`** as composed events crossing the shadow boundary (payload `{ value }`). These are user-input events → public (behavior.md "user input emits public events"). Programmatic `value` set emits nothing.

### Slots

| Name    | Description                        |
| ------- | ---------------------------------- |
| default | `<option>` / `<optgroup>` elements |
| `icon`  | optional custom chevron            |

### CSS parts

`select` (control), `icon` (chevron).

### CSS custom properties

`--ty-select-background`, `--ty-select-border-color`, `--ty-select-radius`, `--ty-select-padding-inline`, `--ty-select-min-block-size`, `--ty-select-icon-color`. Appearances remap these.

### Event Semantics

- User-initiated events: Re-dispatch native **`change`** and **`input`** as composed events crossing the shadow boundary (payload `{ value }`). These are user-input events → public (behavior.md "user input emits public events"). Programmatic `value` set emits nothing.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: Field/form.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                 | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                              | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Native select keyboard behavior; component must not reimplement arrow/typeahead differently. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                              | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- Use the real `<select>`: the OS-native popup, full keyboard model (typeahead, Home/End, arrows), touch behavior, and form participation are **free and unbeatable** — exactly Oat's "let the platform be the component."
- We add only: border/appearance CSS and a decorative chevron. We do **not** rebuild the listbox.
- `appearance`, `size` = CSS. `onChange` = native `change`.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Native select keyboard behavior; component must not reimplement arrow/typeahead differently.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: Field/form.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Native select keyboard behavior; component must not reimplement arrow/typeahead differently.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                       | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Native select keyboard behavior; component must not reimplement arrow/typeahead differently. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                             | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                        | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                  | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Click/tap opens native picker; option choice changes value.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: native select activation by pointer, keyboard, or platform picker.
- Closes on: native picker selection, cancel, blur, or platform-specific close behavior.
- DOM focus while open: focus remains on the native select/picker according to platform behavior.
- Next Tab behavior: native select commits/leaves according to platform defaults.
- Arrow-key entry behavior: native select owns arrow/typeahead behavior.
- Outside click / pointerdown behavior: native picker/platform behavior.
- Escape behavior: native picker/platform behavior.
- Focus restoration on close: remains on or returns to the native select per platform.
- Behavior while enter / exit motion is running: no custom popup motion is applied.

### Form Contract

- Form-associated: Form-associated native select semantics: name/value, required, disabled, validation, reset.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Form-associated native select semantics: name/value, required, disabled, validation, reset.

### Lifecycle And Cleanup

- External event listeners: Native select/form/slotchange listeners update options and validation wiring and clean up on disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: native `<select>` is one tab stop; focus moves only on click/Tab. Visible `:focus-visible` ring on `part(select)`. No active-descendant gymnastics — the native control owns it.
- **Hit targets**: one control, one job (pick a value). Chevron is decorative, not a separate target.
- **Native behavior**: keep native popup, typeahead, keyboard, IME, validation, and form submit. This is the textbook behavior.md "checkbox/radio/select preserve native semantics" requirement.
- **Composite widgets**: N/A — `<select>` is a single native control, not a JS composite. (Multi/async = different component.)
- **State & events**: emits composed `change`/`input` on user selection; reflects `value` as a property (not an attribute, to avoid attribute/DOM thrash); `disabled`/`required`/`invalid` reflected for styling.
- **Disabled/readonly/loading**: `disabled` → native disabled (out of tab order). `<select>` has no native readonly → if needed, emulate by disabling + a hidden submitted value, and **document** it. No loading state.
- **Motion**: none (native popup animation is OS-owned).

## Layout Contract

- Display: inline/block control with intrinsic min width and field-compatible sizing.
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

| Name    | Description                        |
| ------- | ---------------------------------- |
| default | `<option>` / `<optgroup>` elements |
| `icon`  | optional custom chevron            |

## Styling Contract

### Public Tokens

`--ty-select-background`, `--ty-select-border-color`, `--ty-select-radius`, `--ty-select-padding-inline`, `--ty-select-min-block-size`, `--ty-select-icon-color`. Appearances remap these.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`select` (control), `icon` (chevron).

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

- Native `<select>` exposes `combobox`/`listbox` semantics natively — **do not override role**.
- Labeling comes from `tyui-field`/`<label for>`; the component forwards `id`/`aria-labelledby`/`aria-describedby` to the inner `<select>`.
- `aria-invalid` mirrored from field validation.

### Reference Requirements

- **APG reference**: Pattern: [APG Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) as the closest selection pattern, with the native `<select>` providing the actual platform behavior.
  - Direct requirements:
    - Select presents a list of options and allows one option to be chosen.
    - Options have flat string names; semantic structures inside options are not exposed as rich semantics.
    - Listbox-style options must not contain interactive elements; use Grid or Combobox/Listbox alternatives for rich interactive content.
    - Avoid very long option names and repeated prefixes that make screen-reader navigation inefficient.
    - Native `<select>` keyboard, typeahead, popup, and form behavior must not be overridden.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Select`.
  - Direct requirements:
    - Select is a wrapper around native `<select>`.
    - Prefer underline or outline appearances when surrounding contrast is less than 3:1.
    - Filled appearances require sufficient contrast against the immediate surrounding surface.
    - `onChange` fires when the user changes the native select value.
    - Disabled is native.
    - Controlled value, default value, and size map to native select behavior and styling.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- `<select>` has **no readonly** — spec must state this and give the disabled+hidden-input pattern if a readonly select is requested.
- Cross-browser `<option>` styling is limited; advanced option rendering is explicitly out of scope (→ combobox). Don't promise themed options.
- Form participation requires `ElementInternals`; without it the custom element won't submit. Make it a hard requirement.
- Mirroring author `<option>`s into an internal select needs a `slotchange` sync; keep it minimal and avoid rebuilding on every change.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: inline/block control with intrinsic min width and field-compatible sizing remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: decorative chevron only; option icons are not supported in native mode.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: decorative chevron only; option icons are not supported in native mode.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-select name="country"><option value="fi">Finland</option></tyui-select>
```

### Invalid

```html
<tyui-select><button>Not an option</button></tyui-select>
```

## Agent Guidance

- **Selection guidance** (`ai/components/select.md`): "Use `tyui-select` for single choice from a short static list. For search, multi-select, or rich options use `tyui-combobox`/`tyui-dropdown`."
- **Alternatives map**: `multi/async/search → tyui-combobox`, `2–5 visible choices → tyui-radio-group`, `binary → tyui-switch`.
- **Layout ownership**: component owns intrinsic min size + padding; parent/field owns width (often full-width in a form). layout.md: `min-block-size`, never fixed height.
- **Token usage**: appearance via `--ty-select-*`; contrast requirement (≥3:1 border vs surface) becomes a DESIGN.md accessibility note for filled variants.
- **Anti-patterns to reject**: overriding the native role; using Select where free text/multi is needed; readonly Select without the documented workaround; missing label/field association.
- **x-design-system metadata**:
  ```json
  {
    "intent": "single-select",
    "focusable": true,
    "formAssociated": true,
    "alternatives": { "search": "tyui-combobox", "multiselect": "tyui-combobox" },
    "accessibility": { "nativeRole": "preserved", "needsAssociatedLabel": true }
  }
  ```
- **Validation gates**: flag generated `tyui-select` without an associated label/field; flag `role` override; flag attempts at `multiple`/free-text.

## Tests

### Unit / Contract Tests

| Requirement                                     | Setup                  | Action                                    | Validation                                        |
| ----------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Form submission and `FormData`                  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Value/default selected option                   | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| `input`/`change` composed event payloads        | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Programmatic `value` silent                     | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Required validity and `reportValidity()` anchor | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled removal from Tab                       | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Native keyboard/typeahead not canceled          | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Option projection rejects rich content          | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                         | Setup                                                                     | Action                                                           | Validation                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| APG: Native selection behavior      | Render three static options in a labelled Select.                         | Use trusted keyboard to open, arrow/typeahead, and change value. | Native select updates value and emits composed user `input`/`change`; no custom role override exists |
| APG: Rich option guard              | Render an option containing a button, link, or heading.                   | Run design validation.                                           | Validation rejects rich/interactive option content and suggests Combobox/Grid alternative            |
| APG: Option-name quality            | Render options with long repeated prefixes.                               | Run content validation.                                          | Validation warns about repeated prefix/long names and suggests restructuring                         |
| APG: Label requirement              | Render Select without Field/label/aria-label.                             | Run accessibility validation.                                    | Validation fails until the native select has an associated name                                      |
| Fluent UI: Contrast guard           | Render filled-lighter and filled-darker selects on low-contrast surfaces. | Run visual/contrast validation.                                  | Border/surface contrast is at least 3:1 or validation recommends outline/underline                   |
| Fluent UI: Controlled value         | Render controlled Select and external "Select Blue" button.               | Click external button, then use native select.                   | Programmatic value update is silent; user change emits composed event with new value                 |
| Fluent UI: Disabled native behavior | Render disabled Select.                                                   | Press Tab and attempt pointer activation.                        | Native select is skipped/inert and retains disabled styling                                          |
| Fluent UI: Size styling             | Render small, medium, large.                                              | Inspect computed styles.                                         | Size changes use tokens and preserve native select semantics                                         |

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

| Area        | Required coverage                                                           |
| ----------- | --------------------------------------------------------------------------- |
| behavior.md | Native semantics first → real `<select>`, native keyboard/popup/validation. |
| behavior.md | One target = one action.                                                    |
| behavior.md | Focus native; visible ring.                                                 |
| behavior.md | User input → composed `change`/`input`; programmatic set silent.            |
| behavior.md | Disabled native; readonly limitation documented.                            |
| behavior.md | Composite rules N/A (single native control).                                |
| behavior.md | No custom motion.                                                           |


## sidebar

# Sidebar - Implementation Spec

> Source-of-truth order: **`spec/layout.md` (highest for layout primitives)** -> `requirements.md` -> `styles.md` -> `agentic-ui-design.md`.

## Identity

- Tag: `tyui-sidebar`
- Define: `@toyu-ui/define/sidebar`
- Status: implemented
- Native substrate: native custom element extending `HTMLElement`.
- Shadow DOM: none.
- Utility class: `.ty-sidebar`
- Category: layout primitive
- Component family: intrinsic layout
- Pattern type: fixed-plus-fluid two-region layout

## Intent

Use Sidebar for a two-region layout where one child has a preferred fixed size and the other child takes the remaining space. It collapses through intrinsic flex wrapping instead of viewport breakpoints.

Use it for navigation plus content, filter panel plus results, metadata plus detail, or media plus body. Do not use it for app-wide drawer behavior, overlay side panels, or arbitrary three-column shells.

## Selection Guidance

- Use when: exactly two primary regions exist and one region has a preferred size.
- Do not use when: the side region opens as an overlay, more than two columns are needed, or both regions should be equal cards.
- Prefer instead: `tyui-grid` for peer columns, `tyui-container` for page rails, dialog/drawer components for overlay side panels.
- Product-level variant preferences: generated design layers may set side width, gap, and collapse threshold through tokens.
- Agent rule: choose Sidebar when the layout sentence reads "filters beside results" or "nav beside content".

## Composition Contract

- Allowed children: exactly two direct children.
- Required parent: none.
- Required child components: none.
- Optional child components: nav, form filters, details, grids, cards.
- Disallowed nested interactive content: none beyond child rules.
- Composition anti-patterns: adding three or more direct children, using CSS order to move navigation after content while DOM says otherwise, using Sidebar for an overlay drawer.
- Child order: first child is the side region; second child is the main/content region.

## API

### Attributes

| Name          | Type                              | Reflects | Default | Notes                                                                             |
| ------------- | --------------------------------- | -------- | ------- | --------------------------------------------------------------------------------- |
| `side`        | `start \| end`                    | yes      | `start` | `end` maps to `flex-direction: row-reverse`; DOM order remains the reading order. |
| `side-size`   | CSS length token or length string | yes      | `18rem` | Preferred side region size.                                                       |
| `content-min` | CSS length token or length string | yes      | `50%`   | Minimum content size before wrap/collapse.                                        |
| `gap`         | `0 \| 1 \| 2 \| 3 \| 4`           | yes      | `3`     | Gap between regions.                                                              |
| `no-stretch`  | `boolean`                         | yes      | `false` | Prevents default cross-axis stretch.                                              |

### Properties

Mirror attributes with typed properties.

### Events

None. Sidebar is layout only.

### Event Semantics

Child events pass through light DOM.

### Slots

| Name    | Description         | Fallback | Slotted Styling Rules                                                |
| ------- | ------------------- | -------- | -------------------------------------------------------------------- |
| default | exactly two regions | none     | first child receives side policy; second child receives fluid policy |

### CSS Parts

None.

### CSS Custom Properties

`--ty-sidebar-size`, `--ty-sidebar-content-min-inline-size`, `--ty-sidebar-gap`, `--ty-layout-gap`.

### Attribute To CSS Mapping

The element maps attributes to the public CSS variables consumed by both `tyui-sidebar` and `.ty-sidebar`:

| Attribute     | CSS Variable                           | Mapping                                                                  |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `side`        | `--ty-sidebar-direction`               | `start` -> `row`; `end` -> `row-reverse`                                 |
| `side-size`   | `--ty-sidebar-size`                    | valid CSS length string; absent uses `18rem`                             |
| `content-min` | `--ty-sidebar-content-min-inline-size` | valid CSS length string; absent uses `50%`                               |
| `gap`         | `--ty-sidebar-gap`                     | `0..4` -> `var(--ty-space-*, fallback)`; invalid values fall back to `3` |
| `no-stretch`  | `--ty-sidebar-align`                   | absent -> `stretch`; present -> `flex-start`                             |

## Behavior

### State Model

- Controlled state: side, side-size, content-min, gap, no-stretch.
- Uncontrolled/default state: start side, 18rem side size, 50 percent content minimum, gap token 3.
- Parent-owned state: page region and available width.
- Child-owned state: semantics, focus, scroll.
- Programmatic update behavior: CSS updates only.

### Focus Model

Sidebar is not focusable. Focus order follows DOM order. Visual `side="end"` must not create a misleading reading order.

### Keyboard Contract

No keyboard behavior. Navigation, filters, and content controls own their own keyboard contracts.

## Layout Contract

- Display: flex.
- Intrinsic size: side child uses preferred flex basis; content child consumes remaining space.
- Shrink policy: content child has `min-inline-size: min(100%, content-min)`; side child can wrap above content when space runs out.
- Wrap policy: wraps to one column when the content minimum cannot fit.
- Flexible slots: second child is fluid.
- Fixed slots: first child has preferred side size.
- Parent owns: page placement and vertical rhythm.
- Component owns: side/content flex relationship and gap.
- Container-query thresholds: no explicit breakpoint; flex wrapping handles collapse.
- Container behavior: must not set `container-type`; consumers may add containment outside the primitive when needed.
- Scroll / overflow policy: children own internal scroll.

### Direct Child Contract

| Child  | Role           | Flex Policy                           | Notes                                                        |
| ------ | -------------- | ------------------------------------- | ------------------------------------------------------------ |
| first  | side region    | `flex-basis: side-size; flex-grow: 1` | Navigation, filters, media, metadata.                        |
| second | content region | `flex-basis: 0; flex-grow: 999`       | Main content; must support `min-inline-size:0` where needed. |

## Styling Contract

### Public Tokens

Use `--ty-sidebar-*` tokens. Design layers may set side size and gap from product layout principles.

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
- ARIA attributes: consumers should use native landmarks inside children when the regions need names.
- Reading order: DOM order must match reading order. Do not use `side="end"` to hide an order problem.

## Implementation Requirements

- Implement as a native custom element with no shadow DOM.
- Follow `spec/behavior.md` by preserving native child semantics, focus order, and event propagation; Sidebar adds no interaction.
- Define idempotently through `defineTyuiSidebar`.
- Export `@toyu-ui/elements/sidebar` and `@toyu-ui/define/sidebar`.
- Provide `.ty-sidebar` utility CSS.
- Warn in development when direct child count is not two.
- Do not calculate collapse with JavaScript.

## Examples

### Storybook Examples

```html story title="Filters And Results"
<tyui-sidebar side-size="16rem" content-min="55%" gap="4">
  <aside>
    <h3>Filters</h3>
    <tyui-flex direction="column" gap="2">
      <tyui-checkbox checked>Available</tyui-checkbox>
      <tyui-checkbox>Has owner</tyui-checkbox>
    </tyui-flex>
  </aside>
  <main>
    <tyui-grid min-item-size="12rem">
      <section style="padding:16px;border:1px solid CanvasText;">Result A</section>
      <section style="padding:16px;border:1px solid CanvasText;">Result B</section>
    </tyui-grid>
  </main>
</tyui-sidebar>
```

```html story title="Media And Body"
<tyui-sidebar side-size="12rem" content-min="60%" gap="3">
  <tyui-frame ratio="1/1">
    <div style="display:grid;place-items:center;background:CanvasText;color:Canvas;">Image</div>
  </tyui-frame>
  <tyui-flex direction="column" gap="2">
    <h3>Component preview</h3>
    <p>The body region takes remaining space and wraps below the media when narrow.</p>
    <tyui-cluster>
      <tyui-button appearance="primary">Open</tyui-button>
      <tyui-button>Dismiss</tyui-button>
    </tyui-cluster>
  </tyui-flex>
</tyui-sidebar>
```

### Invalid Examples

```html
<!-- Sidebar accepts exactly two direct children. -->
<tyui-sidebar>
  <aside>Filters</aside>
  <main>Results</main>
  <section>Extra panel</section>
</tyui-sidebar>
```

## Tests

| Requirement            | Setup                                                                    | Action             | Expected Result                                                    |
| ---------------------- | ------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------ |
| Two-region flex works  | Render two children                                                      | Measure widths     | First child uses side size; second fills remaining space.          |
| Wrap collapse works    | Constrain container                                                      | Measure rows       | Content wraps below side region without JS.                        |
| Child count warning    | Render three direct children in dev                                      | Observe console    | Development warning is emitted.                                    |
| No focus stop          | Render focusable children                                                | Press Tab          | Focus enters first focusable child in DOM order.                   |
| `side=end` mapping     | Render `side="end"`                                                      | Read CSS variables | `--ty-sidebar-direction` is `row-reverse`; DOM order is unchanged. |
| Element/utility parity | Compare `.ty-sidebar` with matching CSS variables and element attributes | Read core styles   | Core rules match.                                                  |

## Agent Guidance

- Use Sidebar for two-region fixed-plus-fluid layouts.
- Keep app drawer and overlay behavior out of Sidebar.
- Put landmarks inside children when regions need names.
- Use Grid for more than two peer columns.


## table

# Table — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-table`, `tyui-table-header`, `tyui-table-header-cell`, `tyui-table-body`, `tyui-table-row`, `tyui-table-cell`, `tyui-table-selection-cell`, `tyui-table-cell-layout`
- Define: `@toyu-ui/define/table`
- Status: draft
- Native substrate: **native `<table> <thead> <tbody> <tr> <th> <td>`** (Fluent's "primitive, low-level" table). Sort control = native `<button>` inside `<th>`; selection = native `<input type=checkbox/radio>`.
- Shadow DOM: minimal/none. Prefer **light DOM** so native table semantics and the `grid` keyboard pattern work without re-mapping roles. Styling via tokens + parts on the host.
- Category: data display (becomes an interactive `grid` only when keyboard nav/selection is added)
- Component family: data display/composite when interactive
- Pattern type: table by default; grid when interactive
- Fluent / reference analogue: see API and Accessibility.

## Intent

Display 2D data with full control over markup; the low-level primitive (use a future `tyui-data-grid` for batteries-included sorting/selection/virtualization).
Do **not** use for single-column lists (→ `tyui-list`) or layout.

## Selection Guidance

- Use when: tabular data with rows/columns and optional explicit selection/sort behavior.
- Do not use when: layout grids, cards, menus, or spreadsheet editing without grid contract.
- Prefer instead: CSS grid/layout for layout, Listbox/Grid for interactive selection-heavy data.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Row selection and row actions are separate targets; sorting header is one button target.

## Composition Contract

- Allowed children: table sections/rows/cells/header/selection cells only.
- Required parent: data region or form when selection submitted by app.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  Structural (header/body/row/cell). `tyui-table-cell-layout`: `media`, `main`, `description`, `content`.
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-table role="grid"><button><a href="/">Nested actions</a></button></tyui-table>

## API

### tyui-table

| Name                 | Type                             | Reflects | Default  | Notes                                           |
| -------------------- | -------------------------------- | -------- | -------- | ----------------------------------------------- |
| `size`               | `extra-small \| small \| medium` | yes      | `medium` | row density                                     |
| `sortable`           | `boolean`                        | yes      | `false`  | enables header sort affordance                  |
| `no-native-elements` | `boolean`                        | yes      | `false`  | div+flex fallback (re-adds roles) — discouraged |

### tyui-table-header-cell

| `sortable` (bool), `sort-direction` (`ascending\|descending`) → `aria-sort`; slots `sort-icon`, `aside`, `button`. |

### tyui-table-selection-cell

| `type` (`checkbox\|radio`), `checked` (`boolean\|"mixed"`), `subtle`, `invisible`. Renders a native checkbox/radio. |

### tyui-table-row

| `appearance` (`none\|neutral\|brand`) — selection styling. |

### Events

- `sort-change` — composed; `{ columnId, direction }` on user sort.
- `selection-change` — composed; `{ selectedItems, allSelected }` on user selection.
  Both are user-initiated; programmatic state set is silent.

### Slots

Structural (header/body/row/cell). `tyui-table-cell-layout`: `media`, `main`, `description`, `content`.

### CSS parts

`table`, `header`, `header-cell`, `sort`, `row`, `cell`, `selection-cell`.

### CSS custom properties

`--ty-table-row-min-block-size`, `--ty-table-cell-padding-inline`, `--ty-table-border-color`, `--ty-table-row-hover`, `--ty-table-row-selected`, `--ty-table-min-inline-size`.

### Event Semantics

- User-initiated events: - `sort-change` — composed; `{ columnId, direction }` on user sort.
- `selection-change` — composed; `{ selectedItems, allSelected }` on user selection.
  Both are user-initiated; programmatic state set is silent.
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: data region or form when selection submitted by app.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                             | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                                          | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Static table uses page Tab only; interactive grid mode defines cell/row roving focus and selection keys. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                                          | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- Use real `<table>` markup: semantics, header association, and screen-reader row/column reading are **free**. This is Oat's exact thesis applied to data.
- `noNativeElements` (div+flex) mode exists in Fluent for layout flexibility, but the **default and recommended path is native elements**; only fall back to `role`-annotated divs when `display:table` truly can't do the layout, and then you must re-add every role.
- Sorting: a native `<button>` in the header toggles `aria-sort` on the `<th>`. Keyboard grid navigation (when interactive) = **focusgroup polyfill** following the `role="grid"` pattern.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Static table uses page Tab only; interactive grid mode defines cell/row roving focus and selection keys.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: data region or form when selection submitted by app.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Static table uses page Tab only; interactive grid mode defines cell/row roving focus and selection keys.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                                   | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Static table uses page Tab only; interactive grid mode defines cell/row roving focus and selection keys. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                                         | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                                    | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                              | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Row selection and row actions are separate targets; sorting header is one button target.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A unless an explicit row/cell action opens another component.
- Closes on: N/A.
- DOM focus while open: N/A for static table; grid mode manages focus inside cells/rows.
- Next Tab behavior: static table follows page order; grid mode uses one documented grid tab stop.
- Arrow-key entry behavior: N/A for static table; grid mode owns APG grid arrow navigation.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A unless grid edit/selection mode documents it.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: sorting/selection motion never changes row/cell semantics.

### Form Contract

- Form-associated: Not inherently form-associated; selection value emits to app, not submitted unless wrapped.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not inherently form-associated; selection value emits to app, not submitted unless wrapped.

### Lifecycle And Cleanup

- External event listeners: Sort, selection, resize, scroll, and optional virtualization observers clean up on disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: static table is not focusable. Interactive (grid) mode: **single tab stop**, arrow keys move the active cell, Home/End/PageUp/Down per grid pattern (focusgroup). Visible `:focus-visible` on the active cell/row, distinct from `selected`/hover.
- **Hit targets**: separate targets for separate jobs — sort button, row-selection checkbox, and per-cell actions (`TableCellActions`) are each their own focusable target. Never make the whole row a single button that also contains a checkbox + actions. Row click-to-select is allowed only as an enhancement layered on the checkbox's state, not as an overloaded target.
- **Native behavior**: native table semantics + native checkbox/radio + native sort button; no role override in native mode.
- **Composite widgets**: the table owns grid roving focus and the shared selection/sort state; cells/rows dispatch narrow events the table aggregates (behavior.md composite ownership). Cell actions that are themselves menus are foreign composites the table ignores.
- **State & events**: `aria-sort`/selection reflected via ARIA + attributes; user sort/selection emit composed events; programmatic updates silent.
- **Disabled/readonly/loading**: disabled row/checkbox uses native disabled or `disabled-focusable` (keep in grid order). Loading uses `aria-busy` on the table region + skeleton rows (behavior.md loading rule). Readonly = display-only (no selection cells).
- **Motion**: row hover/selection transitions tokenized; reduced-motion safe. No layout-shifting animation during sort.

## Layout Contract

- Display: native table layout by default; scroll container owns overflow; grid mode defines sticky/virtualization policy.
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

Structural (header/body/row/cell). `tyui-table-cell-layout`: `media`, `main`, `description`, `content`.

## Styling Contract

### Public Tokens

`--ty-table-row-min-block-size`, `--ty-table-cell-padding-inline`, `--ty-table-border-color`, `--ty-table-row-hover`, `--ty-table-row-selected`, `--ty-table-min-inline-size`.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`table`, `header`, `header-cell`, `sort`, `row`, `cell`, `selection-cell`.

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

- Static table: native `table`/`row`/`columnheader`/`cell` roles — **do not override** (Fluent: "Don't override the role").
- **Once any keyboard navigation/selection exists**, the structure must follow the **`role="grid"` pattern** (W3C) — cells become `gridcell`, arrow-key navigation, single tab stop.
- Name the table: `aria-labelledby` (preceding heading) or `aria-label`.
- Sortable header: `<th aria-sort="ascending|descending|none">` + a `<button>` for the action; narrate via the button.
- Selection: `<input type=checkbox>` per row + a header "select all" (`aria-checked="mixed"` for partial). Selected row reflects via attribute/`aria-selected` in grid mode.

### Reference Requirements

- **APG reference**: Patterns: [APG Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/) for static tabular data and [APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) when keyboard navigation or selection makes the table interactive.
  - Direct requirements:
    - Static table is not an interactive widget; cells are not focusable/selectable by the table itself.
    - Use native HTML `table` whenever possible.
    - If the table becomes a grid, it is a composite widget with one tab stop and author-managed focus movement inside.
    - Data-grid arrows move focus by cell; Home/End move within row; Ctrl+Home/Ctrl+End move to first/last cell when supported.
    - If selection is supported, common shortcuts include Shift+Space for row selection and Ctrl+A for select all when implemented.
    - Grid cells should focus either the cell itself for text/graphics or the single contained widget when that widget does not use arrow keys.
    - Interactive elements inside a static table remain normal page tab stops unless grid mode is explicitly implemented.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Table`.
  - Direct requirements:
    - Table is low-level; prefer DataGrid when common features and first-class accessibility support are enough.
    - Always include a header row.
    - Use `aria-labelledby` when visible label text exists, or `aria-label` otherwise.
    - Set a `min-width` so the table remains usable at high zoom or on small screens.
    - Do not override Table control roles.
    - Once any keyboard navigation exists, the component must follow the ARIA `role="grid"` pattern.
    - `noNativeElements` switches to div/flex and must re-add all roles manually.
    - Cell actions that appear on hover must also appear/reveal on focus and remain keyboard accessible.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- **The `grid` upgrade is the trap**: the moment you add keyboard nav or selection, ARIA requires the full `role="grid"` pattern — partial implementations are worse than none. Spec must gate "interactive table ⇒ grid pattern + focusgroup."
- `noNativeElements` switches from `display:table` to flex and **drops all native roles** — every role/relationship must be re-added manually; recommend against unless layout demands it.
- Set a `min-width` (Fluent) so the table stays usable at high zoom / small screens; horizontal scroll container owned by the parent.
- "Select all" tri-state needs `aria-checked="mixed"`; keep it in sync with row checkboxes.
- Cell actions appear on row hover/focus — they must remain reachable by keyboard (focus within row reveals them), not hover-only (behavior.md: hover must not be the only way to reach an action).

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: native table layout by default; scroll container owns overflow; grid mode defines sticky/virtualization policy remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: cell images/icons follow their own alt/decorative rules.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: cell images/icons follow their own alt/decorative rules.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-table
  ><tyui-table-row><tyui-table-cell>File.txt</tyui-table-cell></tyui-table-row></tyui-table
>
```

### Invalid

```html
<tyui-table role="grid"
  ><button><a href="/">Nested actions</a></button></tyui-table
>
```

## Agent Guidance

- **Selection guidance** (`ai/components/table.md`): "Use the low-level `tyui-table` only when you need custom features; otherwise prefer `tyui-data-grid`. Always include a header row and a table name. Adding keyboard nav/selection means committing to the grid pattern."
- **Alternatives map**: `common features → tyui-data-grid`, `single column → tyui-list`, `key/value → description list`.
- **Layout ownership**: table owns row density/cell padding/sort affordance; **parent owns width, min-width, and horizontal scroll**. layout.md: `min-inline-size` + container scroll, logical properties.
- **Token usage**: density/hover/selected via `--ty-table-*`; selected row indicated by more than color (checkbox + `aria-selected`).
- **Anti-patterns to reject**: role override on native table; whole-row single button containing checkbox/actions; hover-only cell actions; interactive table without grid pattern; `noNativeElements` without re-added roles; missing table name/header.
- **x-design-system metadata**:
  ```json
  {
    "intent": "data-table",
    "composite": "grid when interactive",
    "rovingFocus": "focusgroup-polyfilled",
    "accessibility": {
      "nativeRolesPreserved": true,
      "interactiveRequiresGridPattern": true,
      "needsAccessibleName": true
    }
  }
  ```
- **Validation gates**: flag missing `aria-label`/`aria-labelledby`; flag role overrides; flag interactive table lacking grid roles/focus; flag hover-only actions; flag overloaded row targets.

## Tests

### Unit / Contract Tests

| Requirement                                                                 | Setup                  | Action                                    | Validation                                        |
| --------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Native static table has correct roles and no extra tab stop                 | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Sortable header button updates `aria-sort` and emits composed `sort-change` | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Checkbox/radio selection emits `selection-change`                           | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Grid mode arrow navigation and Home/End                                     | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled rows/cells behavior                                                | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Virtualization/row replacement keeps selection by key                       | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Hover-only actions rejected                                                 | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Accessible name validation                                                  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                                   | Setup                                                                         | Action                                                 | Validation                                                                                                                        |
| --------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| APG: Static table semantics                   | Render a labelled native table with header/body rows.                         | Press `Tab` through the table.                         | Table itself and plain cells are not tab stops; native table roles/header associations are preserved                              |
| APG: Grid upgrade completeness                | Enable keyboard navigation/selection.                                         | Press Tab, Arrow keys, Home, End, Ctrl+Home, Ctrl+End. | Exactly one grid entry tab stop exists and focus moves per APG grid rules                                                         |
| APG: Cell focus target                        | Render grid cells with text, with a single button, and with multiple widgets. | Arrow into each cell.                                  | Text cells focus the cell; single-widget cells may focus the widget; multiple-widget cells require explicit edit/interaction mode |
| APG: Selection shortcut                       | Render selectable grid rows.                                                  | Press Shift+Space on a focused row/cell.               | Row selection updates checkbox/aria-selected and emits composed selection event                                                   |
| Fluent UI: Header and name                    | Render table without header or accessible name.                               | Run validation.                                        | Missing header row/name fails                                                                                                     |
| Fluent UI: Role override guard                | Render native table cells with custom roles.                                  | Run validation.                                        | Role overrides fail unless `no-native-elements`/grid mode requires explicit roles                                                 |
| Fluent UI: High zoom min width                | Render table at 400 percent zoom.                                             | Inspect overflow behavior.                             | Table has documented min inline size and parent scroll ownership; content remains reachable                                       |
| Fluent UI: Cell actions keyboard reachability | Render row actions visible on hover.                                          | Focus through row and cell actions.                    | Actions become visible on focus within, are reachable, and are not hover-only                                                     |
| Fluent UI: DataGrid alternative               | Ask generator for common sortable/selectable grid.                            | Run selection guidance.                                | Generator recommends `tyui-data-grid` unless low-level custom Table is justified                                                  |

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

| Area        | Required coverage                                                                  |
| ----------- | ---------------------------------------------------------------------------------- |
| behavior.md | Native semantics first → real `<table>` markup, native checkbox/radio/sort button. |
| behavior.md | Separate targets for sort / select / cell actions; no overloaded row.              |
| behavior.md | Static = not focusable; interactive = grid pattern single tab stop via focusgroup. |
| behavior.md | Composite owns roving + selection/sort state; ignores foreign cell menus.          |
| behavior.md | User sort/selection → composed events; programmatic silent.                        |
| behavior.md | Loading via `aria-busy` + skeletons; disabled-focusable for stable order.          |
| behavior.md | Cell actions keyboard-reachable (not hover-only).                                  |
| behavior.md | Motion tokenized, reduced-motion safe.                                             |


## toolbar

# Toolbar — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-toolbar` (+ `tyui-toolbar-group`, `tyui-toolbar-divider`; buttons are `tyui-button`/`tyui-toggle-button` with a toolbar context)
- Define: `@toyu-ui/define/toolbar`
- Status: draft
- Native substrate: `<div role="toolbar">` containing native buttons/links; grouping via `<div role="group">`; dividers decorative.
- Shadow DOM: minimal (root renders `role="toolbar"` wrapper + `<slot>`). Controls are light-DOM native buttons.
- Category: composite command container (roving tabindex via **focusgroup polyfill**)
- Component family: composite command group
- Pattern type: toolbar
- Fluent / reference analogue: see API and Accessibility.

## Intent

Group **3+** related controls (buttons, toggle/menu buttons, checkboxes) into a single keyboard-efficient command surface.
Do **not** use for 1–2 controls (just place them) or for primary page navigation (→ `tyui-nav`).

## Selection Guidance

- Use when: group related always-visible commands.
- Do not use when: menus, tabs, forms, or arbitrary layout rows.
- Prefer instead: Menu for overflow/transient commands, Tabs for views, Fieldset for form groups.
- Product-level variant preferences: choose the least-interactive variant that preserves native semantics and behavior.md target ownership.
- One semantic target / one action rule: Each command is a separate target; separators are inert.

## Composition Contract

- Allowed children: peer buttons/links/toggles and optional separators/groups; no nested composites unless documented.
- Required parent: page/editor/region that owns command effects.
- Required child components: N/A unless listed in the API slots below.
- Optional child components: see Slots and Examples.
- Allowed slots:
  `default` (controls/groups/dividers).
- Disallowed nested interactive content: any interactive descendant not explicitly named as an allowed separate target.
- Composition anti-patterns: <tyui-toolbar><tyui-menu><tyui-menu-item>Nested</tyui-menu-item></tyui-menu></tyui-toolbar>

## API

### tyui-toolbar

| Name             | Type                               | Reflects | Default  | Notes                       |
| ---------------- | ---------------------------------- | -------- | -------- | --------------------------- |
| `size`           | `small \| medium \| large`         | yes      | `medium` | propagates to children      |
| `vertical`       | `boolean`                          | yes      | `false`  | layout + `aria-orientation` |
| `checked-values` | property `Record<string,string[]>` | —        | —        | for toggle/radio groups     |

### Events

- `checked-value-change` — composed; emitted when a toggle/radio child changes, payload `{ name, checkedItems }`. This is the one coordinated public event (behavior.md: parent owns shared composite state).

### Slots

`default` (controls/groups/dividers).

### CSS parts

`root`, `divider`.

### CSS custom properties

`--ty-toolbar-gap`, `--ty-toolbar-padding`, `--ty-toolbar-background`, `--ty-toolbar-divider-color`, `--ty-toolbar-min-block-size`.

### Event Semantics

- User-initiated events: - `checked-value-change` — composed; emitted when a toggle/radio child changes, payload `{ name, checkedItems }`. This is the one coordinated public event (behavior.md: parent owns shared composite state).
- Programmatic state changes that must not emit user events: reflected attribute/property updates are silent unless the Events table explicitly says otherwise.
- Native events that are re-dispatched: preserve native semantics; do not wrap native activation/change events unless needed for composed shadow-boundary API.
- Internal coordination events: component-specific, non-public, and ignored by parents that do not own the composite.
- Cancellation behavior: only cancel default browser behavior when required by the documented keyboard/popup/composite pattern.

## Behavior

### State Model

- Controlled state: public attributes/properties listed in API; app-owned where the component exposes state reflection.
- Uncontrolled / default state: defaults listed in API are used when attributes are absent.
- Derived internal state: private only; reflected through documented attributes, ARIA, pseudo-classes, or CSS variables when public.
- Parent-owned state: page/editor/region that owns command effects.
- Child-owned state: children own only native local state unless this spec assigns ownership to a parent composite.
- Programmatic update behavior: update rendering/ARIA without emitting user-facing change events.
- User update behavior: emit only the public events documented in API.
- State reset behavior: reset to API defaults or native form reset behavior where applicable.

### State Transition Matrix

| Current State                    | User / Programmatic Action             | Next State                        | Event                                 | Focus Result                                                                                                 | Notes                                           |
| -------------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Default                          | Programmatic attribute/property update | Reflected documented state        | None unless documented                | Focus unchanged                                                                                              | State/events rule from behavior.md.             |
| Default / interactive state      | Valid user activation or input         | Component-specific state from API | Public composed event when documented | Toolbar is one Tab stop; arrows/Home/End rove among enabled controls; Enter/Space activates current command. | Preserve native behavior first.                 |
| Disabled / inert where supported | User pointer or keyboard input         | State unchanged                   | None                                  | Focus follows disabled contract                                                                              | Disabled-focusable exceptions must be explicit. |

### Native Behavior First

- It's a flex `role="toolbar"` row/column of **native buttons**. The only widget logic is **roving tabindex** so the whole toolbar is one tab stop with arrow-key traversal — implemented with the **`focusgroup` polyfill** (native attribute when supported; ~30-line roving fallback otherwise). No bespoke key code.
- `size`/`vertical`/`appearance` propagate to child buttons via attribute/inherited CSS, not JS re-render.
- Wrapping/overflow = CSS cluster (layout.md) + an optional overflow menu.

- Native element used: see Identity and DOM sections.
- Native behavior preserved: Toolbar is one Tab stop; arrows/Home/End rove among enabled controls; Enter/Space activates current command.
- Custom behavior added: only behavior commitments below and reference-pattern requirements in Accessibility.
- Why custom behavior is necessary: design-system parity, composite coordination, popup lifecycle, or accessibility wiring native HTML cannot express alone.

### Focus Model

- Focus owner: page/editor/region that owns command effects.
- `delegatesFocus`: no unless the DOM section explicitly opts into shadow focus delegation.
- Tabbable elements: Toolbar is one Tab stop; arrows/Home/End rove among enabled controls; Enter/Space activates current command.
- Roving tabindex: only when the APG/Fluent reference requires it.
- Active descendant: only for combobox/listbox-like controls; otherwise N/A.
- Focus restoration: required for popups/overlays and documented in Popup / Overlay Contract.
- Focus trap: only modal dialog or explicitly trapped popover mode.
- Focus-visible treatment: keyboard focus must be visible and distinct from hover/selected/active/pressed states.
- Pointer focus treatment: pointer interaction must not move DOM focus unless native activation or the documented pattern requires it.

### Keyboard Contract

| Key             | Context                                  | Action                                                                                                       | Prevent Default                       | Event                               | Notes                                    |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ----------------------------------- | ---------------------------------------- |
| Tab / Shift+Tab | Sequential navigation                    | Toolbar is one Tab stop; arrows/Home/End rove among enabled controls; Enter/Space activates current command. | No, except trapped modal focus cycles | None                                | Defines tab-order participation.         |
| Enter / Space   | Activation-capable target                | Use native activation or documented APG behavior                                                             | Only when replacing native behavior   | Public event if documented          | One target = one action.                 |
| Escape          | Popup/overlay/composite where applicable | Close or dismiss only when documented                                                                        | Yes when handled                      | open/dismiss event if documented    | No-op for non-popup components.          |
| Arrow keys      | Composite widgets only                   | Follow selected APG pattern                                                                                  | Yes when roving/composite handles it  | None or documented navigation event | Non-composites preserve native behavior. |

### Pointer And Hit Target Contract

- Primary hit target: Each command is a separate target; separators are inert.
- Secondary hit targets: must be separate focusable controls, slots, or mode-specific entries.
- Hover behavior: may preview or style only; must not select, dismiss, navigate, toggle, or steal focus unless this spec documents a menu-like exception.
- Pressed / active behavior: mirrors native active state or documented selected/checked/expanded state.
- Minimum target size: follow layout tokens and do not shrink interactive controls below the design-system minimum target.
- Touch / pen considerations: same target ownership as mouse; no hover-only required behavior.
- Overloaded-target risks: reject generated output matching the anti-example in Selection/Composition.

### Popup / Overlay Contract

- Opens on: N/A — Toolbar is persistent, not an overlay.
- Closes on: N/A.
- DOM focus while open: N/A.
- Next Tab behavior: toolbar is one tab stop; next Tab leaves the toolbar after roving entry.
- Arrow-key entry behavior: arrow keys rove among peer controls inside the toolbar.
- Outside click / pointerdown behavior: N/A.
- Escape behavior: N/A unless a child control owns Escape.
- Focus restoration on close: N/A.
- Behavior while enter / exit motion is running: layout/overflow transitions never change roving-focus ownership.

### Form Contract

- Form-associated: Not form-associated; controls inside may be form controls only if toolbar explicitly supports them.
- Submitted value: native form controls only; otherwise N/A.
- `FormData` behavior: native form controls only; otherwise N/A.
- Validity states: native form controls or documented validation wrappers only.
- `checkValidity()` / `reportValidity()`: preserved for native/form-associated controls only.
- Name propagation: native/form-associated controls only.
- Required / readonly / disabled behavior: Not form-associated; controls inside may be form controls only if toolbar explicitly supports them.

### Lifecycle And Cleanup

- External event listeners: Roving focus and slotchange listeners initialize on connect and clean up on disconnect.
- Observers: disconnect on component removal and when no longer needed.
- Timers: clear on close/disconnect; no orphan delayed hover, dismiss, or animation timers.
- Generated IDs: stable for ARIA relationships and not regenerated on every render.
- Slotchange work: validate composition and update ARIA/relationship wiring without emitting user events.
- Cleanup requirements: all listeners, observers, timers, and top-layer state removed on disconnect.

### Current Behavior Commitments

- **Focus**: **roving tabindex** — exactly one child is tabbable; `ArrowLeft/Right` (or `Up/Down` when vertical) move active focus; `Home`/`End` jump to ends (W3C toolbar pattern). Implemented via focusgroup. Visible `:focus-visible` on the active control. Focus enters on Tab only (explicit action).
- **Hit targets**: each control is one action with its own focusable target; dividers/groups are not targets. Do not overload a toolbar button with a second hover/secondary action — use a split/menu button (separate targets).
- **Native behavior**: children are native buttons (Enter/Space native). Toolbar adds navigation, not activation.
- **Composite widgets**: the toolbar **owns** roving focus and grouped checked state; children dispatch narrow internal change events the toolbar aggregates. It must ignore events from nested composites it doesn't own (e.g. a menu opened from a menu button).
- **State & events**: toggle/radio state reflected on children (`aria-pressed`/`aria-checked`); toolbar emits `checked-value-change` on user change only.
- **Disabled/readonly/loading**: disabled commands in a toolbar should use **`disabled-focusable`** (kept in roving order, `aria-disabled`) so the tab/arrow sequence stays stable (behavior.md disabled-focusable case + Fluent commandbar guidance).
- **Motion**: none beyond tokenized hover/focus; overflow expand/collapse is reduced-motion safe.

## Layout Contract

- Display: inline-flex command row/column with wrapping or overflow policy.
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

`default` (controls/groups/dividers).

## Styling Contract

### Public Tokens

`--ty-toolbar-gap`, `--ty-toolbar-padding`, `--ty-toolbar-background`, `--ty-toolbar-divider-color`, `--ty-toolbar-min-block-size`.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API. Do not document generated/private variables as stable hooks.

### CSS Parts

`root`, `divider`.

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

- Root: `role="toolbar"` + `aria-label`/`aria-labelledby` (required when >1 toolbar). `aria-orientation` when `vertical`.
- Groups: `role="group"`.
- Dividers: `role="separator"` + `aria-orientation`, non-focusable.
- Toggle/radio controls keep their native/ARIA pressed/checked semantics; radio sets use `ToolbarRadioGroup` semantics (`role="radiogroup"`).

### Reference Requirements

- **APG reference**: Pattern: [APG Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/).
  - Direct requirements:
    - Toolbar groups a set of controls and communicates grouping/purpose to screen readers.
    - Use toolbar only when the group contains three or more controls.
    - Keyboard tab sequence includes one stop for the toolbar; arrow keys move focus among controls.
    - Horizontal toolbar uses Left/Right arrows; vertical toolbar uses Up/Down arrows.
    - Tab and Shift+Tab move focus into and out of the toolbar.
    - Home/End optionally move to first/last control.
    - Avoid controls whose operation needs the same arrow keys used for toolbar navigation.
    - Toolbar has `role="toolbar"` and a label when visible label text is unavailable; vertical toolbar sets `aria-orientation="vertical"`.
- **Fluent UI reference**: Source component: Fluent UI React v9 `Toolbar`.
  - Direct requirements:
    - Use toolbar only for groups of three or more controls.
    - Label each toolbar when the application contains more than one.
    - `size` controls toolbar control spacing; `vertical` changes orientation.
    - `checkedValues`, `defaultCheckedValues`, and `onCheckedValueChange` coordinate toolbar toggle/radio state.
    - ToolbarButton/ToggleButton/RadioButton respect toolbar sizing.
    - ToolbarDivider is not interactive.
    - Overflow uses Menu and the overflow trigger participates in toolbar navigation.

### Accessibility Guidance

- Do: preserve native semantics, visible focus, accessible names/descriptions, and documented APG behavior.
- Do not: import unrelated APG roles or keyboard models; do not use color/icon/position as the only semantic signal.
- Author responsibilities: provide labels, descriptions, alt text, and valid child structure where this spec requires author input.
- Known tradeoffs:
- Roving focus is the heart of the component and the part that must degrade gracefully if focusgroup polyfill is absent → fall back to all-tabbable (still usable, just more tab stops). Document the enhancement boundary.
- Mixing menu buttons: opening a menu moves focus into the menu (a separate composite); on close, focus returns to the menu button — the toolbar must not treat the menu's arrow keys as its own.
- Vertical toolbars must swap arrow axis and set `aria-orientation="vertical"`.
- Overflow: collapse least-important commands into a `tyui-menu`; the overflow trigger participates in roving order.

## Motion Contract

- Motion tokens: component-specific transition tokens; no literal durations/easings in generated output.
- CSS-only motion: preferred unless popup/composite lifecycle requires JS state coordination.
- Reduced-motion behavior: inline-flex command row/column with wrapping or overflow policy remains understandable with motion disabled.
- Delayed unmount behavior: if visually present after logical close, it is non-interactive and hidden from accessibility APIs.
- Interaction behavior during motion: state and focus follow logical open/closed/selected values, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and component/theme motion tokens.

## Icons And Media

- Icon source: design-system icon components or plain slotted media documented by API.
- Icon accessible name policy: icons need labels via visible text, aria-label, or tooltip association.
- Decorative icon policy: hide from assistive tech when duplicate of text.
- Media slot behavior: icons need labels via visible text, aria-label, or tooltip association.
- Media cloning behavior: do not clone slotted media; preserve author-provided semantics.
- Image fallback behavior: native image fallback or explicit fallback slot only.

## Examples

### Valid

```html
<tyui-toolbar aria-label="Text formatting"
  ><tyui-button>Bold</tyui-button><tyui-button>Italic</tyui-button></tyui-toolbar
>
```

### Invalid

```html
<tyui-toolbar
  ><tyui-menu><tyui-menu-item>Nested</tyui-menu-item></tyui-menu></tyui-toolbar
>
```

## Agent Guidance

- **Selection guidance** (`ai/components/toolbar.md`): "Group 3+ related commands. Label every toolbar. Use roving focus (single tab stop). Collapse extras into an overflow menu, don't wrap into many rows."
- **Alternatives map**: `1–2 actions → bare tyui-buttons`, `page nav → tyui-nav`, `form actions row → cluster layout`.
- **Layout ownership**: toolbar owns arrangement, grouping, dividers, overflow, and roving; **parent owns the toolbar's outer width/placement**. layout.md: cluster + container query, not viewport breakpoints; `min-block-size`, not fixed height.
- **Token usage**: gap/padding/divider via `--ty-toolbar-*`; child appearance via button tokens.
- **Anti-patterns to reject**: toolbar with <3 controls; unlabeled toolbar when multiple exist; focusable dividers; all-tabbable controls when roving is expected; overloaded buttons; wrapping rows instead of overflow.
- **x-design-system metadata**:
  ```json
  {
    "intent": "command-group",
    "composite": true,
    "rovingFocus": "focusgroup-polyfilled",
    "accessibility": {
      "role": "toolbar",
      "requiresLabel": "when multiple",
      "disabledUsesFocusable": true
    }
  }
  ```
- **Validation gates**: flag `role` override; flag missing toolbar label with multiple toolbars; flag focusable separators; flag toolbars under 3 controls (warn).

## Tests

### Unit / Contract Tests

| Requirement                                                  | Setup                  | Action                                    | Validation                                        |
| ------------------------------------------------------------ | ---------------------- | ----------------------------------------- | ------------------------------------------------- |
| Single Tab stop                                              | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Arrow/Home/End movement by orientation and direction         | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Disabled vs disabled-focusable commands                      | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| `checked-value-change` for grouped buttons                   | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Multiple toolbars require labels                             | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Separators not focusable                                     | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Nested menu event isolation                                  | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |
| Forced-colors focus ring distinct from hover/pressed/checked | Render direct fixture. | Exercise public API and user interaction. | DOM, events, focus, and ARIA match this contract. |

### Browser E2E Tests

| Requirement                  | Setup                                                                                   | Action                                                                                               | Validation                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keyboard and focus contract  | Render the component in a direct Vite fixture with realistic surrounding focus targets. | Use trusted browser input for Tab, Shift+Tab, Enter, Space, Escape, and arrow keys where applicable. | Focus target, state, events, and default prevention match the Keyboard Contract. |
| Pointer and target ownership | Render primary and secondary targets documented by the Composition Contract.            | Click/tap/hover each target and inert region.                                                        | Only the intended target acts; hover does not mutate state unless documented.    |

### Accessibility Tests

| Requirement                           | Setup                                                   | Action                                               | Validation                                                                                                           |
| ------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| APG: Single tab stop                  | Render toolbar with four buttons.                       | Press Tab into and out of toolbar.                   | Focus enters one active control and leaves toolbar on next Tab/Shift+Tab; controls are not all independent tab stops |
| APG: Horizontal navigation            | Focus first command in horizontal toolbar.              | Press ArrowRight, ArrowLeft, Home, End.              | Focus moves among commands according to APG; separators are skipped                                                  |
| APG: Vertical navigation              | Render `vertical`.                                      | Press ArrowDown and ArrowUp.                         | Focus axis switches and `aria-orientation="vertical"` is set                                                         |
| APG: Disabled discoverability         | Render native disabled and disabled-focusable commands. | Arrow through toolbar and activate disabled command. | Disabled-focusable remains in roving order but is inert; native disabled can be skipped                              |
| Fluent UI: Under-three warning        | Render toolbar with two buttons.                        | Run design validation.                               | Validation warns and suggests bare buttons or cluster layout                                                         |
| Fluent UI: Multiple-toolbar labels    | Render two toolbars without labels.                     | Run accessibility validation.                        | Validation fails until each toolbar has a unique label                                                               |
| Fluent UI: Checked value coordination | Render controlled toggle/radio toolbar buttons.         | Activate buttons by keyboard.                        | `checked-value-change` emits `{ name, checkedItems }`; child ARIA pressed/checked state syncs                        |
| Fluent UI: Overflow command           | Render toolbar with overflow menu.                      | Arrow to overflow trigger and open menu.             | Trigger participates in roving order; menu owns its own focus while open and returns focus on close                  |

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

| Area        | Required coverage                                                                |
| ----------- | -------------------------------------------------------------------------------- |
| behavior.md | Native buttons; Enter/Space native activation.                                   |
| behavior.md | Roving tabindex (focusgroup); single tab stop; Home/End; visible ring.           |
| behavior.md | One control = one action; dividers/groups not targets.                           |
| behavior.md | Composite root owns roving + grouped checked state; ignores foreign menu events. |
| behavior.md | User change → composed `checked-value-change`; programmatic silent.              |
| behavior.md | Disabled commands use disabled-focusable parity.                                 |
| behavior.md | Motion tokenized, reduced-motion safe.                                           |


## tooltip

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


## Skill: button

---
name: button
description: Use and integrate the tyui-button custom element correctly, including registration, intent, states, events, and anti-patterns.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/button/tyui-button.ts
  manifest: ../../custom-elements.json
---

# tyui-button

## Intent

Use `tyui-button` to trigger an immediate in-page action. Use a link for navigation.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`. Do not copy
attribute or event types from memory.

## Registration

```ts
import { defineTyuiButton } from '@toyu-ui/define/button';

defineTyuiButton();
```

## Correct Usage

```html
<tyui-button appearance="primary">Save</tyui-button>
```

## Selection Guidance

- Use one primary button for the dominant local action.
- Use default or secondary styling for ordinary commands.
- Use subtle or transparent styling for dense toolbars and repeated row actions.
- Icon-only buttons must have an accessible name.

## Anti-Patterns

- Do not use button activation for navigation.
- Do not place focusable controls inside the button label.
- Do not restyle private shadow DOM; use public tokens, attributes, and parts.


## Skill: center

---
name: center
description: Use tyui-center to constrain readable content to a centered measure with tokenized gutters.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/center/tyui-center.ts
  manifest: ../../custom-elements.json
---

# tyui-center

## Intent

Use `tyui-center` to constrain readable content to a maximum inline measure and center it inside the available space.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-center measure="60ch" gutter="page">
  <tyui-flex direction="column" gap="3">
    <h1>Profile</h1>
    <tyui-input label="Display name"></tyui-input>
  </tyui-flex>
</tyui-center>
```

## Selection Guidance

- Use Center for prose, forms, narrow settings pages, and focused empty states.
- Use Container for page or section rails.
- Use Grid or Sidebar when the content has multiple peer regions.
- Use the `intrinsic` attribute when children should also center as a column.

## Anti-Patterns

- Do not wrap every individual control in Center.
- Do not use Center as a card or surface.
- Do not nest Center repeatedly without a specific measure change.


## Skill: checkbox

---
name: checkbox
description: Use and integrate the tyui-checkbox custom element for independent boolean choices and avoid radio or command-button misuse.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/checkbox/tyui-checkbox.ts
  manifest: ../../custom-elements.json
---

# tyui-checkbox

## Intent

Use `tyui-checkbox` for an independent yes/no or on/off choice.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-checkbox name="notifications" value="enabled">Email notifications</tyui-checkbox>
```

## Selection Guidance

- Use checkbox for independent choices.
- Use radio group when exactly one option must be chosen from a set.
- Use a switch component, when available, for immediate setting toggles.

## Anti-Patterns

- Do not use checkbox as a command button.
- Do not use checkbox for mutually exclusive options.
- Do not hide the label without providing an accessible name.


## Skill: cluster

---
name: cluster
description: Use tyui-cluster for compact wrapping rows of intrinsic items such as actions, tags, chips, and toolbar-like groups.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/cluster/tyui-cluster.ts
  manifest: ../../custom-elements.json
---

# tyui-cluster

## Intent

Use `tyui-cluster` for compact groups of peer items that keep their intrinsic size and wrap to new lines when space runs out.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-cluster gap="2">
  <tyui-button appearance="primary">Save</tyui-button>
  <tyui-button>Cancel</tyui-button>
  <tyui-button appearance="subtle">Reset</tyui-button>
</tyui-cluster>
```

## Selection Guidance

- Use Cluster for action rows, tags, chips, checkbox rows, radio rows, and short metadata groups.
- Use Flex when one-axis distribution, direction, or optional wrapping matters more than wrap-first behavior.
- Use Grid when children should form equal responsive tracks.
- Preserve list markup when the items are a semantic list.

## Anti-Patterns

- Do not use Cluster for table rows or data grids.
- Do not remove list semantics just to get a wrapping row.
- Do not make Cluster responsible for toolbar keyboard behavior.


## Skill: components

---
name: components
description: Load the TYUI component guidance set for choosing and using shipped custom elements and layout primitives.
license: Apache-2.0
requires:
  - '@toyu-ui/elements#button'
  - '@toyu-ui/elements#input'
  - '@toyu-ui/elements#checkbox'
  - '@toyu-ui/elements#radio'
  - '@toyu-ui/elements#radio-group'
  - '@toyu-ui/elements#flex'
  - '@toyu-ui/elements#cluster'
  - '@toyu-ui/elements#grid'
  - '@toyu-ui/elements#center'
  - '@toyu-ui/elements#container'
  - '@toyu-ui/elements#frame'
  - '@toyu-ui/elements#sidebar'
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: skills/components/SKILL.md
  manifest: ../../custom-elements.json
---

# TYUI components

## Intent

Use `@toyu-ui/elements#components` when an agent or developer needs the complete shipped TYUI component guidance set before choosing controls or layout primitives.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`. This aggregate skill only gathers intent and selection guidance; individual component skills remain the source for component-specific advice.

## Correct Usage

```sh
yarn dlx @tanstack/intent@latest load @toyu-ui/elements#components
```

## Selection Guidance

- Load this skill at the start of a TYUI UI task when the component choice is not known yet.
- Use the required component skills for exact intent, selection guidance, anti-patterns, and usage examples.
- Use `@toyu-ui/solid#setup` as the companion setup skill for Solid apps.
- Use `custom-elements.json` for exact attributes, events, slots, CSS parts, and CSS custom properties.

## Anti-Patterns

- Do not duplicate component selection rules in app docs when this aggregate skill can load the versioned component guidance.
- Do not treat this skill as an API reference; use the manifest for exact API facts.
- Do not load every component at runtime just because every component skill was loaded for agent guidance.


## Skill: container

---
name: container
description: Use tyui-container to constrain page or section width with named rails and tokenized gutters.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/container/tyui-container.ts
  manifest: ../../custom-elements.json
---

# tyui-container

## Intent

Use `tyui-container` to create a page or section rail that controls maximum inline size and horizontal gutter.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-container size="wide" gutter="page">
  <tyui-grid min-item-size="18rem" gap="4"></tyui-grid>
</tyui-container>
```

## Selection Guidance

- Use Container for page shells, section rails, dashboard content bounds, and full-width page regions.
- Use Center for readable single-column content.
- Use Frame for aspect-ratio media.
- Use `bleed` only when content intentionally reaches the container edge.

## Anti-Patterns

- Do not use Container to set a button or input width.
- Do not use card padding as page gutters.
- Do not nest containers without a named rail change.


## Skill: flex

---
name: flex
description: Use tyui-flex for one-axis sibling composition with tokenized direction, alignment, wrapping, and gap.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/flex/tyui-flex.ts
  manifest: ../../custom-elements.json
---

# tyui-flex

## Intent

Use `tyui-flex` when sibling content follows one axis and the parent owns direction, wrapping, alignment, justification, and gap.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-flex direction="column" gap="3">
  <h2>Settings</h2>
  <tyui-input label="Name"></tyui-input>
  <tyui-button appearance="primary">Save</tyui-button>
</tyui-flex>
```

## Selection Guidance

- Use Flex for row or column composition of siblings.
- Use Flex when the design may switch direction or wrapping through attributes.
- Use Cluster for wrap-first action rows, chips, and tags.
- Use Grid for repeated peer cards or panels.
- Use native block flow for simple prose.

## Anti-Patterns

- Do not use Flex to create data tables or two-dimensional card grids.
- Do not force every child to `flex: 1` unless equal distribution is the container intent.
- Do not use visual reverse direction to fix incorrect DOM reading order.


## Skill: frame

---
name: frame
description: Use tyui-frame to reserve aspect ratio for media, previews, charts, thumbnails, and embeds.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/frame/tyui-frame.ts
  manifest: ../../custom-elements.json
---

# tyui-frame

## Intent

Use `tyui-frame` to reserve a stable aspect ratio for one primary child while the parent owns width.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-frame ratio="16/9" fit="cover">
  <img src="/preview.jpg" alt="Project preview" />
</tyui-frame>
```

## Selection Guidance

- Use Frame for images, video, canvas, iframe embeds, charts, thumbnails, and preview surfaces.
- Use natural block flow for text-heavy cards.
- Use Grid for collections of framed peers.
- Apply `fit` and `position` only when the direct child is replaced media.

## Anti-Patterns

- Do not place full forms or complex scrollable interactive regions inside Frame.
- Do not use Frame to crop text cards.
- Do not expect `object-fit` to affect non-replaced elements.


## Skill: grid

---
name: grid
description: Use tyui-grid for responsive peer-card and panel collections that auto-fit columns from container width.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/grid/tyui-grid.ts
  manifest: ../../custom-elements.json
---

# tyui-grid

## Intent

Use `tyui-grid` for repeated peer items that should form responsive columns from the container width and a minimum item size.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-grid min-item-size="14rem" gap="4">
  <section>Alpha</section>
  <section>Beta</section>
  <section>Gamma</section>
</tyui-grid>
```

## Selection Guidance

- Use Grid for cards, tiles, metric panels, image groups, and settings panels.
- Use Cluster for compact wrapping action rows and tags.
- Use Flex for one-axis composition.
- Use table or data-grid components for tabular data with row and column relationships.

## Anti-Patterns

- Do not use Grid for data tables or keyboard-navigable ARIA grids.
- Do not use dense visual reordering when DOM order must match reading order.
- Do not calculate columns in JavaScript.


## Skill: input

---
name: input
description: Use and integrate the tyui-input custom element for accessible single-line text entry without confusing base component features with design-system variants.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/input/tyui-input.ts
  manifest: ../../custom-elements.json
---

# tyui-input

## Intent

Use `tyui-input` for short single-line text entry such as names, email addresses,
search terms, telephone numbers, URLs, passwords, and numeric text.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Registration

```ts
import { defineTyuiInput } from '@toyu-ui/define/input';

defineTyuiInput();
```

## Correct Usage

```html
<label for="email">Email</label>
<tyui-input id="email" name="email" type="email" required></tyui-input>
```

## Design-System Variants

The base component owns neutral appearances only. Product or design-system
layers may add visual variants through public tokens, host classes, and
documented parts. For example, Fluent's focused underline is a Fluent design
layer feature, not a base `appearance` value.

## Selection Guidance

- Use Input for short single-line text entry.
- Use a textarea component, when available, for multiline text.
- Use Select, Combobox, RadioGroup, or Checkbox when the user chooses from known options.
- Use Field or a visible native label to provide the accessible label.
- Keep design-system-specific visuals in the design layer rather than adding base appearances.

## Anti-Patterns

- Do not rely on placeholder as the only label.
- Do not put buttons, links, or other focusable controls in content slots.
- Do not invent unsupported input appearances; use design-layer classes for
  product-specific visuals.


## Skill: radio

---
name: radio
description: Use tyui-radio only as a radio option coordinated by tyui-radio-group, with native input focus and group-owned selection.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/radio/tyui-radio.ts
  manifest: ../../custom-elements.json
---

# tyui-radio

## Intent

Use `tyui-radio` to represent one option inside `tyui-radio-group`.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-radio-group label="Plan" name="plan" value="team">
  <tyui-radio value="personal">Personal</tyui-radio>
  <tyui-radio value="team">Team</tyui-radio>
</tyui-radio-group>
```

## Focus And Keyboard

`tyui-radio-group` owns value and roving tabindex. The active radio mirrors its
tab stop to the native shadow input so real browser `Tab` enters the group and
arrow keys move focus and selection.

## Selection Guidance

- Use Radio only as an option inside RadioGroup.
- Use RadioGroup for the field label, name, value ownership, and keyboard coordination.
- Use Checkbox for unrelated independent boolean choices.
- Use Select or Combobox for larger option sets.

## Anti-Patterns

- Do not use standalone radio buttons for unrelated boolean choices.
- Do not manage checked state independently when inside a group.
- Do not replace native radio keyboard behavior with app-level key handlers.


## Skill: radio-group

---
name: radio-group
description: Use and integrate tyui-radio-group for mutually exclusive choices, including value ownership, keyboard behavior, and form participation.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/radio-group/tyui-radio-group.ts
  manifest: ../../custom-elements.json
---

# tyui-radio-group

## Intent

Use `tyui-radio-group` when the user must choose exactly one option from a small
set.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-radio-group label="Notification frequency" name="frequency" required>
  <tyui-radio value="daily">Daily</tyui-radio>
  <tyui-radio value="weekly">Weekly</tyui-radio>
  <tyui-radio value="never">Never</tyui-radio>
</tyui-radio-group>
```

## Keyboard Contract

- `Tab` enters the checked enabled radio, or the first enabled radio.
- Arrow keys move focus and selection, wrapping and skipping disabled radios.
- `Space` selects the focused radio.

## Selection Guidance

- Use RadioGroup when the user chooses exactly one option from a small set.
- Use Checkbox for independent boolean choices or multi-select checklists.
- Use Select or Combobox for long option lists, async options, or compact forms.
- Keep only `tyui-radio` choices in the default slot.

## Anti-Patterns

- Do not place non-radio interactive elements in the default slot.
- Do not use radio group for multi-select choices.
- Do not create custom roving tabindex outside the group.


## Skill: sidebar

---
name: sidebar
description: Use tyui-sidebar for two-region fixed-plus-fluid layouts such as filters beside results or navigation beside content.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/sidebar/tyui-sidebar.ts
  manifest: ../../custom-elements.json
---

# tyui-sidebar

## Intent

Use `tyui-sidebar` for a two-region layout where one child has a preferred fixed size and the other child takes remaining space.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-sidebar side-size="16rem" content-min="55%" gap="4">
  <aside>Filters</aside>
  <main>Results</main>
</tyui-sidebar>
```

## Selection Guidance

- Use Sidebar for filters beside results, navigation beside content, metadata beside detail, or media beside body.
- Use Grid when regions are peer cards or equal columns.
- Use Container for page rails.
- Use dialog or drawer components for overlay side panels.

## Anti-Patterns

- Do not add more than two direct children.
- Do not use Sidebar for overlay drawer behavior.
- Do not use `side="end"` to fix an incorrect DOM reading order.


## Skill: button

---
name: button
description: Solid-facing alias for tyui-button guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#button']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/button/SKILL.md
---

# TYUI Solid button

## Intent

Use `@toyu-ui/solid#button` to load Solid setup plus the authoritative `@toyu-ui/elements#button` guidance.

## Correct Usage

```tsx
import { Button } from '@toyu-ui/solid';

<Button appearance="primary">Save</Button>;
```

## Selection Guidance

- Use the `Button` wrapper for ordinary Solid app code.
- Use raw `tyui-button` only when direct custom-element access is needed.

## Anti-Patterns

- Do not duplicate button behavior in a Solid wrapper.


## Skill: center

---
name: center
description: Solid-facing alias for tyui-center guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#center']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/center/SKILL.md
---

# TYUI Solid center

## Intent

Use `@toyu-ui/solid#center` to load Solid setup plus the authoritative `@toyu-ui/elements#center` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiCenter } from '@toyu-ui/solid/define/center';

defineTyuiCenter();

<tyui-center measure="60ch" gutter="page" />;
```

## Selection Guidance

- Use raw `tyui-center` in TSX for readable centered regions.
- Register it through `@toyu-ui/solid/define/center`.

## Anti-Patterns

- Do not use Center as a card or surface.


## Skill: checkbox

---
name: checkbox
description: Solid-facing alias for tyui-checkbox guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#checkbox']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/checkbox/SKILL.md
---

# TYUI Solid checkbox

## Intent

Use `@toyu-ui/solid#checkbox` to load Solid setup plus the authoritative `@toyu-ui/elements#checkbox` guidance.

## Correct Usage

```tsx
import { Checkbox } from '@toyu-ui/solid';

<Checkbox name="updates" value="yes">
  Send updates
</Checkbox>;
```

## Selection Guidance

- Use Checkbox for independent boolean choices in Solid.
- Use RadioGroup and Radio for mutually exclusive choices.

## Anti-Patterns

- Do not use Checkbox as a command button.


## Skill: cluster

---
name: cluster
description: Solid-facing alias for tyui-cluster guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#cluster']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/cluster/SKILL.md
---

# TYUI Solid cluster

## Intent

Use `@toyu-ui/solid#cluster` to load Solid setup plus the authoritative `@toyu-ui/elements#cluster` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiCluster } from '@toyu-ui/solid/define/cluster';

defineTyuiCluster();

<tyui-cluster gap="2" />;
```

## Selection Guidance

- Use raw `tyui-cluster` in TSX for wrapping action rows and tags.
- Register it through `@toyu-ui/solid/define/cluster`.

## Anti-Patterns

- Do not use Cluster for table or data-grid semantics.


## Skill: components

---
name: components
description: Load the Solid setup guidance and the complete TYUI component guidance set for Solid apps.
license: Apache-2.0
requires:
  - '@toyu-ui/solid#setup'
  - '@toyu-ui/elements#components'
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/components/SKILL.md
---

# TYUI Solid components

## Intent

Use `@toyu-ui/solid#components` when a Solid app needs the full TYUI component selection and usage guidance.

## Correct Usage

```sh
yarn dlx @tanstack/intent@latest load @toyu-ui/solid#components
```

## Selection Guidance

- Start Solid app guidance from this skill when component choice is not known.
- Use `@toyu-ui/solid#setup` for Solid registration and JSX rules.
- Use required `@toyu-ui/elements#*` skills for component-specific intent and anti-patterns.
- Use `@toyu-ui/solid` exports and `@toyu-ui/solid/define/*` paths in app code.

## Anti-Patterns

- Do not ask Solid apps to install `@toyu-ui/define` or `@toyu-ui/elements` directly for normal use.
- Do not duplicate component guidance in Solid skills.


## Skill: container

---
name: container
description: Solid-facing alias for tyui-container guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#container']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/container/SKILL.md
---

# TYUI Solid container

## Intent

Use `@toyu-ui/solid#container` to load Solid setup plus the authoritative `@toyu-ui/elements#container` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiContainer } from '@toyu-ui/solid/define/container';

defineTyuiContainer();

<tyui-container size="wide" gutter="page" />;
```

## Selection Guidance

- Use raw `tyui-container` in TSX for page or section rails.
- Register it through `@toyu-ui/solid/define/container`.

## Anti-Patterns

- Do not use Container to set individual control widths.


## Skill: flex

---
name: flex
description: Solid-facing alias for tyui-flex guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#flex']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/flex/SKILL.md
---

# TYUI Solid flex

## Intent

Use `@toyu-ui/solid#flex` to load Solid setup plus the authoritative `@toyu-ui/elements#flex` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiFlex } from '@toyu-ui/solid/define/flex';

defineTyuiFlex();

<tyui-flex direction="column" gap="3" />;
```

## Selection Guidance

- Use raw `tyui-flex` in TSX for one-axis composition.
- Register it through `@toyu-ui/solid/define/flex`.

## Anti-Patterns

- Do not import registration helpers from `@toyu-ui/define` in normal Solid app code.


## Skill: frame

---
name: frame
description: Solid-facing alias for tyui-frame guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#frame']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/frame/SKILL.md
---

# TYUI Solid frame

## Intent

Use `@toyu-ui/solid#frame` to load Solid setup plus the authoritative `@toyu-ui/elements#frame` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiFrame } from '@toyu-ui/solid/define/frame';

defineTyuiFrame();

<tyui-frame ratio="16/9" fit="cover" />;
```

## Selection Guidance

- Use raw `tyui-frame` in TSX for aspect-ratio media and previews.
- Register it through `@toyu-ui/solid/define/frame`.

## Anti-Patterns

- Do not put complex forms inside Frame.


## Skill: grid

---
name: grid
description: Solid-facing alias for tyui-grid guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#grid']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/grid/SKILL.md
---

# TYUI Solid grid

## Intent

Use `@toyu-ui/solid#grid` to load Solid setup plus the authoritative `@toyu-ui/elements#grid` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiGrid } from '@toyu-ui/solid/define/grid';

defineTyuiGrid();

<tyui-grid min-item-size="16rem" gap="4" />;
```

## Selection Guidance

- Use raw `tyui-grid` in TSX for responsive peer cards and panels.
- Register it through `@toyu-ui/solid/define/grid`.

## Anti-Patterns

- Do not use Grid for tabular data.


## Skill: input

---
name: input
description: Solid-facing alias for tyui-input guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#input']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/input/SKILL.md
---

# TYUI Solid input

## Intent

Use `@toyu-ui/solid#input` to load Solid setup plus the authoritative `@toyu-ui/elements#input` guidance.

## Correct Usage

```tsx
import { Input } from '@toyu-ui/solid';

<Input name="email" type="email" required>
  Email
</Input>;
```

## Selection Guidance

- Use the `Input` wrapper for single-line text entry in Solid.
- Use `event.detail.value` from typed `onInput` handlers.

## Anti-Patterns

- Do not rely on placeholder text as the only label.


## Skill: radio

---
name: radio
description: Solid-facing alias for tyui-radio guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#radio']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/radio/SKILL.md
---

# TYUI Solid radio

## Intent

Use `@toyu-ui/solid#radio` to load Solid setup plus the authoritative `@toyu-ui/elements#radio` guidance.

## Correct Usage

```tsx
import { Radio, RadioGroup } from '@toyu-ui/solid';

<RadioGroup label="Plan" name="plan">
  <Radio value="team">Team</Radio>
</RadioGroup>;
```

## Selection Guidance

- Use Radio only inside RadioGroup.
- Use Checkbox for independent boolean choices.

## Anti-Patterns

- Do not manage Radio checked state outside the group.


## Skill: radio-group

---
name: radio-group
description: Solid-facing alias for tyui-radio-group guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#radio-group']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/radio-group/SKILL.md
---

# TYUI Solid radio group

## Intent

Use `@toyu-ui/solid#radio-group` to load Solid setup plus the authoritative `@toyu-ui/elements#radio-group` guidance.

## Correct Usage

```tsx
import { Radio, RadioGroup } from '@toyu-ui/solid';

<RadioGroup label="Frequency" name="frequency">
  <Radio value="daily">Daily</Radio>
  <Radio value="weekly">Weekly</Radio>
</RadioGroup>;
```

## Selection Guidance

- Use RadioGroup when the user chooses one option from a small set.
- Use `event.detail.value` from typed change handlers.

## Anti-Patterns

- Do not put non-radio controls in the default slot.


## Skill: setup

---
name: setup
description: Set up TYUI custom elements for Solid, including registration, JSX typing, wrappers, and typed custom events.
license: Apache-2.0
requires: ['@toyu-ui/elements#components']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: src/index.ts
---

# TYUI Solid setup

## Intent

Use `@toyu-ui/solid` when a Solid app wants typed JSX ergonomics for TYUI custom
elements. The implementation remains in `@toyu-ui/elements`.

## Registration

Register only the elements you use:

```ts
import { defineTyuiButton } from '@toyu-ui/solid/define/button';

defineTyuiButton();
```

Use `defineTyuiElements()` only for demos or apps where eager registration of
all elements is acceptable.

## JSX Usage

```tsx
<tyui-button appearance="primary" on:click={save}>
  Save
</tyui-button>
```

Thin wrappers may improve prop names or event typing, but they must not fork
behavior from the underlying custom element.

## Anti-Patterns

- Do not reimplement TYUI behavior in Solid wrappers.
- Do not use Solid signals inside `@toyu-ui/elements`.
- Do not register all elements in a library module that should tree-shake.


## Skill: sidebar

---
name: sidebar
description: Solid-facing alias for tyui-sidebar guidance.
license: Apache-2.0
requires: ['@toyu-ui/solid#setup', '@toyu-ui/elements#sidebar']
metadata:
  type: framework
  library: '@toyu-ui/solid'
  library_version: '0.1.0'
  framework: solid
  source: skills/sidebar/SKILL.md
---

# TYUI Solid sidebar

## Intent

Use `@toyu-ui/solid#sidebar` to load Solid setup plus the authoritative `@toyu-ui/elements#sidebar` guidance.

## Correct Usage

```tsx
import '@toyu-ui/solid/jsx';
import { defineTyuiSidebar } from '@toyu-ui/solid/define/sidebar';

defineTyuiSidebar();

<tyui-sidebar side-size="16rem" content-min="55%" />;
```

## Selection Guidance

- Use raw `tyui-sidebar` in TSX for two-region fixed-plus-fluid layout.
- Register it through `@toyu-ui/solid/define/sidebar`.

## Anti-Patterns

- Do not use Sidebar for overlay drawer behavior.
