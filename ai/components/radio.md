# Radio Component Contract

## Identity

- Component name: Radio
- Tag name: `tyui-radio`
- Package entry point: `@toyu-ui/elements/radio`
- Status: planned / implementation-ready
- Source file: `libs/elements/src/radio/tyui-radio.ts`
- Component family: form controls
- Pattern type: composite child item
- Closest native element or ARIA pattern: `<input type="radio">` inside a radio group
- Fluent / reference analogue: Fluent UI v9 Radio and `ds-radio`
- Related components: `tyui-radio-group`

## Intent

Radio represents one option in a mutually exclusive set. It renders native radio semantics but delegates coordinated selection, roving tabindex, group value, and form association to `tyui-radio-group`.

## Selection Guidance

- Use when: the component appears as one child option inside `tyui-radio-group`.
- Do not use when: the user can select more than one option; use `tyui-checkbox` instead.
- Prefer instead: `tyui-radio-group` for public app markup because the group owns keyboarding, value, required state, and form submission.
- Product-level variant preferences: generated themes may tune indicator fill, label position, spacing, and focus tokens.
- One semantic target / one action rule: the radio indicator and label select the same option only.

## Composition Contract

- Allowed children: phrasing content label in the default slot.
- Required parent: `tyui-radio-group` for production use.
- Allowed standalone use: only for low-level tests or native-like semantics without group coordination.
- Disallowed nested interactive content: buttons, links, inputs, menus, or focusable controls inside label content.

## API

| Attribute        | Type                 | Reflected Property | Default   | Description                                                  |
| ---------------- | -------------------- | ------------------ | --------- | ------------------------------------------------------------ |
| `checked`        | boolean              | `checked`          | `false`   | Whether this option is selected. Usually owned by the group. |
| `disabled`       | boolean              | `disabled`         | `false`   | Disables this option.                                        |
| `required`       | boolean              | `required`         | `false`   | Propagated from group when required.                         |
| `label-position` | `'after' \| 'below'` | `labelPosition`    | `'after'` | Label placement.                                             |
| `name`           | string               | `name`             | `''`      | Native radio name, usually propagated by group.              |
| `value`          | string               | `value`            | `''`      | Option value used by group.                                  |

Radio does not dispatch a public `change` event by itself. The group dispatches `change` with `{ value }`.

## Styling Contract

### CSS Parts

| Name        | Description              |
| ----------- | ------------------------ |
| `root`      | Internal label wrapper.  |
| `indicator` | Indicator wrapper.       |
| `circle`    | Decorative radio circle. |
| `dot`       | Decorative selected dot. |
| `label`     | Label content wrapper.   |

### Public Tokens

| Name                             | Default                    | Description                     |
| -------------------------------- | -------------------------- | ------------------------------- |
| `--ty-radio-size`                | `1rem`                     | Circle size.                    |
| `--ty-radio-dot-size`            | `0.5rem`                   | Selected dot size.              |
| `--ty-radio-gap`                 | `--ty-space-2`             | Circle-label gap.               |
| `--ty-radio-border-color`        | `--ty-color-border-strong` | Circle border.                  |
| `--ty-radio-checked-color`       | `--ty-color-accent`        | Checked circle fill and border. |
| `--ty-radio-checked-dot-color`   | `--ty-color-on-accent`     | Dot color on the checked fill.  |
| `--ty-radio-disabled-foreground` | `--ty-color-disabled-text` | Disabled label and indicator.   |

## Behavior

- Native element used: internal `<input type="radio">` wrapped by `<label>`.
- Focus owner: native shadow input. The host uses `delegatesFocus`, but keyboard focus must land on the internal `<input type="radio">` for reliable browser tabbing.
- Roving tabindex: parent group sets host `tabIndex`; `tyui-radio` must preserve a parent-assigned `tabIndex=0` when it connects and mirror that active tab stop to the inner input. Inactive radios keep both host and input at `tabIndex=-1`.
- Label click: native label routes click to inner input; group hears the composed click on the host.
- Disabled: inner input disabled and host is removed from group tab order.
- Form: standalone radio is not form-associated; group owns form submission.

## Keyboard Contract

| Key                        | Context                         | Action                                                                          | Prevent Default | Event                             | Notes                                                       |
| -------------------------- | ------------------------------- | ------------------------------------------------------------------------------- | --------------- | --------------------------------- | ----------------------------------------------------------- |
| `Space`                    | Standalone focused radio input  | Selects the native radio.                                                       | Native behavior | Native `change` on inner input    | Provided by `<input type="radio">`; no custom host handler. |
| `Space`                    | Radio inside `tyui-radio-group` | Parent group selects the focused radio if unchecked.                            | Yes, by group   | Group `change` with `{ value }`   | Group owns public state and event.                          |
| `ArrowRight` / `ArrowDown` | Radio inside group              | Move focus and selection to next enabled radio, wrapping.                       | Yes, by group   | Group `change` when value changes | Both axes are accepted in all layouts.                      |
| `ArrowLeft` / `ArrowUp`    | Radio inside group              | Move focus and selection to previous enabled radio, wrapping.                   | Yes, by group   | Group `change` when value changes | Disabled radios are skipped.                                |
| `Tab`                      | Group entry                     | Enters the one radio with `tabIndex=0` and delegates focus to its native input. | No              | none                              | Checked enabled radio wins; otherwise first enabled radio.  |

Verification note: standalone Space selection is intentionally delegated to the native shadow `<input type="radio">`. Synthetic unit tests cannot trigger trusted native keyboard defaults reliably, so browser verification must focus the host and press Space. Group arrow/Space behavior is custom and covered by deterministic element tests.

## Accessibility

The native radio input owns the radio semantics. Decorative circle and dot are hidden from assistive technology. `label-position` changes visual layout only.

## Examples

### Storybook Examples

```html story title="Standalone Radio"
<tyui-radio value="metric" checked>Metric</tyui-radio>
```

```html story title="Label Positions"
<div style="display:flex;flex-wrap:wrap;gap:18px;align-items:start;">
  <tyui-radio value="after" checked>Label after</tyui-radio>
  <tyui-radio value="below" label-position="below" checked>Label below</tyui-radio>
  <tyui-radio value="disabled" disabled>Disabled</tyui-radio>
</div>
```

## Tests

| Requirement                         | Setup                                                           | Action                          | Validation                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Native radio exists.                | Mount `<tyui-radio value="a">A</tyui-radio>`.                   | Query shadow DOM.               | `input[type='radio']` exists; value is `a`.                                                                     |
| Checked syncs.                      | Mount with `checked`.                                           | Inspect input.                  | Input is checked.                                                                                               |
| Disabled syncs.                     | Mount with `disabled`.                                          | Inspect input/host.             | Input disabled; host `tabIndex=-1`.                                                                             |
| Standalone default is not tabbable. | Mount enabled radio.                                            | Inspect host/input.             | Host and input are `tabIndex=-1` unless a group or consumer assigns the tab stop.                               |
| Parent roving tab stop preserved.   | Set `radio.tabIndex=0` before connecting.                       | Append to DOM.                  | Host remains `tabIndex=0`; inner input mirrors `tabIndex=0`.                                                    |
| Label position reflects.            | Mount `label-position="below"`.                                 | Inspect part/root data.         | Visual layout state is below.                                                                                   |
| Native label activation.            | Mount standalone radio.                                         | Click slotted label.            | Native input becomes checked.                                                                                   |
| Native Space activation.            | Mount standalone radio in a real browser.                       | Focus host, press Space.        | Native input becomes checked.                                                                                   |
| Browser Tab entry.                  | Mount radio group in direct Vite e2e fixture with value `b`.    | Start from `body`, press `Tab`. | Document focus is the active `tyui-radio`; its shadow `input` is focused; inactive radios remain `tabIndex=-1`. |
| Browser arrow movement.             | Continue from focused checked radio in direct Vite e2e fixture. | Press `ArrowRight`.             | Group value changes to next enabled radio; focus moves to that radio's shadow `input`; roving tab stop updates. |
| Styling hooks exist.                | Mount radio.                                                    | Query parts.                    | `root`, `indicator`, `circle`, `dot`, `label` exist.                                                            |
| Checked visual is filled.           | Mount radio with `checked`.                                     | Inspect CSS/styling.            | Circle fill uses `--ty-radio-checked-color`; dot uses `--ty-radio-checked-dot-color`.                           |
