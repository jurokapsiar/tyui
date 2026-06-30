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
