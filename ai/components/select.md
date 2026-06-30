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
