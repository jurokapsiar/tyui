# Component Spec Rules

This reference distills `reviews/design-system-component-patterns.md`, `reviews/ds-behaviors.md`, `reviews/ds-ttests.md`, `reviews/fluent-acc.md`, `reviews/fluent-behaviors.md`, and `reviews/mcp-styling.md` into rules for TYUI component specs.

## Component Shape

- TYUI components are native custom elements with plain TypeScript behavior and stable shadow DOM.
- Use one component source module and one constructed stylesheet module per component.
- Reflect public visual, semantic, or stateful variants to host attributes.
- Keep transient render details internal and expose them only as private `data-*` or `--_ty-*` state when needed.
- Use manual property/attribute bridges for rich JS properties with declarative attribute forms.
- Generate stable IDs once; do not regenerate IDs during render.
- Apply default tabindex and ARIA attributes after connection, not during construction.
- Register external listeners, observers, timers, and focus helpers symmetrically and clean them up on disconnect.

## DOM And Semantics

- Prefer native semantic cores: internal button, input, textarea, checkbox, radio, select, image, or heading where native behavior fits.
- Use decorative visual shells around native controls only when the decorative layer is hidden from assistive technology.
- Preserve consumer-supplied ARIA where possible; set defaults only when absent.
- ARIA ID references do not reliably cross shadow boundaries. Put relationships in a shared DOM scope or mirror attributes/text to the host or focused native control.
- Use light DOM for live regions when shadow DOM would make announcements unreliable.
- Hide decorative SVGs, visual indicators, cloned media wrappers, and fallback initials with `aria-hidden`, presentation roles, empty `alt`, or equivalent.
- Icon-only controls need explicit accessible names.

## Composition

- Define allowed children, required parents, required child components, and invalid nesting.
- Options belong inside listbox-like owners; radio items belong inside radio groups; accordion headers and panels belong inside accordion items; menu items belong inside menus; tabs belong inside tab lists.
- Pick the widget pattern that matches the interaction: select for simple native single choice, combobox/listbox for richer selection, menu for transient commands, toolbar for peer commands, tabs for peer views, tree for hierarchy, dialog for blocking workflow.
- Do not combine navigation, selection, expand/collapse, dismiss, or command behavior on one ambiguous target.
- Secondary actions require separate focusable targets, slots, split controls, or mode-specific entry.

## Behavior

- Native behavior first. Add custom behavior only for design-system parity, shadow-DOM event crossing, composite coordination, or known accessibility gaps.
- Focus moves only after explicit user action: click, tap, or key down.
- Hover is visual-only unless the component is explicitly a menu-like exception.
- Combobox-like controls keep DOM focus on the input or trigger and use `aria-activedescendant` for option navigation.
- Composite widgets own coordinated selection/open/focus/form state at the parent.
- Children in composites expose minimal state and dispatch narrow internal events.
- Programmatic value changes usually do not dispatch user-facing `change` events; user input does.
- Public events app code needs to hear should bubble and be composed.
- Internal coordination events should be component-specific and not confused with public/native events.

## Keyboard And Focus

- Buttons use native Enter and Space activation.
- Checkbox and radio use native input behavior where possible.
- Radio groups use arrow keys to move and select, skip disabled items, wrap when specified, and keep one roving tab stop.
- Tag picker / combobox patterns use Arrow keys, Home/End, Enter, Escape, and active descendant; Tab behavior must be explicitly documented.
- Dismiss actions commonly support Enter, Space, Backspace, and Delete when they behave like removable chips.
- Focus indicators must be visible and distinct from hover, active, selected, and pressed states.
- Document whether controls use `delegatesFocus`, `:focus-visible`, `:focus-within`, roving tabindex, active descendant, or focus trapping.
- For hover-open popups, document focus retention and next Tab behavior.
- For dialogs, drawers, and modal overlays, document autofocus, focus trap, and focus restoration.

## Disabled, Readonly, Loading, And Status

- Native `disabled` removes interaction and normal tab order.
- `aria-disabled` with retained focus is only for documented disabled-focusable cases.
- Readonly fields remain focusable and selectable but do not mutate through user input.
- Message/status components use `role="status"` for polite updates and `role="alert"` for assertive updates.
- Loading indicators use `role="progressbar"` or `aria-busy` with a meaningful accessible name.
- Skeletons and spinners must not be the only persistent status for long waits without explanation.

## Styling

- Public TYUI tokens use `--ty-*`; private helper variables use `--_ty-*`.
- Host attributes, public tokens, documented slots, documented parts, and documented forwarded parts are the public styling surface.
- Internal shadow classes, internal DOM structure, `--_ty-*`, and undocumented `data-*` are private.
- Styling override order: attributes/properties, host classes/local CSS, public tokens, documented `::part()`, inline style only for dynamic per-instance values.
- Use `::part()` for structural styling only when a stable token is insufficient. Promote repeated part overrides to component tokens.
- Forward nested public parts with `exportparts` when parent components expose nested internals.
- Components need forced-colors behavior for custom colors, borders, focus, icons, and surfaces.
- Reduced-motion behavior is required for transitions and continuous animation.
- Components should size intrinsically with logical properties, `min-block-size`, `min-inline-size: 0` where needed, and no fixed control heights.

## Layout And Measurement

- Parent layout owns stretching, sibling distribution, ordering, and outer margin.
- Component owns internal padding, gap, minimum target, alignment, and slot shrink behavior.
- Prefer intrinsic CSS before measurement or breakpoints.
- If measurement is unavoidable, isolate reads/writes and update only when derived layout changes.
- Query thresholds must be concrete at CSS build time; do not rely on custom properties inside query conditions.
- Scroll, overflow, top-layer, and popover ownership must be explicit for overlays and large composite widgets.

## Motion

- Motion decorates state transitions and should not decide state.
- CSS-only motion is preferred for components.
- Delayed unmount must not leave focus, pointer, or accessibility state contradictory to the logical component state.
- Interaction during enter/exit motion needs tests when the component can be clicked, dismissed, or focused while motion is running.
- Components with continuous animation need a reduced-motion fallback.

## Testing

Specs should include test rows with setup / action / validation for:

- Default rendering and custom-element registration.
- Attribute/property reflection and JS property bridges.
- Native semantic core and DOM structure.
- Slots, parts, forwarded parts, and styling state hooks.
- User events, event detail, bubbling, and composed behavior.
- Programmatic changes that must not emit user events.
- Keyboard and focus behavior in real browsers when jsdom is insufficient.
- Form association, submitted values, validity, required, readonly, and disabled behavior.
- ARIA roles, labels, relationships, mirroring, and consumer ARIA preservation.
- Forced-colors, reduced-motion, contrast, and visual states.
- Cleanup for listeners, timers, observers, generated IDs, and slotchange work.
- Solid JSX typing and optional wrapper behavior.
- Manifest, `.design.json`, component doc, and generated design bundle sync.
