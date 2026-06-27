---
component: tyui-input
status: draft
manifest: ../../custom-elements.json
source: ../../libs/elements/src/input/input.ts
designMetadata: ../../libs/elements/src/input/input.design.json
---

# Input

## Identity

- Component name: Input
- Tag name: `tyui-input`
- Package entry point: `@tyui/elements/input`
- Status: Draft
- Source file: `libs/elements/src/input/input.ts`
- Manifest reference: `custom-elements.json#/modules/.../declarations/TyuiInput`
- Design metadata file: `libs/elements/src/input/input.design.json`
- Component family: Form field
- Pattern type: Native text input wrapper
- Closest native element or ARIA pattern: `<input>` with implicit textbox/searchbox/spinbutton semantics depending on type
- Fluent / reference analogue: Fluent UI v9 `Input`; Teams MCP `<ds-input>`
- Related components: future `tyui-field`, `tyui-textarea`, `tyui-search-box`, `tyui-select`, `tyui-combobox`

## Intent

Use `tyui-input` for single-line text entry where users type short freeform values such as names, email addresses, URLs, search terms, telephone numbers, passwords, or numeric text.

Do not use it for multiline text; use `tyui-textarea`. Do not use it for rich option picking; use select, combobox, or tag picker patterns. Do not use placeholder text as the only label.

## Selection Guidance

- Use when: a single-line native text input is the right semantic control.
- Do not use when: the value is multiline, selected from a constrained list, date/time-like, color-like, or requires custom option rendering.
- Prefer instead: `tyui-textarea` for multiline text, `tyui-select` for simple native single choice, `tyui-combobox` for richer listbox behavior, future date/time pickers for date/time values, `tyui-search-box` for search with clear affordance.
- Product-level variant preferences: product `design-app.md` may prefer one default appearance and size, but must keep accessible labeling and contrast requirements.
- One semantic target / one action rule: the input edits text only. Icons in content slots are decorative unless a future specialized component exposes separate clear/search actions.

## Composition Contract

- Allowed children: optional decorative or supplemental content in `slot="contentBefore"` and `slot="contentAfter"`.
- Required parent: none; future `tyui-field` is recommended for label, hint, validation, and required indicators.
- Required child components: none.
- Optional child components: decorative `tyui-icon` in content slots.
- Allowed slots: `contentBefore`, `contentAfter`.
- Disallowed nested interactive content: buttons, links, checkboxes, menus, or focusable controls in content slots for the base input.
- Composition anti-patterns: placeholder-only labeling; placing a clear button in `contentAfter` without using a dedicated search/clear component; using `type="date"` or other browser date/time types to fake a picker.

## API

### Attributes

| Name            | Type                                                          | Reflected Property | Default   | Description                                                                                                 |
| --------------- | ------------------------------------------------------------- | ------------------ | --------- | ----------------------------------------------------------------------------------------------------------- |
| `appearance`    | `outline \| filled-darker \| filled-lighter`                  | `appearance`       | `outline` | Base field style. Fluent underline is a design-system variant, not a base component appearance.             |
| `default-value` | `string`                                                      | `defaultValue`     | `''`      | Seeds `value` once on first connection when `value` is empty. Later changes do not overwrite current value. |
| `disabled`      | `boolean`                                                     | `disabled`         | `false`   | Disables the internal native input.                                                                         |
| `invalid`       | `boolean`                                                     | `invalid`          | `false`   | Reflected visual/ARIA invalid state. Also set by required validity sync.                                    |
| `name`          | `string`                                                      | `name`             | `''`      | Form field name used by ElementInternals.                                                                   |
| `placeholder`   | `string`                                                      | `placeholder`      | `''`      | Placeholder forwarded to native input; not a label substitute.                                              |
| `readonly`      | `boolean`                                                     | `readonly`         | `false`   | Forwards to native `readOnly`; focusable and selectable, but user edits do not mutate value.                |
| `required`      | `boolean`                                                     | `required`         | `false`   | Forwards to native input and drives ElementInternals `valueMissing`.                                        |
| `size`          | `small \| medium \| large`                                    | `size`             | `medium`  | Field density and typography.                                                                               |
| `type`          | `text \| email \| password \| search \| tel \| url \| number` | `type`             | `text`    | Native input type subset. Date/time types are intentionally excluded.                                       |
| `value`         | `string`                                                      | `value`            | `''`      | Initial value when authored as an attribute; property is authoritative after upgrade.                       |

### Properties

| Name           | Type                       | Attribute       | Default   | Description                                                                                 |
| -------------- | -------------------------- | --------------- | --------- | ------------------------------------------------------------------------------------------- |
| `appearance`   | same as attribute          | `appearance`    | `outline` | Reflects to host.                                                                           |
| `defaultValue` | `string`                   | `default-value` | `''`      | Seeds initial value once.                                                                   |
| `disabled`     | `boolean`                  | `disabled`      | `false`   | Reflects to host and internal input.                                                        |
| `invalid`      | `boolean`                  | `invalid`       | `false`   | Reflects to host and should mirror `aria-invalid` to internal input when true.              |
| `name`         | `string`                   | `name`          | `''`      | Used for form submission.                                                                   |
| `placeholder`  | `string`                   | `placeholder`   | `''`      | Forwarded to internal input.                                                                |
| `readonly`     | `boolean`                  | `readonly`      | `false`   | Reflects to host and internal input.                                                        |
| `required`     | `boolean`                  | `required`      | `false`   | Reflects to host and internal input.                                                        |
| `size`         | `small \| medium \| large` | `size`          | `medium`  | Reflects to host.                                                                           |
| `type`         | supported type union       | `type`          | `text`    | Reflects to host and internal input.                                                        |
| `value`        | `string`                   | `value`         | `''`      | Updates internal input and form value. Programmatic writes do not emit `input` or `change`. |

### Events

| Name     | Detail Type                      | Bubbles | Composed | Description                                           |
| -------- | -------------------------------- | ------- | -------- | ----------------------------------------------------- |
| `input`  | `CustomEvent<{ value: string }>` | yes     | yes      | Fired for user text input after host `value` updates. |
| `change` | `Event`                          | yes     | yes      | Fired when the native input commits a change.         |

### Event Semantics

- User-initiated events: typing dispatches `input` with `detail.value`; native commit dispatches `change`.
- Programmatic state changes that must not emit user events: setting `value`, `defaultValue`, `appearance`, `size`, `type`, `disabled`, `readonly`, `required`, or `invalid`.
- Native events that are re-dispatched: inner native `input` is stopped and re-dispatched from the host as `CustomEvent`; inner `change` is stopped and re-dispatched from the host as composed `Event`.
- Internal coordination events: none.
- Cancellation behavior: ordinary text input is native; do not cancel editing keys.

### Slots

| Name            | Description                                                                    | Fallback | Slotted Styling Rules                                                                   |
| --------------- | ------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------- |
| `contentBefore` | Decorative or supplemental content before typed text, inside the field border. | none     | Slotted SVG/icons are sized by `--_ty-input-icon-size` and inherit muted foreground.    |
| `contentAfter`  | Decorative or supplemental content after typed text, inside the field border.  | none     | Must not be focusable in the base input. Use a specialized component for clear buttons. |

### CSS Parts

| Name             | Description                                    | Allowed Use                                                               | Required State Qualifiers                                                          |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `control`        | Wrapper surface around slots and native input. | Advanced border/background/radius treatment when tokens are insufficient. | Qualify by host `[appearance]`, `[size]`, `[invalid]`, `[disabled]`, `[readonly]`. |
| `input`          | Internal native `<input>`.                     | Rare typography or input-specific styling.                                | Avoid changing semantics or hiding text.                                           |
| `content-before` | Wrapper around `contentBefore` slot.           | Slot wrapper alignment/color adjustments.                                 | Qualify by host state when needed.                                                 |
| `content-after`  | Wrapper around `contentAfter` slot.            | Slot wrapper alignment/color adjustments.                                 | Qualify by host state when needed.                                                 |

### Forwarded CSS Parts

| Name | Source Component | Description                                                    |
| ---- | ---------------- | -------------------------------------------------------------- |
| N/A  | N/A              | Base input does not compose nested TYUI components internally. |

### CSS Custom Properties

#### Public Tokens

| Name                                   | Default                            | Description                 |
| -------------------------------------- | ---------------------------------- | --------------------------- |
| `--ty-input-background`                | `var(--ty-color-surface)`          | Resting field background.   |
| `--ty-input-background-filled-darker`  | `var(--ty-color-surface-pressed)`  | Filled darker background.   |
| `--ty-input-background-filled-lighter` | `var(--ty-color-surface-hover)`    | Filled lighter background.  |
| `--ty-input-foreground`                | `var(--ty-color-text)`             | Input text color.           |
| `--ty-input-placeholder-color`         | `var(--ty-color-text-muted)`       | Placeholder color.          |
| `--ty-input-border-color`              | `var(--ty-color-border)`           | Resting border.             |
| `--ty-input-border-color-strong`       | `var(--ty-color-border-strong)`    | Hover/focus-capable border. |
| `--ty-input-invalid-border-color`      | `var(--ty-color-danger)`           | Invalid border.             |
| `--ty-input-focus-indicator-color`     | `var(--ty-color-accent)`           | Focus outline color.        |
| `--ty-input-radius`                    | `var(--ty-control-radius)`         | Control radius.             |
| `--ty-input-min-block-size`            | size-derived token                 | Minimum field height.       |
| `--ty-input-padding-inline`            | `var(--ty-control-padding-inline)` | Inline field padding.       |
| `--ty-input-padding-block`             | `var(--ty-control-padding-block)`  | Native input block padding. |
| `--ty-input-gap`                       | `var(--ty-control-gap)`            | Slot/text gap.              |
| `--ty-input-font-size`                 | `var(--ty-control-font-size)`      | Text size.                  |

#### Private Implementation Variables

Private variables use the `--_ty-*` prefix. List them only so reviewers can distinguish implementation details from consumer hooks; consumers must not depend on them.

| Name                    | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `--_ty-input-icon-size` | Size content slot icons per input size. |

### Styling State Surface

| State      | Surface                                                    | Public               | Notes                                                                    |
| ---------- | ---------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| Appearance | Host `[appearance]`                                        | Yes                  | Drives outline, filled-darker, and filled-lighter.                       |
| Size       | Host `[size]`                                              | Yes                  | Drives min block size, padding, icon size, font size.                    |
| Disabled   | Host `[disabled]`; internal native `disabled`              | Yes                  | Removes editing and normal focus.                                        |
| Readonly   | Host `[readonly]`; internal native `readOnly`              | Yes                  | Remains focusable/selectable.                                            |
| Required   | Host `[required]`; internal native `required`              | Yes                  | Drives validity.                                                         |
| Invalid    | Host `[invalid]`; internal `aria-invalid="true"` when true | Yes                  | Can be set directly or by validity sync.                                 |
| Focus      | `:focus-within` on control                                 | Yes through behavior | Shows neutral focus outline; design layers may restyle documented parts. |
| Hover      | `:hover` on control when not disabled                      | Yes through behavior | Visual only.                                                             |

## Behavior

### State Model

- Controlled state: property `value` is authoritative when set programmatically; programmatic writes update the internal input and form value without firing `input`.
- Uncontrolled / default state: `defaultValue` seeds `value` once on first connection only when `value` is empty.
- Derived internal state: validity-derived `invalid` when required and empty.
- Parent-owned state: form, field wrapper, and app own label, hint, validation message, and submitted context.
- Child-owned state: internal native input owns text editing, selection, IME, undo, and keyboard behavior.
- Programmatic update behavior: property updates synchronize native input and ElementInternals.
- User update behavior: typing updates host `value`, form value, validity, and dispatches `input`.
- State reset behavior: form reset behavior must be defined during implementation; recommended behavior resets to `defaultValue` when present, otherwise empty string.

### State Transition Matrix

| Current State              | User / Programmatic Action | Next State               | Event                                 | Focus Result             | Notes                                                             |
| -------------------------- | -------------------------- | ------------------------ | ------------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| Empty optional             | User types `x`             | Value `x`, valid         | `input` with `{ value: 'x' }`         | Focus remains in input   | Native editing.                                                   |
| Empty required             | `checkValidity()`          | Invalid                  | none                                  | Focus unchanged          | ElementInternals reports `valueMissing`; host reflects `invalid`. |
| Invalid required           | User types non-empty value | Valid                    | `input`                               | Focus remains in input   | Clears invalid.                                                   |
| Any                        | Programmatic `value='abc'` | Value `abc`              | none                                  | Focus unchanged          | Internal input updates.                                           |
| Empty with `default-value` | First connection           | Value seeded             | none                                  | N/A                      | Later `defaultValue` changes ignored.                             |
| Enabled                    | `disabled=true`            | Disabled                 | none                                  | Native disabled behavior | Internal input disabled.                                          |
| Readonly                   | User types                 | Readonly value unchanged | native behavior; no host value change | Focus remains possible   | Native readOnly.                                                  |

### Native Behavior First

- Native element used: internal `<input>`.
- Native behavior preserved: text editing, selection, IME, clipboard, type-specific keyboard behavior, required validity target, readonly, disabled, placeholder.
- Custom behavior added: ElementInternals form association, host event re-dispatch, default-value seed, host ARIA mirroring, tokenized visual wrapper.
- Why custom behavior is necessary: custom element host needs form participation and shadow-boundary events/ARIA.

### Focus Model

- Focus owner: internal native input.
- `delegatesFocus`: yes; host `focus()` routes to internal input.
- Tabbable elements: one internal input when enabled; none when disabled.
- Roving tabindex: N/A.
- Active descendant: N/A for base input.
- Focus restoration: app/form responsibility.
- Focus trap: N/A.
- Focus-visible treatment: focus indicator is a neutral outline on `:focus-within`.
- Pointer focus treatment: pointer focus also shows the focus-within indicator because native input owns focus.

### Keyboard Contract

| Key                 | Context                | Action                                       | Prevent Default | Event                            | Notes                                |
| ------------------- | ---------------------- | -------------------------------------------- | --------------- | -------------------------------- | ------------------------------------ |
| Text editing keys   | Enabled input          | Native editing                               | no              | `input` as native emits          | Includes IME and selection behavior. |
| Enter               | Text input inside form | Native form submit behavior where applicable | no              | `change`/submit per browser      | App handles form.                    |
| Tab                 | Enabled input          | Move focus to next tabbable                  | no              | native blur/change as applicable | Disabled input skipped.              |
| Arrow keys/Home/End | Enabled input          | Native caret movement                        | no              | none or native                   | Do not override.                     |

### Pointer And Hit Target Contract

- Primary hit target: internal native input and visual control wrapper.
- Secondary hit targets: none in base input.
- Hover behavior: border treatment only, no value change or focus movement.
- Pressed / active behavior: native input behavior only.
- Minimum target size: small 24px, medium 32px, large 40px minimum block size; products targeting touch may increase through tokens.
- Touch / pen considerations: native input should remain large enough for platform editing.
- Overloaded-target risks: `contentAfter` clear buttons must not be added to base input; use future search/clear component.

### Popup / Overlay Contract

N/A - base Input owns no popup. Combobox/search suggestions must use a specialized component with active descendant and popup focus rules.

### Form Contract

- Form-associated: yes, through ElementInternals.
- Submitted value: `value` submitted under `name`.
- `FormData` behavior: one name/value entry when `name` is non-empty and control is successful.
- Validity states: required empty sets `valueMissing` and `invalid`; non-empty clears.
- `checkValidity()` / `reportValidity()`: delegate to ElementInternals.
- Name propagation: host `name` supplies submitted field name.
- Required / readonly / disabled behavior: required participates in validity; readonly remains focusable; disabled removes from submission and focus.

### Lifecycle And Cleanup

- External event listeners: none.
- Observers: none.
- Timers: none.
- Generated IDs: none required for base input.
- Slotchange work: not required unless implementation derives slot presence for padding.
- Cleanup requirements: remove any future external listeners/observers.

## Layout Contract

- Display: host `inline-block`; control `inline-flex`.
- Intrinsic size: wrapper has a default minimum inline size, but parent owns final width.
- Shrink policy: internal input uses `min-inline-size: 0` and flexes.
- Wrap policy: no wrapping inside the control.
- Minimum target token: `--ty-input-min-block-size`.
- Minimum visual target: 24px small, 32px medium, 40px large; product may increase.
- Flexible slots: input text region.
- Fixed slots: contentBefore/contentAfter.
- Parent owns: width, margins, grid/flex placement, label/hint/validation layout.
- Component owns: internal padding, gap, min block size, focus outline, slot alignment.
- Container-query thresholds: N/A for base input.
- Scroll / overflow policy: native input handles horizontal text scrolling.
- Top-layer / popover policy: N/A.

### Regions / Slots

| Region / Slot | Flex       | Min Inline Size   | Wraps | Scrolls | Notes                  |
| ------------- | ---------- | ----------------- | ----- | ------- | ---------------------- |
| contentBefore | `0 0 auto` | icon/content size | no    | no      | Decorative by default. |
| input         | `1 1 auto` | `0`               | no    | native  | Native text field.     |
| contentAfter  | `0 0 auto` | icon/content size | no    | no      | Decorative by default. |

## Styling Contract

- Semantic tokens: color, control radius, control padding, focus, danger, motion.
- Component tokens: all `--ty-input-*` listed above.
- Private `--_ty-*` variables: icon size only.
- Public parts: `control`, `input`, `content-before`, `content-after`.
- Forwarded parts: none.
- Slots and slotted-content rules: content slots are inside the field border and are not interactive.
- Allowed `::part()` use: advanced control/input styling only when tokens are insufficient.
- Host class guidance: use host classes for width, margins, and scoped token overrides.
- Inline style guidance: dynamic per-instance width or tokens only.
- Forced-colors behavior: control uses `Field`, `FieldText`, `GrayText`, `Highlight`; focus outline remains visible.
- Reduced-motion behavior: focus transition collapses to `0ms`.
- App-variant hooks: app variants may remap public tokens under host attributes; generated CSS must not target private internals.

Consumer override order for this component:

1. Attributes and properties: `appearance`, `size`, `type`, `disabled`, `readonly`, `required`, `invalid`.
2. Host classes / app-local CSS: layout and scoped token overrides.
3. Public CSS custom properties: `--ty-input-*`.
4. Documented `::part()` selectors: `control`, `input`, `content-before`, `content-after`.
5. Inline `style` for dynamic per-instance values.

## Accessibility

- Role: implicit native role from internal input. `type="text"`, `email`, `password`, `tel`, `url`, and `search` use native textbox/search semantics; `number` uses native number input semantics.
- Accessible name: author must provide label association through future `tyui-field`, `aria-label`, or `aria-labelledby`.
- ARIA attributes: host `aria-label`, `aria-labelledby`, `aria-describedby`, and invalid state must be mirrored to internal input where needed.
- ARIA relationships: description IDs must resolve from the internal input's accessible context; mirror values rather than relying on shadow-boundary IDREF resolution.
- Label / description source: author or field wrapper.
- Consumer ARIA preservation: preserve supplied host ARIA; do not overwrite with empty strings.
- Shadow-boundary ARIA mirroring: required for label and description.
- Decorative content: content slot icons should be `aria-hidden` unless their meaning is also present in the label/description.
- Disabled vs disabled-focusable behavior: base input supports disabled only; disabled-focusable is N/A.
- Loading / status semantics: N/A.
- Screen reader expectations: announces editable field, name, required/invalid/readonly/disabled state, and description.
- High contrast expectations: text, field, border, invalid state, and focus outline remain visible.

### Accessibility Guidance

- Do: pair with a visible label or `aria-label`.
- Do: use field composition for hint and validation messages when available.
- Do not: rely on placeholder as the only label.
- Do not: put interactive controls in content slots.
- Author responsibilities: provide label, description, validation message, and type appropriate to value.
- Known tradeoffs: default and hover borders may be subtle by design; focus outline is the required strong indicator.

## Motion Contract

- Motion tokens: focus feedback duration/easing.
- CSS-only motion: yes, focus feedback transition.
- Reduced-motion behavior: focus transition becomes `0ms`.
- Delayed unmount behavior: N/A.
- Interaction behavior during motion: editing behavior independent of focus transition.
- Motion can be disabled by: reduced-motion media query or token override.

## Icons And Media

- Icon source: prefer TYUI icon component or known system icons.
- Icon accessible name policy: decorative by default; meaningful icons require equivalent label/description text.
- Decorative icon policy: `aria-hidden="true"`.
- Media slot behavior: simple inline icons only.
- Media cloning behavior: N/A.
- Image fallback behavior: N/A.

## Examples

### Valid Example

```tsx
<label for="email">Email</label>
<tyui-input id="email" name="email" type="email" required placeholder="name@example.com" />
```

### Invalid Example

Reason: placeholder text is not a sufficient accessible label.

```tsx
<tyui-input placeholder="Email" />
```

### Edge Case Example

Reason: content slots may decorate the field but must not add unlabeled actions.

```tsx
<tyui-input aria-label="Search" type="search" placeholder="Search">
  <tyui-icon slot="contentBefore" name="search" aria-hidden="true" />
</tyui-input>
```

## Agent Guidance

- Preferred intent: single-line native text entry.
- Common misuse: placeholder-only label, custom date/time input, interactive clear button in content slot, using input for option selection.
- Safe composition patterns: field with label/hint/error, form row, search field without clear action.
- `design-app.md` notes: generated app variants may remap public `--ty-input-*` tokens and documented parts only.
- Library gaps to report: `tyui-field`, `tyui-search-box`, date/time pickers, clearable input if product design needs those.
- Required source docs to read before implementation: this document, `spec/behavior.md`, `spec/styling.md`, `spec/layout.md`, `spec/testing.md`.
- Implementation pitfalls: do not clobber consumer ARIA; do not set empty ARIA attributes; programmatic value writes must not emit input; `defaultValue` seeds only once; required validity should not create event loops.

## Tests

### Unit / Contract Tests

| Requirement                           | Setup                                                                 | Action                                               | Validation                                                                                |
| ------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Renders native input.                 | Mount `<tyui-input></tyui-input>`.                                    | Query shadow DOM.                                    | Internal `<input>` exists.                                                                |
| Value binds to internal input.        | Mount input, set `el.value='abc'`.                                    | Await update.                                        | Internal input value is `abc`; no `input` event emitted.                                  |
| Attribute value initializes property. | Mount with `value="hello"`.                                           | Await upgrade.                                       | Host and internal input value are `hello`.                                                |
| `defaultValue` seeds once.            | Mount with `default-value="seed"`, then set `defaultValue='changed'`. | Inspect values.                                      | Initial value is `seed`; later default update does not overwrite.                         |
| `value` wins over `defaultValue`.     | Mount with both.                                                      | Inspect value.                                       | Explicit value is used.                                                                   |
| User input emits payload.             | Mount with listener.                                                  | Dispatch native input after changing internal value. | Host value updates and event detail equals `{ value }`.                                   |
| Native change re-dispatches.          | Mount with listener.                                                  | Dispatch native `change`.                            | Host `change` fires, bubbles, and is composed.                                            |
| ARIA label mirrors.                   | Mount with `aria-label`.                                              | Inspect internal input.                              | Internal input has same `aria-label`.                                                     |
| ARIA description mirrors.             | Mount with `aria-describedby`.                                        | Inspect internal input.                              | Internal input has same `aria-describedby`, and absent source does not create empty attr. |
| Appearance reflects.                  | Mount each appearance.                                                | Inspect host.                                        | Host attribute matches.                                                                   |
| Size reflects.                        | Mount each size.                                                      | Inspect host.                                        | Host attribute matches.                                                                   |
| Type forwards.                        | Mount each supported type.                                            | Inspect internal input.                              | Native input `type` matches or falls back only where browser requires.                    |
| Readonly forwards.                    | Mount readonly.                                                       | Inspect internal input.                              | `readOnly` is true.                                                                       |
| Required validity works.              | Mount required empty, then set value.                                 | Call `checkValidity()`.                              | Empty is invalid/valueMissing; non-empty is valid and clears invalid.                     |
| Form submission works.                | Put named input in form.                                              | Construct `FormData`.                                | FormData contains name/value.                                                             |
| Focus delegates.                      | Call `el.focus()`.                                                    | Inspect shadow active element.                       | Internal input is focused.                                                                |
| Slots are exposed.                    | Mount contentBefore/contentAfter.                                     | Query slots.                                         | Each slot has assigned content.                                                           |
| Focus outline is present.             | Inspect stylesheet.                                                   | Search rules.                                        | Control `:focus-within` uses focus indicator token for a visible outline.                 |

### Browser E2E Tests

| Requirement                           | Setup                                     | Action                        | Validation                                                |
| ------------------------------------- | ----------------------------------------- | ----------------------------- | --------------------------------------------------------- |
| Native textbox semantics render.      | Open default story.                       | Query internal input.         | Tag is `input`, default type is `text`, role is native.   |
| Programmatic value updates UI.        | Open filled story.                        | Set host `value='Updated'`.   | Internal input value updates.                             |
| `default-value` seeds fresh element.  | Inject fresh element in browser.          | Set attribute before append.  | Internal input value is seeded.                           |
| Typing updates host and event detail. | Open default story with listener.         | Fill internal input.          | Host `value` and captured detail match typed value.       |
| ARIA forwarding works in browser.     | Inject input with ARIA label/description. | Inspect internal input.       | Attributes are mirrored.                                  |
| Form submission includes value.       | Open form story.                          | Fill and submit.              | Submitted data contains expected name/value.              |
| Disabled is skipped by Tab.           | Open disabled story.                      | Press Tab.                    | Disabled input does not receive focus.                    |
| Readonly remains focusable.           | Open readonly story.                      | Press Tab and attempt typing. | Focus enters input; value does not mutate through typing. |

### Accessibility Tests

| Requirement                           | Setup                                              | Action                                   | Validation                                      |
| ------------------------------------- | -------------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Label is required.                    | Mount without label or ARIA in validation fixture. | Run accessibility check.                 | Missing accessible name is reported.            |
| Placeholder-only is invalid guidance. | Validate invalid example.                          | Run docs/example validator.              | Example is rejected.                            |
| Required state is exposed.            | Mount required input.                              | Inspect accessibility tree/native attrs. | Required is announced/exposed.                  |
| Invalid state is exposed.             | Mount invalid input.                               | Inspect internal input.                  | `aria-invalid="true"` or equivalent is present. |
| Decorative slots are hidden.          | Mount icons with `aria-hidden`.                    | Inspect accessibility tree.              | Icons do not pollute field name.                |
| Consumer ARIA is preserved.           | Mount with author ARIA.                            | Inspect host and internal input.         | Author values remain intact and mirrored.       |

### Visual And Contrast Tests

| Requirement                                | Setup                                      | Action                                   | Validation                                                                      |
| ------------------------------------------ | ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------- |
| Appearance matrix renders.                 | Render all base appearances in light/dark. | Capture visual snapshots.                | Outline, filled-darker, and filled-lighter match expected geometry.             |
| Size matrix renders.                       | Render small, medium, large.               | Capture visual snapshots.                | Min heights, icon sizes, and padding match matrix.                              |
| Content slots render.                      | Render contentBefore/contentAfter icons.   | Capture visual snapshots.                | Icons align and inherit muted color.                                            |
| Text contrast meets AA.                    | Load light and dark themes.                | Compare text on surface.                 | Text contrast is at least 4.5:1.                                                |
| Focus outline contrast meets non-text AA.  | Load light and dark themes.                | Compare focus indicator against surface. | Contrast is at least 3:1.                                                       |
| Border waivers are explicit.               | Run contrast tests.                        | Inspect skipped/waived assertions.       | Default/hover border waivers are documented and not counted as passed coverage. |
| Forced-colors mode is usable.              | Emulate forced colors.                     | Render focus, disabled, invalid.         | Uses `Field`, `FieldText`, `GrayText`, `Highlight`; focus visible.              |
| Reduced motion collapses focus transition. | Emulate reduced motion.                    | Inspect computed transition.             | Focus transition is 0ms or token-collapsed.                                     |

### Generated Design / AI Contract Tests

| Requirement                                 | Setup                              | Action                           | Validation                                                                             |
| ------------------------------------------- | ---------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| Manifest sync.                              | Generate `custom-elements.json`.   | Compare docs.                    | Attributes, properties, slots, parts, and tokens in this doc exist in manifest/source. |
| Design metadata sync.                       | Validate `.design.json`.           | Compare intent and alternatives. | Misuse alternatives include textarea, select, combobox, search box, field.             |
| Generated app CSS uses public surface only. | Generate `component-variants.css`. | Lint selectors.                  | Uses host attrs, public `--ty-input-*`, documented parts, or app-owned classes only.   |
| Examples compile.                           | Run TSX example smoke tests.       | Compile Solid JSX.               | Valid examples pass; invalid examples fail validation.                                 |

### Coverage Checklist

- Core behavior: value/defaultValue/input/change.
- DOM contract: native input, control wrapper, content slots.
- Public API reflection: appearance, size, type, disabled, readonly, required, invalid.
- Events: `input` detail and `change`.
- Slots: contentBefore/contentAfter.
- Parts and forwarded parts: control, input, content-before, content-after; no forwarded parts.
- Styling tokens: `--ty-input-*`.
- Private styling boundary: `--_ty-input-icon-size`.
- Accessibility: label, ARIA mirroring, required, invalid, disabled, readonly.
- Keyboard: native text editing.
- Focus: delegated focus and focus-within indicator.
- Pointer: hover visual only.
- Form behavior: ElementInternals, FormData, validity.
- Popup / overlay behavior: N/A.
- Motion and reduced motion: focus transition.
- Forced colors: system-color mapping.
- Contrast: text/focus and border waivers.
- Cleanup: no external listeners.
- Solid typing: intrinsic element, properties, and input/change event typing.
- Example smoke coverage: valid and invalid examples.
- Manifest/doc sync: required.
- Design metadata sync: required.
