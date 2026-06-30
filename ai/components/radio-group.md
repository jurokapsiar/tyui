# RadioGroup Component Contract

## Identity

- Component name: RadioGroup
- Tag name: `tyui-radio-group`
- Package entry point: `@toyu-ui/elements/radio-group`
- Status: planned / implementation-ready
- Source file: `libs/elements/src/radio-group/tyui-radio-group.ts`
- Component family: form controls
- Pattern type: composite form-associated widget
- Closest native element or ARIA pattern: ARIA `radiogroup` with native radio children
- Fluent / reference analogue: Fluent UI v9 RadioGroup and `ds-radio-group`
- Related components: `tyui-radio`

## Intent

RadioGroup lets the user select exactly one option from a small set. It owns shared value, selection synchronization, roving tabindex, keyboard navigation, required state, disabled state, and form submission for child `tyui-radio` items.

## Selection Guidance

- Use when: the user must choose one option from a small visible set.
- Do not use when: options can be combined, hidden in a long list, or loaded through search.
- Prefer instead: `tyui-checkbox` for independent choices and future `tyui-select` for compact long lists.
- Product-level variant preferences: generated themes may tune layout gaps, label treatment, radio indicator tokens, and focus tokens.
- One semantic target / one action rule: each child radio selects exactly one group value.

## Composition Contract

- Allowed children: `tyui-radio` elements and optional non-interactive text nodes.
- Required child components: one or more `tyui-radio` for useful interaction.
- Allowed slots: default radios; optional `label` slot.
- Disallowed nested interactive content: non-radio inputs, buttons, links, or nested composites as selectable items.
- Composition anti-patterns: using checkboxes for mutually exclusive choices; manually setting multiple checked radios after connection.

## API

| Attribute  | Type                                                 | Reflected Property | Default      | Description                                                               |
| ---------- | ---------------------------------------------------- | ------------------ | ------------ | ------------------------------------------------------------------------- |
| `label`    | string                                               | `label`            | `''`         | Internal group label text when no external `aria-labelledby` is supplied. |
| `name`     | string                                               | `name`             | `''`         | Submitted form field name and child radio name.                           |
| `value`    | string                                               | `value`            | `''`         | Current selected option value.                                            |
| `layout`   | `'vertical' \| 'horizontal' \| 'horizontal-stacked'` | `layout`           | `'vertical'` | Group layout.                                                             |
| `disabled` | boolean                                              | `disabled`         | `false`      | Disables the whole group.                                                 |
| `required` | boolean                                              | `required`         | `false`      | Requires one selected value.                                              |

### Events

| Name     | Detail Type         | Bubbles | Composed | Description                        |
| -------- | ------------------- | ------- | -------- | ---------------------------------- |
| `change` | `{ value: string }` | yes     | yes      | Fired when user selection changes. |

Programmatic `value` changes do not emit `change`.

## Styling Contract

### Slots

| Name    | Description                             |
| ------- | --------------------------------------- |
| default | Child radios.                           |
| `label` | Optional external visual label content. |

### CSS Parts

| Name    | Description                         |
| ------- | ----------------------------------- |
| `label` | Generated or slotted label wrapper. |
| `items` | Wrapper around radio children.      |

### Public Tokens

| Name                                   | Default                    | Description                                 |
| -------------------------------------- | -------------------------- | ------------------------------------------- |
| `--ty-radio-group-gap`                 | `--ty-space-2`             | Gap between label/items or vertical radios. |
| `--ty-radio-group-inline-gap`          | `--ty-space-4`             | Gap for horizontal layouts.                 |
| `--ty-radio-group-label-color`         | `--ty-color-text`          | Label color.                                |
| `--ty-radio-group-disabled-foreground` | `--ty-color-disabled-text` | Disabled label color.                       |

## Behavior

- State owner: group owns `value`; children expose checked state as synchronized view.
- Initial value: `value` attribute selects matching radio; if no value is supplied, the first checked child is adopted.
- Click: clicking an enabled child selects it and fires one `change` unless already selected.
- Keyboard: ArrowRight/ArrowDown select next enabled radio; ArrowLeft/ArrowUp select previous enabled radio; navigation wraps and skips disabled radios. Space selects focused unchecked radio.
- Focus: one enabled radio has `tabIndex=0`; checked enabled radio wins, otherwise first enabled radio.
- Disabled group: sets `aria-disabled="true"`, removes child radios from tab order, and blocks click/key selection.
- Layout: `horizontal-stacked` propagates `label-position="below"` to child radios; other layouts use `after`.
- Form-associated: yes.
- Submitted value: `name=value` when a value is selected and group is not disabled.
- Required: host `aria-required="true"`, children required, and missing value is invalid.
- Name propagation: explicit group `name` wins; otherwise unnamed children get a generated shared fallback name while child-supplied names are preserved.

## Accessibility

- Host role defaults to `radiogroup` if consumer did not set one.
- If `aria-labelledby` is supplied, preserve it. Otherwise generate a stable internal label ID from the `label` attribute or `label` slot.
- Child radios keep native radio semantics.
- ID references across shadow boundaries are avoided for child labels; the group label relationship is host-owned.

## Examples

### Storybook Examples

```html story title="Default"
<tyui-radio-group label="Pick one" name="choice">
  <tyui-radio value="a">Option A</tyui-radio>
  <tyui-radio value="b">Option B</tyui-radio>
  <tyui-radio value="c">Option C</tyui-radio>
</tyui-radio-group>
```

```html story title="Selected"
<tyui-radio-group label="Pick one" name="choice" value="b">
  <tyui-radio value="a">Option A</tyui-radio>
  <tyui-radio value="b">Option B</tyui-radio>
  <tyui-radio value="c">Option C</tyui-radio>
</tyui-radio-group>
```

```html story title="Layouts"
<div style="display:grid;gap:24px;">
  <tyui-radio-group label="vertical" layout="vertical" value="b">
    <tyui-radio value="a">A</tyui-radio>
    <tyui-radio value="b">B</tyui-radio>
    <tyui-radio value="c">C</tyui-radio>
  </tyui-radio-group>
  <tyui-radio-group label="horizontal" layout="horizontal" value="b">
    <tyui-radio value="a">A</tyui-radio>
    <tyui-radio value="b">B</tyui-radio>
    <tyui-radio value="c">C</tyui-radio>
  </tyui-radio-group>
  <tyui-radio-group label="horizontal-stacked" layout="horizontal-stacked" value="b">
    <tyui-radio value="a">A</tyui-radio>
    <tyui-radio value="b">B</tyui-radio>
    <tyui-radio value="c">C</tyui-radio>
  </tyui-radio-group>
</div>
```

### Design Examples

```html design title="Atmospheric Glass"
<div
  data-design-system="atmospheric-glass"
  style="box-sizing:border-box;min-height:360px;padding:40px;display:flex;align-items:center;justify-content:center;"
>
  <section
    class="ty-glass-surface"
    data-elevation="elevated"
    data-shine="true"
    style="box-sizing:border-box;width:min(100%,640px);padding:28px;display:grid;gap:18px;"
  >
    <div class="ty-metric-label">Atmospheric Glass</div>
    <tyui-radio-group label="Temperature units" layout="horizontal-stacked" value="metric">
      <tyui-radio value="imperial">Fahrenheit</tyui-radio>
      <tyui-radio value="metric">Celsius</tyui-radio>
      <tyui-radio value="kelvin">Kelvin</tyui-radio>
    </tyui-radio-group>
  </section>
</div>
```

```html design title="Fluent Web"
<div
  data-design-system="fluent-web"
  style="box-sizing:border-box;min-height:360px;padding:32px;background:var(--ty-color-background);"
>
  <section
    class="ty-fluent-panel"
    data-elevation="raised"
    style="box-sizing:border-box;width:min(100%,640px);padding:20px;display:grid;gap:18px;"
  >
    <div>
      <div class="ty-fluent-title">Default view</div>
      <div class="ty-fluent-caption">Mutually exclusive choices use a radio group.</div>
    </div>
    <tyui-radio-group label="Startup page" value="dashboard">
      <tyui-radio value="dashboard">Dashboard</tyui-radio>
      <tyui-radio value="activity">Activity</tyui-radio>
      <tyui-radio value="settings">Settings</tyui-radio>
    </tyui-radio-group>
  </section>
</div>
```

## Tests

| Requirement                 | Setup                                          | Action                     | Validation                                                                        |
| --------------------------- | ---------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| Role and label.             | Mount with `label` and radios.                 | Inspect host/shadow label. | `role=radiogroup`; `aria-labelledby` points to generated label.                   |
| Value selects child.        | Mount with `value="b"`.                        | Inspect children.          | Only radio `b` checked.                                                           |
| First enabled tab stop.     | Mount no value with first radio disabled.      | Inspect tabIndex.          | First enabled child is `0`; others `-1`.                                          |
| Click selection.            | Mount with listener.                           | Click second radio.        | Value changes, checked states sync, one composed bubbling change has `{ value }`. |
| No duplicate change.        | Mount selected radio.                          | Click selected radio.      | No change fires.                                                                  |
| Disabled handling.          | Mount disabled group and disabled child cases. | Click/keydown.             | Value does not change.                                                            |
| Form submission.            | Put named group with selected value in form.   | Construct `FormData`.      | Submitted `name=value`.                                                           |
| Programmatic value.         | Set `group.value`.                             | Inspect children/listener. | Checked syncs; no change fires.                                                   |
| Arrow navigation.           | Focus active radio.                            | Arrow keys.                | Focus and value move, wrapping and skipping disabled radios.                      |
| Space selection.            | Focus unchecked radio.                         | Press Space.               | Value updates and change fires once.                                              |
| Required validity.          | Mount required without value, then set value.  | Call `checkValidity()`.    | Missing value invalid; selected value valid.                                      |
| Non-radio children ignored. | Slot an extra checkbox.                        | Click extra control.       | Group value remains unchanged.                                                    |
