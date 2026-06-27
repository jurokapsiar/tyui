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
