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
