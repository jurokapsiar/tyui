# Breadcrumb — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-breadcrumb`, `tyui-breadcrumb-item`, `tyui-breadcrumb-divider` (divider may be CSS-generated)
- Define: `@tyui/define/breadcrumb`
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
