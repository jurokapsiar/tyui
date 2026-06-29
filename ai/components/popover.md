# Popover — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-popover` (+ `tyui-popover-trigger`, `tyui-popover-surface`)
- Define: `@tyui/define/popover`
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
