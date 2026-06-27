# TYUI Components

## button

---

component: tyui-button
status: draft
manifest: ../../custom-elements.json
source: ../../libs/elements/src/button/button.ts
designMetadata: ../../libs/elements/src/button/button.design.json

---

# Button

## Identity

- Component name: Button
- Tag name: `tyui-button`
- Package entry point: `@tyui/elements/button`
- Status: Draft
- Source file: `libs/elements/src/button/button.ts`
- Manifest reference: `custom-elements.json#/modules/.../declarations/TyuiButton`
- Design metadata file: `libs/elements/src/button/button.design.json`
- Component family: Action control
- Pattern type: Native-like command button
- Closest native element or ARIA pattern: `<button>`
- Fluent / reference analogue: Fluent UI v9 `Button`; Teams MCP `<ds-button>`
- Related components: future `tyui-menu-button`, `tyui-split-button`, `tyui-toggle-button`, `tyui-link`

## Intent

Use `tyui-button` for immediate user actions in the current context: submit, save, dismiss, confirm, open a non-menu command surface, or run a command.

Do not use it for navigation to another resource; use `tyui-link`. Do not use it for binary state; use a future toggle button or switch. Do not overload one button with navigation plus expand/collapse, selection, menu opening, or dismiss behavior.

## Selection Guidance

- Use when: the user activates one immediate command.
- Do not use when: the action navigates, represents persistent on/off state, opens a command menu, or needs split primary/secondary actions.
- Prefer instead: `tyui-link` for navigation, `tyui-toggle-button` for pressed state, `tyui-menu-button` for menu opening, `tyui-split-button` for primary plus menu actions.
- Product-level variant preferences: product `design-app.md` may prefer `appearance="primary"` for one strongest task action, `secondary` or `default` for ordinary actions, `subtle` or `transparent` for toolbar actions, and `outline` for low-density neutral emphasis.
- One semantic target / one action rule: the host and internal button expose one command. Secondary icon or menu affordances require a separate component.

## Composition Contract

- Allowed children: text label in the default slot; one optional icon-like element in `slot="icon"`.
- Required parent: none.
- Required child components: none.
- Optional child components: `tyui-icon` or decorative SVG in `slot="icon"`.
- Allowed slots: default, `icon`.
- Disallowed nested interactive content: buttons, links, inputs, menu items, or other focusable controls inside any slot.
- Composition anti-patterns: icon-only button without accessible name; wrapping navigation in a button; making the button full-width through an internal prop instead of host CSS; using a plain button to open a menu without menu trigger semantics.

## API

### Attributes

| Name                 | Type                                                                  | Reflected Property  | Default   | Description                                                                                                              |
| -------------------- | --------------------------------------------------------------------- | ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `appearance`         | `default \| secondary \| primary \| outline \| subtle \| transparent` | `appearance`        | `default` | Visual emphasis. `default` is a backwards-compatible alias for `secondary`.                                              |
| `disabled`           | `boolean`                                                             | `disabled`          | `false`   | Uses native disabled behavior on the internal button.                                                                    |
| `disabled-focusable` | `boolean`                                                             | `disabledFocusable` | `false`   | Keeps the button focusable with `aria-disabled="true"` while suppressing activation. Ignored when `disabled` is present. |
| `icon-position`      | `before \| after`                                                     | `iconPosition`      | `before`  | Places the icon slot before or after the label.                                                                          |
| `shape`              | `rounded \| circular \| square`                                       | `shape`             | `rounded` | Border radius style.                                                                                                     |
| `size`               | `small \| medium \| large`                                            | `size`              | `medium`  | Control density and typography size.                                                                                     |
| `type`               | `button \| submit \| reset`                                           | `type`              | `button`  | Native button type forwarded to the internal `<button>`.                                                                 |

### Properties

| Name                | Type                            | Attribute            | Default   | Description                                               |
| ------------------- | ------------------------------- | -------------------- | --------- | --------------------------------------------------------- |
| `appearance`        | same as attribute               | `appearance`         | `default` | Reflects to host.                                         |
| `disabled`          | `boolean`                       | `disabled`           | `false`   | Reflects to host and disables the internal native button. |
| `disabledFocusable` | `boolean`                       | `disabled-focusable` | `false`   | Reflects to host.                                         |
| `iconPosition`      | `before \| after`               | `icon-position`      | `before`  | Reflects to host.                                         |
| `shape`             | `rounded \| circular \| square` | `shape`              | `rounded` | Reflects to host.                                         |
| `size`              | `small \| medium \| large`      | `size`               | `medium`  | Reflects to host.                                         |
| `type`              | `button \| submit \| reset`     | `type`               | `button`  | Does not need to reflect; forwarded to internal button.   |

### Events

| Name    | Detail Type         | Bubbles | Composed | Description                                                        |
| ------- | ------------------- | ------- | -------- | ------------------------------------------------------------------ |
| `click` | native `MouseEvent` | yes     | yes      | Native click from the internal button crosses the shadow boundary. |

### Event Semantics

- User-initiated events: native click from pointer, Enter, or Space.
- Programmatic state changes that must not emit user events: changing `appearance`, `size`, `shape`, `iconPosition`, `disabled`, or `disabledFocusable`.
- Native events that are re-dispatched: none required; native button click should cross the open shadow boundary with composed behavior.
- Internal coordination events: none.
- Cancellation behavior: `disabled-focusable` must call `preventDefault()` and `stopImmediatePropagation()` for click and Enter/Space activation so consumer click handlers do not run.

### Slots

| Name    | Description                          | Fallback | Slotted Styling Rules                                                                                                                                                                                   |
| ------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default | Button label or inline text content. | none     | Label may shrink or wrap; default text must not be treated as fixed width.                                                                                                                              |
| `icon`  | Decorative or semantic icon.         | none     | Slotted icon is `flex: none`, sized from private helper `--_ty-button-icon-size`, and spaced with `--_ty-button-icon-gap`. Icon-only usage requires an accessible name on the host or internal control. |

### CSS Parts

| Name      | Description                        | Allowed Use                                                                                               | Required State Qualifiers                                                                                                            |
| --------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `control` | Internal native `<button>`.        | Advanced structural styling such as text transform or rare border treatment when tokens are insufficient. | Qualify by host attributes such as `[appearance]`, `[size]`, `[shape]`, `[disabled]`, or `[disabled-focusable]` when state-specific. |
| `label`   | Label wrapper around default slot. | Styling label overflow/wrapping only if token hooks are insufficient.                                     | Avoid hiding visible labels unless an accessible name is supplied.                                                                   |

### Forwarded CSS Parts

| Name | Source Component | Description                                                |
| ---- | ---------------- | ---------------------------------------------------------- |
| N/A  | N/A              | Button does not compose nested TYUI components internally. |

### CSS Custom Properties

#### Public Tokens

| Name                             | Default                            | Description                                 |
| -------------------------------- | ---------------------------------- | ------------------------------------------- |
| `--ty-button-background`         | `var(--ty-color-surface)`          | Resting background.                         |
| `--ty-button-background-hover`   | `var(--ty-color-surface-hover)`    | Hover background for non-disabled buttons.  |
| `--ty-button-background-active`  | `var(--ty-color-surface-pressed)`  | Active background for non-disabled buttons. |
| `--ty-button-foreground`         | `var(--ty-color-text)`             | Label/icon color.                           |
| `--ty-button-border-color`       | `var(--ty-color-border)`           | Resting border.                             |
| `--ty-button-border-color-hover` | `var(--ty-color-border-strong)`    | Hover border.                               |
| `--ty-button-radius`             | `var(--ty-control-radius)`         | Control radius.                             |
| `--ty-button-min-block-size`     | size-derived token                 | Minimum block size.                         |
| `--ty-button-min-inline-size`    | size-derived token                 | Minimum inline size for labelled buttons.   |
| `--ty-button-padding-inline`     | `var(--ty-control-padding-inline)` | Inline padding.                             |
| `--ty-button-padding-block`      | `var(--ty-control-padding-block)`  | Block padding.                              |
| `--ty-button-gap`                | `var(--ty-control-gap)`            | Gap between icon and label.                 |
| `--ty-button-font-size`          | `var(--ty-control-font-size)`      | Label font size.                            |
| `--ty-button-font-weight`        | `var(--ty-font-weight-semibold)`   | Label font weight.                          |

#### Private Implementation Variables

Private variables use the `--_ty-*` prefix. List them only so reviewers can distinguish implementation details from consumer hooks; consumers must not depend on them.

| Name                     | Purpose                            |
| ------------------------ | ---------------------------------- |
| `--_ty-button-icon-size` | Size slotted icon per button size. |
| `--_ty-button-icon-gap`  | Derived icon-label gap.            |

### Styling State Surface

| State              | Surface                                                               | Public                                             | Notes                                                                      |
| ------------------ | --------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| Disabled           | Host `[disabled]`; internal native `disabled`                         | Yes                                                | Native disabled wins over disabled-focusable.                              |
| Disabled focusable | Host `[disabled-focusable]`; internal `aria-disabled="true"`          | Yes                                                | Focusable but inert.                                                       |
| Appearance         | Host `[appearance]`; internal private `data-appearance` allowed       | Host yes, internal no                              | `default` maps to secondary visual treatment.                              |
| Size               | Host `[size]`; internal private `data-size` allowed                   | Host yes, internal no                              | Drives token remapping.                                                    |
| Shape              | Host `[shape]`; internal private `data-shape` allowed                 | Host yes, internal no                              | Drives radius token.                                                       |
| Icon position      | Host `[icon-position]`; internal private `data-icon-position` allowed | Host yes, internal no                              | Determines DOM slot order.                                                 |
| Icon only          | Internal `data-icon-only`                                             | No                                                 | Derived from slotted content; consumers use accessible name, not selector. |
| Hover/active/focus | Native pseudo-classes on internal button                              | Yes through behavior, selector private except part | Use `:hover`, `:active`, `:focus-visible`; no JS state.                    |

## Behavior

### State Model

- Controlled state: N/A - button has no value state.
- Uncontrolled / default state: `appearance="default"`, `size="medium"`, `shape="rounded"`, `icon-position="before"`, `type="button"`.
- Derived internal state: icon-only detection from light DOM children; resolved appearance where `default` maps to `secondary`.
- Parent-owned state: parent decides disabled and task-specific emphasis.
- Child-owned state: none.
- Programmatic update behavior: property updates reflect host attributes where documented and update internal button attributes/data.
- User update behavior: user activation emits native click unless disabled or disabled-focusable.
- State reset behavior: removing attributes restores defaults.

### State Transition Matrix

| Current State      | User / Programmatic Action       | Next State                 | Event          | Focus Result                                                  | Notes                                                                    |
| ------------------ | -------------------------------- | -------------------------- | -------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Enabled            | Pointer click                    | Enabled                    | native `click` | Browser default                                               | One command fires.                                                       |
| Enabled            | Enter or Space on focused button | Enabled                    | native `click` | Focus remains on button unless app moves it                   | Native button behavior.                                                  |
| Disabled           | Pointer or keyboard activation   | Disabled                   | none           | Not focusable through Tab                                     | Internal button has `disabled`.                                          |
| Disabled focusable | Pointer or Enter/Space           | Disabled focusable         | none           | Focus remains possible                                        | Internal button has `aria-disabled="true"` and activation is suppressed. |
| Any                | Programmatic `disabled=true`     | Disabled                   | none           | If currently focused, browser behavior may blur native button | Native disabled wins.                                                    |
| Any                | Slot content changes             | Recomputed icon-only state | none           | Unchanged                                                     | `slotchange` triggers internal recompute.                                |

### Native Behavior First

- Native element used: internal `<button>`.
- Native behavior preserved: role, accessible name from content, Enter/Space activation, form submit/reset behavior through `type`, disabled behavior.
- Custom behavior added: disabled-focusable activation suppression; icon-only derived state; visual variant data.
- Why custom behavior is necessary: disabled-focusable mirrors Fluent parity; icon-only sizing cannot be inferred with CSS alone across slotted content.

### Focus Model

- Focus owner: internal native button.
- `delegatesFocus`: optional; not required if host click/focus forwarding is implemented. If enabled, document in manifest.
- Tabbable elements: one internal button when enabled or disabled-focusable; none when disabled.
- Roving tabindex: N/A.
- Active descendant: N/A.
- Focus restoration: app responsibility after command workflows.
- Focus trap: N/A.
- Focus-visible treatment: 2px outer outline plus inset 2px ring, tokenized; forced-colors collapses to `Highlight` outline.
- Pointer focus treatment: native button may focus on click; focus indicator uses `:focus-visible`.

### Keyboard Contract

| Key   | Context                           | Action   | Prevent Default | Event   | Notes                            |
| ----- | --------------------------------- | -------- | --------------- | ------- | -------------------------------- |
| Enter | Focused enabled button            | Activate | Native          | `click` | Native button behavior.          |
| Space | Focused enabled button            | Activate | Native          | `click` | Native button behavior.          |
| Enter | Focused disabled-focusable button | Suppress | yes             | none    | Also stop immediate propagation. |
| Space | Focused disabled-focusable button | Suppress | yes             | none    | Also stop immediate propagation. |

### Pointer And Hit Target Contract

- Primary hit target: the entire internal native button.
- Secondary hit targets: none.
- Hover behavior: visual only; no focus movement, activation, or state mutation.
- Pressed / active behavior: native `:active` visual only.
- Minimum target size: size matrix uses minimum block sizes of 24px, 32px, 40px; products may set a larger semantic minimum target token when touch ergonomics require it.
- Touch / pen considerations: compact `small` is allowed, but products targeting touch should prefer medium or larger.
- Overloaded-target risks: menu opening, split actions, navigation, toggle state, and dismiss behavior must move to specialized components.

### Popup / Overlay Contract

N/A - plain Button does not own popup behavior. A future menu button or split button must define `aria-haspopup`, `aria-expanded`, popup focus behavior, next Tab behavior, Escape, outside click, and focus restoration.

### Form Contract

- Form-associated: no custom ElementInternals required; native internal button participates through `type` when inside a form.
- Submitted value: N/A.
- `FormData` behavior: N/A.
- Validity states: N/A.
- `checkValidity()` / `reportValidity()`: N/A.
- Name propagation: N/A.
- Required / readonly / disabled behavior: `disabled` uses native disabled; readonly and required are not applicable.

### Lifecycle And Cleanup

- External event listeners: none.
- Observers: none.
- Timers: none.
- Generated IDs: none.
- Slotchange work: default and icon slots must trigger icon-only recomputation.
- Cleanup requirements: remove any listeners if future implementation adds them.

## Layout Contract

- Display: host `inline-block`; internal control `inline-flex`.
- Intrinsic size: content-driven with minimum dimensions.
- Shrink policy: label may shrink/wrap; icon does not shrink.
- Wrap policy: labelled content may wrap if product CSS allows; default button layout is a single inline-flex row.
- Minimum target token: `--ty-button-min-block-size`.
- Minimum visual target: 24px small, 32px medium, 40px large; product may increase via semantic target token.
- Flexible slots: default label.
- Fixed slots: icon.
- Parent owns: width, full-width behavior, margin, flex growth, distribution, ordering.
- Component owns: padding, internal gap, icon sizing, min block size, focus ring.
- Container-query thresholds: N/A.
- Scroll / overflow policy: no internal scroll.
- Top-layer / popover policy: N/A.

### Regions / Slots

| Region / Slot | Flex       | Min Inline Size | Wraps | Scrolls | Notes                                                            |
| ------------- | ---------- | --------------- | ----- | ------- | ---------------------------------------------------------------- |
| icon          | `0 0 auto` | icon size       | no    | no      | Slotted `slot="icon"`; decorative icons should be `aria-hidden`. |
| label         | `0 1 auto` | `0`             | yes   | no      | Default slot; accessible name source when text is visible.       |

## Styling Contract

- Semantic tokens: color, control radius, control padding, focus, motion.
- Component tokens: all `--ty-button-*` listed above.
- Private `--_ty-*` variables: icon size and icon gap only.
- Public parts: `control`, `label`.
- Forwarded parts: none.
- Slots and slotted-content rules: `slot="icon"` sized by component; default slot receives text.
- Allowed `::part()` use: advanced structural overrides only; repeated use should become a component token.
- Host class guidance: use host classes for width, margin, flex behavior, and scoped token overrides.
- Inline style guidance: only dynamic per-instance values; static variants belong in CSS or `component-variants.css`.
- Forced-colors behavior: internal button uses `ButtonFace`, `ButtonText`, `GrayText`, and `Highlight`.
- Reduced-motion behavior: transitions collapse to `0ms` when `prefers-reduced-motion: reduce`.
- App-variant hooks: app variants may remap public tokens under `[data-design-system] tyui-button[...]`.

Consumer override order for this component:

1. Attributes and properties: `appearance`, `size`, `shape`, `icon-position`, `disabled`, `disabled-focusable`.
2. Host classes / app-local CSS: layout and scoped token overrides.
3. Public CSS custom properties: `--ty-button-*`.
4. Documented `::part()` selectors: `control`, `label`.
5. Inline `style` for dynamic per-instance values.

## Accessibility

- Role: native button role from internal `<button>`.
- Accessible name: visible text from default slot, `aria-label`, or `aria-labelledby`. Icon-only buttons require an explicit accessible name.
- ARIA attributes: `aria-disabled="true"` on internal button for disabled-focusable only.
- ARIA relationships: none by default.
- Label / description source: slotted text or author ARIA.
- Consumer ARIA preservation: host `aria-label`, `aria-labelledby`, and `aria-describedby` should be mirrored or delegated to the internal button if needed for assistive technology reliability.
- Shadow-boundary ARIA mirroring: required for host naming/description attributes if native accessible name does not cross reliably.
- Decorative content: slotted icons should use `aria-hidden="true"` unless they carry the only accessible meaning, which is discouraged.
- Disabled vs disabled-focusable behavior: disabled removes from tab order; disabled-focusable stays focusable with `aria-disabled` and no activation.
- Loading / status semantics: N/A; use a future loading button or compound button pattern.
- Screen reader expectations: announces button name, disabled state, and no extra state for visual appearance.
- High contrast expectations: text and border remain visible; focus ring uses `Highlight`.

### Accessibility Guidance

- Do: provide visible text where possible.
- Do: provide `aria-label` for icon-only usage.
- Do not: put interactive children inside the button.
- Do not: use a button for navigation or binary state.
- Author responsibilities: choose `type="submit"` or `type="reset"` intentionally in forms; default remains `button` to avoid accidental submit.
- Known tradeoffs: small size is compact and may be below ideal touch target dimensions.

## Motion Contract

- Motion tokens: feedback duration and easing for background, border, and foreground transitions.
- CSS-only motion: yes.
- Reduced-motion behavior: transitions become `0ms`.
- Delayed unmount behavior: N/A.
- Interaction behavior during motion: activation behavior is independent of visual transition.
- Motion can be disabled by: product-level reduced-motion media query or token override.

## Icons And Media

- Icon source: prefer TYUI icon component or known system icons.
- Icon accessible name policy: decorative by default; icon-only button gets name from host ARIA.
- Decorative icon policy: `aria-hidden="true"`, `focusable="false"` for SVG where applicable.
- Media slot behavior: icon only; do not place images or complex media unless they are decorative and size correctly.
- Media cloning behavior: N/A.
- Image fallback behavior: N/A.

## Examples

### Valid Example

```tsx
<tyui-button appearance="primary" type="submit">
  <tyui-icon slot="icon" name="save" aria-hidden="true" />
  Save
</tyui-button>
```

### Invalid Example

Reason: navigation should use a link.

```tsx
<tyui-button on:click={() => navigate('/settings')}>Settings</tyui-button>
```

### Edge Case Example

Reason: icon-only usage is valid only with an accessible name.

```tsx
<tyui-button aria-label="Save" appearance="subtle" shape="circular">
  <tyui-icon slot="icon" name="save" aria-hidden="true" />
</tyui-button>
```

## Agent Guidance

- Preferred intent: immediate command.
- Common misuse: navigation, toggle state, menu trigger, split action, icon-only without name.
- Safe composition patterns: form actions, toolbar command, dialog action row.
- `design-app.md` notes: generated app variants may remap `--ty-button-*` tokens and documented parts only.
- Library gaps to report: menu button, split button, toggle button, loading/compound button if product design requires them.
- Required source docs to read before implementation: this document, `spec/behavior.md`, `spec/styling.md`, `spec/layout.md`, `spec/testing.md`.
- Implementation pitfalls: default `appearance` must map visually to `secondary`; disabled-focusable must suppress click handlers; `disabled` wins over disabled-focusable; icon-only detection must update on slot changes.

## Tests

### Unit / Contract Tests

| Requirement                                     | Setup                                        | Action                                  | Validation                                                                                              |
| ----------------------------------------------- | -------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Renders native button and label.                | Mount `<tyui-button>Click me</tyui-button>`. | Query shadow DOM.                       | Internal `<button type="button">` exists and default slot receives label text.                          |
| Disabled reaches native button.                 | Mount disabled button with click spy.        | Click internal button.                  | Internal button has `disabled`; click spy is not called.                                                |
| Native activation dispatches click.             | Mount enabled button with click spy.         | Exercise click, Enter, and Space paths. | Click spy is called for enabled activation.                                                             |
| Appearance defaults and aliases are mapped.     | Mount default and secondary variants.        | Inspect host and internal state.        | Host default is `default`; resolved internal appearance is `secondary`; secondary resolves identically. |
| All appearances reflect.                        | Mount each appearance.                       | Inspect host attribute.                 | Attribute matches requested value.                                                                      |
| Sizes reflect.                                  | Mount small, medium, large.                  | Inspect host and internal state.        | Host `size` reflects and internal size state matches.                                                   |
| Shapes reflect.                                 | Mount rounded, circular, square.             | Inspect host and internal state.        | Host `shape` reflects and internal shape state matches.                                                 |
| Icon slot order defaults before.                | Mount icon plus label.                       | Inspect slot DOM order.                 | Icon slot appears before default slot.                                                                  |
| `icon-position="after"` reorders icon.          | Mount icon plus label with after.            | Inspect slot DOM order.                 | Icon slot appears after default slot.                                                                   |
| Icon-only state is derived.                     | Mount icon-only and icon+label variants.     | Inspect internal derived state.         | Icon-only has private state; labelled button does not.                                                  |
| Disabled-focusable remains focusable and inert. | Mount with `disabled-focusable`.             | Focus and click internal button.        | Internal button has `aria-disabled="true"`, is focusable, and emits no click.                           |
| Disabled wins over disabled-focusable.          | Mount with both attributes.                  | Inspect internal button.                | Internal button is disabled and has no `aria-disabled`.                                                 |
| Focus styling is tokenized.                     | Inspect constructed stylesheet.              | Search focus rules.                     | `:focus-visible` includes outer outline and inner ring using public focus tokens.                       |

### Browser E2E Tests

| Requirement                            | Setup                                                   | Action                         | Validation                                             |
| -------------------------------------- | ------------------------------------------------------- | ------------------------------ | ------------------------------------------------------ |
| Native rendering is present.           | Open neutral story.                                     | Query internal control.        | Rendered tag is `button`.                              |
| Tab focus follows enabled state.       | Open enabled story.                                     | Press Tab.                     | Internal button receives shadow focus.                 |
| Disabled is skipped by Tab.            | Open disabled story.                                    | Press Tab.                     | No disabled button receives focus.                     |
| Disabled-focusable receives Tab focus. | Open disabled-focusable story.                          | Press Tab.                     | Internal button receives focus.                        |
| Click behavior follows state.          | Open enabled, disabled, and disabled-focusable stories. | Click host or internal button. | Enabled fires; disabled and disabled-focusable do not. |

### Accessibility Tests

| Requirement                                | Setup                                               | Action                      | Validation                                  |
| ------------------------------------------ | --------------------------------------------------- | --------------------------- | ------------------------------------------- |
| Text button has accessible name.           | Mount visible label.                                | Inspect accessibility tree. | Role button with expected name.             |
| Icon-only requires name.                   | Mount icon-only without ARIA in validation fixture. | Run accessibility check.    | Fails or reports missing accessible name.   |
| Disabled-focusable exposes disabled state. | Mount disabled-focusable.                           | Inspect accessibility tree. | Button is focusable and announced disabled. |
| Interactive descendants are invalid.       | Mount nested link anti-example.                     | Run validation.             | Validator rejects interactive descendant.   |

### Visual And Contrast Tests

| Requirement                           | Setup                                 | Action                                                                            | Validation                                                        |
| ------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Appearance matrix renders.            | Render all appearances in light/dark. | Capture visual snapshots.                                                         | Rest, hover-capable styling, and disabled states match baselines. |
| Size and shape matrices render.       | Render all sizes and shapes.          | Capture visual snapshots.                                                         | Geometry and icon alignment match expected matrix.                |
| Text contrast meets AA.               | Load light and dark token themes.     | Compare foreground/background tokens for default, hover, pressed, primary states. | Text contrast is at least 4.5:1.                                  |
| Focus contrast meets AA non-text.     | Load light and dark token themes.     | Compare focus rings against backgrounds.                                          | Focus strokes are at least 3:1.                                   |
| Forced-colors mode is usable.         | Emulate forced colors.                | Render enabled, disabled, focus states.                                           | Uses system colors and visible focus.                             |
| Reduced motion collapses transitions. | Emulate reduced motion.               | Inspect computed transition duration.                                             | Feedback transitions are 0ms or token-collapsed.                  |

### Generated Design / AI Contract Tests

| Requirement                                 | Setup                              | Action                          | Validation                                                                             |
| ------------------------------------------- | ---------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| Manifest sync.                              | Generate `custom-elements.json`.   | Compare docs.                   | Attributes, properties, slots, parts, and tokens in this doc exist in manifest/source. |
| Design metadata sync.                       | Validate `.design.json`.           | Compare roles and alternatives. | Intent and misuse alternatives are present.                                            |
| Generated app CSS uses public surface only. | Generate `component-variants.css`. | Lint selectors.                 | Uses host attrs, public `--ty-button-*`, or documented parts only.                     |
| Examples compile.                           | Run TSX example smoke tests.       | Compile Solid JSX.              | Valid examples pass; invalid examples fail validation.                                 |

### Coverage Checklist

- Core behavior: native activation and disabled-focusable suppression.
- DOM contract: stable internal button, slots, parts.
- Public API reflection: appearance, size, shape, icon-position, disabled, disabled-focusable.
- Events: click propagation and suppression.
- Slots: default and icon.
- Parts and forwarded parts: control, label; no forwarded parts.
- Styling tokens: `--ty-button-*`.
- Private styling boundary: `--_ty-button-*`, internal data attributes.
- Accessibility: role/name/disabled states.
- Keyboard: Enter/Space.
- Focus: focus-visible, disabled tab behavior.
- Pointer: hover visual only, click activation.
- Form behavior: type submit/reset/button.
- Popup / overlay behavior: N/A.
- Motion and reduced motion: feedback transitions.
- Forced colors: system-color mapping.
- Contrast: text and focus.
- Cleanup: slotchange only.
- Solid typing: intrinsic element and event typing.
- Example smoke coverage: valid and invalid examples.
- Manifest/doc sync: required.
- Design metadata sync: required.

## checkbox

# Checkbox Component Contract

## Identity

- Component name: Checkbox
- Tag name: `tyui-checkbox`
- Package entry point: `@tyui/elements/checkbox`
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
- Product-level variant preferences: generated themes may tune box, mark, color, spacing, and focus tokens.
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

| Name    | Description                     |
| ------- | ------------------------------- |
| `root`  | Internal label wrapper.         |
| `box`   | Decorative checkbox square.     |
| `mark`  | Decorative check or mixed mark. |
| `label` | Label content wrapper.          |

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
- Decorative box and mark are `aria-hidden`.
- Preserve consumer ARIA on the host unless a field wrapper supplies explicit relationships in the future.
- Forced-colors mode must use system colors for box, mark, disabled, and focus.

## Tests

| Requirement                          | Setup                                         | Action                               | Validation                                                          |
| ------------------------------------ | --------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| Native checkbox exists.              | Mount `<tyui-checkbox>Label</tyui-checkbox>`. | Query shadow DOM.                    | `input[type='checkbox']` exists; host is tabbable.                  |
| Click toggles.                       | Mount enabled checkbox with change spy.       | Call host `.click()`.                | `checked=true`; one composed bubbling `change` fires.               |
| Space toggles.                       | Focus checkbox.                               | Dispatch Space keydown.              | State toggles and `change` fires.                                   |
| Indeterminate clears on user toggle. | Mount `indeterminate`.                        | Click host.                          | `indeterminate=false`; `checked=true`.                              |
| Disabled blocks interaction.         | Mount `disabled`.                             | Click host.                          | State does not change; input disabled; host `tabIndex=-1`.          |
| Form submission.                     | Put named checked checkbox in a form.         | Construct `FormData`.                | Submitted value is `on` by default.                                 |
| Required validity.                   | Mount required unchecked then checked.        | Call `checkValidity()`.              | Unchecked is invalid; checked is valid.                             |
| Styling hooks exist.                 | Mount states.                                 | Inspect shadow parts and host attrs. | `root`, `box`, `mark`, `label` parts exist and state attrs reflect. |

## input

---

component: tyui-input
status: draft
manifest: ../../custom-elements.json
source: ../../libs/elements/src/input/input.ts
designMetadata: ../../libs/elements/src/input/input.design.json
references:

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

## radio-group

# RadioGroup Component Contract

## Identity

- Component name: RadioGroup
- Tag name: `tyui-radio-group`
- Package entry point: `@tyui/elements/radio-group`
- Status: planned / implementation-ready
- Source file: `libs/elements/src/radio-group/tyui-radio-group.ts`
- Component family: form controls
- Pattern type: composite form-associated widget
- Closest native element or ARIA pattern: ARIA `radiogroup` with native radio children
- Fluent / reference analogue: Fluent UI v9 RadioGroup and `ds-radio-group`
- Related components: `tyui-radio`

## Intent

RadioGroup lets the user select exactly one option from a small set. It owns shared value, selection synchronization, roving tabindex, keyboard navigation, required state, disabled state, and form submission for child `tyui-radio` items.

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

## radio

# Radio Component Contract

## Identity

- Component name: Radio
- Tag name: `tyui-radio`
- Package entry point: `@tyui/elements/radio`
- Status: planned / implementation-ready
- Source file: `libs/elements/src/radio/tyui-radio.ts`
- Component family: form controls
- Pattern type: composite child item
- Closest native element or ARIA pattern: `<input type="radio">` inside a radio group
- Fluent / reference analogue: Fluent UI v9 Radio and `ds-radio`
- Related components: `tyui-radio-group`

## Intent

Radio represents one option in a mutually exclusive set. It renders native radio semantics but delegates coordinated selection, roving tabindex, group value, and form association to `tyui-radio-group`.

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

## Skill: button

---

name: button
description: Use and integrate the tyui-button custom element correctly, including registration, intent, states, events, and anti-patterns.
license: Apache-2.0
metadata:
type: library
library: '@tyui/elements'
library_version: '0.0.0'
source: src/button/tyui-button.ts
manifest: ../../custom-elements.json

---

# tyui-button

## Intent

Use `tyui-button` to trigger an immediate in-page action. Use a link for navigation.

## API Source

Authoritative API facts live in `@tyui/elements/custom-elements.json`. Do not copy
attribute or event types from memory.

## Registration

```ts
import { defineTyuiButton } from '@tyui/define/button';

defineTyuiButton();
```

## Correct Usage

```html
<tyui-button appearance="primary">Save</tyui-button>
```

## Selection Guidance

- Use one primary button for the dominant local action.
- Use default or secondary styling for ordinary commands.
- Use subtle or transparent styling for dense toolbars and repeated row actions.
- Icon-only buttons must have an accessible name.

## Anti-Patterns

- Do not use button activation for navigation.
- Do not place focusable controls inside the button label.
- Do not restyle private shadow DOM; use public tokens, attributes, and parts.

## Skill: checkbox

---

name: checkbox
description: Use and integrate the tyui-checkbox custom element for independent boolean choices and avoid radio or command-button misuse.
license: Apache-2.0
metadata:
type: library
library: '@tyui/elements'
library_version: '0.0.0'
source: src/checkbox/tyui-checkbox.ts
manifest: ../../custom-elements.json

---

# tyui-checkbox

## Intent

Use `tyui-checkbox` for an independent yes/no or on/off choice.

## API Source

Authoritative API facts live in `@tyui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-checkbox name="notifications" value="enabled">Email notifications</tyui-checkbox>
```

## Selection Guidance

- Use checkbox for independent choices.
- Use radio group when exactly one option must be chosen from a set.
- Use a switch component, when available, for immediate setting toggles.

## Anti-Patterns

- Do not use checkbox as a command button.
- Do not use checkbox for mutually exclusive options.
- Do not hide the label without providing an accessible name.

## Skill: input

---

name: input
description: Use and integrate the tyui-input custom element for accessible single-line text entry without confusing base component features with design-system variants.
license: Apache-2.0
metadata:
type: library
library: '@tyui/elements'
library_version: '0.0.0'
source: src/input/tyui-input.ts
manifest: ../../custom-elements.json

---

# tyui-input

## Intent

Use `tyui-input` for short single-line text entry such as names, email addresses,
search terms, telephone numbers, URLs, passwords, and numeric text.

## API Source

Authoritative API facts live in `@tyui/elements/custom-elements.json`.

## Registration

```ts
import { defineTyuiInput } from '@tyui/define/input';

defineTyuiInput();
```

## Correct Usage

```html
<label for="email">Email</label>
<tyui-input id="email" name="email" type="email" required></tyui-input>
```

## Design-System Variants

The base component owns neutral appearances only. Product or design-system
layers may add visual variants through public tokens, host classes, and
documented parts. For example, Fluent's focused underline is a Fluent design
layer feature, not a base `appearance` value.

## Anti-Patterns

- Do not rely on placeholder as the only label.
- Do not put buttons, links, or other focusable controls in content slots.
- Do not invent unsupported input appearances; use design-layer classes for
  product-specific visuals.

## Skill: radio

---

name: radio
description: Use tyui-radio only as a radio option coordinated by tyui-radio-group, with native input focus and group-owned selection.
license: Apache-2.0
metadata:
type: library
library: '@tyui/elements'
library_version: '0.0.0'
source: src/radio/tyui-radio.ts
manifest: ../../custom-elements.json

---

# tyui-radio

## Intent

Use `tyui-radio` to represent one option inside `tyui-radio-group`.

## API Source

Authoritative API facts live in `@tyui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-radio-group label="Plan" name="plan" value="team">
  <tyui-radio value="personal">Personal</tyui-radio>
  <tyui-radio value="team">Team</tyui-radio>
</tyui-radio-group>
```

## Focus And Keyboard

`tyui-radio-group` owns value and roving tabindex. The active radio mirrors its
tab stop to the native shadow input so real browser `Tab` enters the group and
arrow keys move focus and selection.

## Anti-Patterns

- Do not use standalone radio buttons for unrelated boolean choices.
- Do not manage checked state independently when inside a group.
- Do not replace native radio keyboard behavior with app-level key handlers.

## Skill: radio-group

---

name: radio-group
description: Use and integrate tyui-radio-group for mutually exclusive choices, including value ownership, keyboard behavior, and form participation.
license: Apache-2.0
metadata:
type: library
library: '@tyui/elements'
library_version: '0.0.0'
source: src/radio-group/tyui-radio-group.ts
manifest: ../../custom-elements.json

---

# tyui-radio-group

## Intent

Use `tyui-radio-group` when the user must choose exactly one option from a small
set.

## API Source

Authoritative API facts live in `@tyui/elements/custom-elements.json`.

## Correct Usage

```html
<tyui-radio-group label="Notification frequency" name="frequency" required>
  <tyui-radio value="daily">Daily</tyui-radio>
  <tyui-radio value="weekly">Weekly</tyui-radio>
  <tyui-radio value="never">Never</tyui-radio>
</tyui-radio-group>
```

## Keyboard Contract

- `Tab` enters the checked enabled radio, or the first enabled radio.
- Arrow keys move focus and selection, wrapping and skipping disabled radios.
- `Space` selects the focused radio.

## Anti-Patterns

- Do not place non-radio interactive elements in the default slot.
- Do not use radio group for multi-select choices.
- Do not create custom roving tabindex outside the group.

## Skill: setup

---

name: setup
description: Set up TYUI custom elements for Solid, including registration, JSX typing, wrappers, and typed custom events.
license: Apache-2.0
requires: ['@tyui/elements#button', '@tyui/elements#input']
metadata:
type: framework
library: '@tyui/solid'
library_version: '0.0.0'
framework: solid
source: src/index.ts

---

# TYUI Solid setup

## Intent

Use `@tyui/solid` when a Solid app wants typed JSX ergonomics for TYUI custom
elements. The implementation remains in `@tyui/elements`.

## Registration

Register only the elements you use:

```ts
import { defineTyuiButton } from '@tyui/define/button';

defineTyuiButton();
```

Use `defineTyuiElements()` only for demos or apps where eager registration of
all elements is acceptable.

## JSX Usage

```tsx
<tyui-button appearance="primary" on:click={save}>
  Save
</tyui-button>
```

Thin wrappers may improve prop names or event typing, but they must not fork
behavior from the underlying custom element.

## Anti-Patterns

- Do not reimplement TYUI behavior in Solid wrappers.
- Do not use Solid signals inside `@tyui/elements`.
- Do not register all elements in a library module that should tree-shake.
