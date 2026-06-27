# Behavior Principles

Component behavior must be predictable across pointer, keyboard, assistive technology, and programmatic usage. These principles apply to every component contract and should be made explicit in each component spec.

## Focus

Focus moves only after explicit user action: click, tap, or key down. Passive disclosure such as hover-open content must not steal DOM focus.

Overlay and popup components must define what happens on the next keyboard action after opening. For hover-open popovers, the next Tab should have a documented path into or past the popup. For menus, directional arrows may enter the menu or submenu when the component explicitly follows menu behavior.

Combobox-like controls keep DOM focus on the input or trigger while option navigation changes the active option through `aria-activedescendant`.

Keyboard focus must be visible and distinct from hover, selected, active, and pressed states. Components using shadow DOM must document whether they use `:focus-visible`, `:focus-within`, delegated focus, roving tabindex, or active descendant.

## Hit Targets

One semantic target should expose one primary action. Do not combine unrelated behaviors such as navigation, selection, expand/collapse, dismiss, and hover-only commands on the same target.

Secondary actions require separate focusable targets, slots, or mode-specific entry. Examples include split buttons, card actions, tag dismiss buttons, nav expand controls, and menu item submenus.

Hover may preview or style a control, but it must not select, dismiss, toggle, navigate, or move focus unless the component is documented as an explicit menu-like exception.

## Native Behavior

Use native HTML semantics before custom roles or scripted interaction:

- Buttons use native `<button>` activation.
- Text fields use native `<input>` or `<textarea>` editing, selection, IME, and validation behavior.
- Checkbox, radio, select, and image-like components preserve native semantics where possible.
- Custom ARIA widgets are used only when native elements cannot express the required interaction.

When a component wraps native controls in shadow DOM, the contract must describe how labels, descriptions, validation, focus, and form participation cross the shadow boundary.

## Composite Widgets

Composite components own coordinated state at the parent when children need shared value, selection, open state, roving tabindex, grouped form value, or DOM-order navigation.

Children in composites should expose minimal state and dispatch narrow internal events. Parents must ignore events from nested composites they do not own.

Composite keyboard behavior follows the chosen ARIA pattern:

- Radio groups use arrow keys to move and select.
- Comboboxes and tag pickers use active descendant for options.
- Menus use menuitem navigation and may intentionally move focus on arrow keys.
- Toolbars use roving focus among peer commands.
- Tabs switch or focus peer views according to the documented activation mode.
- Trees expose hierarchical navigation and expansion state.

## State And Events

Programmatic state changes should not emit user-facing change events unless the component explicitly documents that behavior. User input emits public events with stable payloads.

Public events that app code must hear across shadow DOM should bubble and be composed. Internal coordination events should use component-specific names and remain undocumented unless intentionally public.

Public visual or semantic state is reflected through host attributes, native pseudo-classes, or ARIA attributes. Internal derived state may use `data-*`, but it is private unless documented.

## Disabled, Readonly, And Loading

Use native `disabled` when a control should leave normal interaction and tab order. Use `aria-disabled="true"` while preserving focus only for documented disabled-focusable parity cases.

Readonly controls remain focusable and selectable but do not mutate from user input.

Loading and status components must expose meaningful status semantics. Use `role="status"` for polite updates, `role="alert"` for assertive updates, `role="progressbar"` for loading/progress indicators, and `aria-busy` when a region is pending.

## Motion

Motion decorates state transitions; it must not decide state or make explicit user actions unpredictable.

Components must document behavior while enter or exit motion is running. If a surface is visually present during delayed unmount after `open=false`, focus, pointer, and accessibility behavior must still match the logical closed state or have a documented exception.

Motion should be CSS-driven, tokenized, and responsive to `prefers-reduced-motion`. Components with continuous or attention-seeking animation must define a reduced-motion fallback.
