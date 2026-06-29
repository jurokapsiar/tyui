# Card — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-card` (+ `tyui-card-header`, `tyui-card-footer`, `tyui-card-preview` as light structural slots/elements)
- Define: `@tyui/define/card`
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
