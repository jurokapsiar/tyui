# Menu / MenuItem — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tags: `tyui-menu`, `tyui-menu-trigger`, `tyui-menu-popover`, `tyui-menu-list`, `tyui-menu-item`, `tyui-menu-item-checkbox`, `tyui-menu-item-radio`, `tyui-menu-item-link`, `tyui-menu-group`, `tyui-menu-group-header`, `tyui-menu-divider`
- Define: `@tyui/define/menu`
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
