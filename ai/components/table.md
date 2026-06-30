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
