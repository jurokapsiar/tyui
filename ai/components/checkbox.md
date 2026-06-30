# Checkbox Component Contract

## Identity

- Component name: Checkbox
- Tag name: `tyui-checkbox`
- Package entry point: `@toyu-ui/elements/checkbox`
- Status: planned / implementation-ready
- Source file: `libs/elements/src/checkbox/tyui-checkbox.ts`
- Component family: form controls
- Pattern type: native-like form-associated control
- Closest native element or ARIA pattern: `<input type="checkbox">`
- Fluent / reference analogue: Fluent UI v9 Checkbox
- Related components: `tyui-input`, `tyui-radio`, `tyui-radio-group`

## Intent

Checkbox captures an independent yes/no choice, optionally with an indeterminate mixed state for parent/child selection summaries. It must preserve native checkbox semantics through an inner checkbox input while exposing TYUI styling hooks for generated design bundles.

Do not use Checkbox for mutually exclusive choices; use `tyui-radio-group` with `tyui-radio` children instead.

## Selection Guidance

- Use when: the user can toggle one independent option, accept a term, or mark an item as included.
- Do not use when: exactly one option from a set must be selected.
- Prefer instead: `tyui-radio-group` for mutually exclusive choices.
- Product-level variant preferences: generated themes may tune box, color, spacing, and focus tokens.
- One semantic target / one action rule: the label and box activate the same checkbox only.

## Composition Contract

- Allowed children: phrasing content in the default slot.
- Required parent: none.
- Required child components: none.
- Optional child components: none.
- Allowed slots: default label slot.
- Disallowed nested interactive content: links, buttons, inputs, checkboxes, radios, menus, or any focusable controls inside the label slot.
- Composition anti-patterns: using `indeterminate` as a submitted third value; indeterminate is visual/semantic mixed state and does not submit.

## API

### Attributes

| Name            | Type    | Reflected Property | Default | Description                                            |
| --------------- | ------- | ------------------ | ------- | ------------------------------------------------------ |
| `checked`       | boolean | `checked`          | `false` | Checked state.                                         |
| `indeterminate` | boolean | `indeterminate`    | `false` | Mixed visual state. Does not submit.                   |
| `disabled`      | boolean | `disabled`         | `false` | Disables native input and removes host from tab order. |
| `required`      | boolean | `required`         | `false` | Requires checked state for validity.                   |
| `name`          | string  | `name`             | `''`    | Submitted form field name.                             |
| `value`         | string  | `value`            | `'on'`  | Submitted value when checked and not indeterminate.    |

### Events

| Name     | Detail Type | Bubbles | Composed | Description                                           |
| -------- | ----------- | ------- | -------- | ----------------------------------------------------- |
| `change` | none        | yes     | yes      | Fired after user toggles checked/indeterminate state. |

Programmatic property or attribute changes do not emit `change`.

## Styling Contract

### Slots

| Name    | Description         |
| ------- | ------------------- |
| default | Label text/content. |

### CSS Parts

| Name      | Description                 |
| --------- | --------------------------- |
| `control` | Internal label/control row. |
| `box`     | Decorative checkbox square. |
| `label`   | Label content wrapper.      |

### Public Tokens

| Name                                     | Default                    | Description                    |
| ---------------------------------------- | -------------------------- | ------------------------------ |
| `--ty-checkbox-size`                     | `1rem`                     | Visual box size.               |
| `--ty-checkbox-radius`                   | `--ty-radius-1`            | Box radius.                    |
| `--ty-checkbox-gap`                      | `--ty-space-2`             | Box-label gap.                 |
| `--ty-checkbox-border-color`             | `--ty-color-border-strong` | Resting box border.            |
| `--ty-checkbox-background`               | `--ty-color-surface`       | Resting box background.        |
| `--ty-checkbox-checked-background`       | `--ty-color-accent`        | Checked box background.        |
| `--ty-checkbox-checked-foreground`       | `--ty-color-on-accent`     | Check mark color.              |
| `--ty-checkbox-indeterminate-foreground` | `--ty-color-accent`        | Mixed mark color.              |
| `--ty-checkbox-disabled-foreground`      | `--ty-color-disabled-text` | Disabled label and mark color. |

Private helper variables use `--_ty-checkbox-*` and are not consumer hooks.

### Styling State Surface

| State         | Surface                                               | Public | Notes                                                |
| ------------- | ----------------------------------------------------- | ------ | ---------------------------------------------------- |
| checked       | host `[checked]` and native input checked             | yes    | Selection styling hook.                              |
| indeterminate | host `[indeterminate]` and native input indeterminate | yes    | Mixed styling hook.                                  |
| disabled      | host `[disabled]` and native input disabled           | yes    | Removes normal interaction.                          |
| required      | host `[required]` and native input required           | yes    | Validation styling hook.                             |
| focus         | `:host(:focus-within)`                                | yes    | Used because focus delegates to hidden native input. |

## Behavior

- Native element used: internal `<input type="checkbox">` wrapped by a `<label>`.
- Native behavior preserved: role, checked/mixed semantics, disabled, label click, Space toggle.
- Custom behavior added: host `.click()` forwards to the native input for programmatic/test activation; shadow `change` is re-dispatched from the host.
- Focus owner: host delegates focus to the native input.
- Tabbable elements: host is `tabIndex=0` when enabled, `-1` when disabled; inner input is visually hidden.
- Keyboard: Space toggles natively when focused; synthetic Space may be forwarded for deterministic tests.
- Pointer: clicking the host or label toggles when enabled.
- Indeterminate interaction: user toggle clears `indeterminate` and updates `checked`.
- Form-associated: yes.
- Submitted value: `name=value` only when checked and not indeterminate.
- Validity: required unchecked is `valueMissing`; checked is valid.
- Disabled: disabled controls do not submit and are valid.

## Layout Contract

- Display: `inline-flex`.
- Intrinsic size: content-sized from box, gap, and label.
- Wrap policy: label can wrap; box is fixed.
- Minimum visual target: component should remain at least token-sized and may be enlarged by product tokens.
- Parent owns: outer margin, stretching, row/column arrangement.
- Component owns: internal label alignment, box size, gap, focus ring.

## Accessibility

- The native input owns checkbox semantics.
- The slotted label is associated through the wrapping label.
- Decorative box is `aria-hidden`.
- Preserve consumer ARIA on the host unless a field wrapper supplies explicit relationships in the future.
- Forced-colors mode must use system colors for box, disabled, and focus.

## Examples

### Storybook Examples

```html story title="Default"
<tyui-checkbox>Receive notifications</tyui-checkbox>
```

```html story title="States"
<div style="display:grid;gap:12px;align-items:start;">
  <tyui-checkbox>Unchecked</tyui-checkbox>
  <tyui-checkbox checked>Checked</tyui-checkbox>
  <tyui-checkbox indeterminate>Indeterminate</tyui-checkbox>
  <tyui-checkbox disabled>Disabled</tyui-checkbox>
  <tyui-checkbox disabled checked>Disabled checked</tyui-checkbox>
  <tyui-checkbox disabled indeterminate>Disabled indeterminate</tyui-checkbox>
  <tyui-checkbox required>Required</tyui-checkbox>
</div>
```

### Design Examples

```html design title="Atmospheric Glass"
<div
  data-design-system="atmospheric-glass"
  style="box-sizing:border-box;min-height:320px;padding:40px;display:flex;align-items:center;justify-content:center;"
>
  <section
    class="ty-glass-surface"
    data-elevation="elevated"
    data-shine="true"
    style="box-sizing:border-box;width:min(100%,560px);padding:28px;display:grid;gap:16px;"
  >
    <div class="ty-metric-label">Atmospheric Glass</div>
    <tyui-checkbox checked>Include wind alerts</tyui-checkbox>
    <tyui-checkbox indeterminate>Some regions selected</tyui-checkbox>
    <tyui-checkbox>Show experimental layers</tyui-checkbox>
  </section>
</div>
```

```html design title="Fluent Web"
<div
  data-design-system="fluent-web"
  style="box-sizing:border-box;min-height:320px;padding:32px;background:var(--ty-color-background);"
>
  <section
    class="ty-fluent-panel"
    data-elevation="raised"
    style="box-sizing:border-box;width:min(100%,560px);padding:20px;display:grid;gap:14px;"
  >
    <div>
      <div class="ty-fluent-title">Preferences</div>
      <div class="ty-fluent-caption">Independent choices use checkboxes.</div>
    </div>
    <tyui-checkbox checked>Email me updates</tyui-checkbox>
    <tyui-checkbox>Enable preview features</tyui-checkbox>
    <tyui-checkbox indeterminate>Some teams selected</tyui-checkbox>
  </section>
</div>
```

### Valid Example

```html
<tyui-checkbox name="alerts" value="wind" checked>Include wind alerts</tyui-checkbox>
```

### Invalid Example

Reason: use radio when one option must win from a set.

```html
<tyui-checkbox name="unit" value="metric">Metric</tyui-checkbox>
<tyui-checkbox name="unit" value="imperial">Imperial</tyui-checkbox>
```

## Tests

| Requirement                          | Setup                                         | Action                               | Validation                                                     |
| ------------------------------------ | --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| Native checkbox exists.              | Mount `<tyui-checkbox>Label</tyui-checkbox>`. | Query shadow DOM.                    | `input[type='checkbox']` exists; host is tabbable.             |
| Click toggles.                       | Mount enabled checkbox with change spy.       | Call host `.click()`.                | `checked=true`; one composed bubbling `change` fires.          |
| Space toggles.                       | Focus checkbox.                               | Dispatch Space keydown.              | State toggles and `change` fires.                              |
| Indeterminate clears on user toggle. | Mount `indeterminate`.                        | Click host.                          | `indeterminate=false`; `checked=true`.                         |
| Disabled blocks interaction.         | Mount `disabled`.                             | Click host.                          | State does not change; input disabled; host `tabIndex=-1`.     |
| Form submission.                     | Put named checked checkbox in a form.         | Construct `FormData`.                | Submitted value is `on` by default.                            |
| Required validity.                   | Mount required unchecked then checked.        | Call `checkValidity()`.              | Unchecked is invalid; checked is valid.                        |
| Styling hooks exist.                 | Mount states.                                 | Inspect shadow parts and host attrs. | `control`, `box`, `label` parts exist and state attrs reflect. |
