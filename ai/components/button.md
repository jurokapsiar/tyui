# Button — Implementation Spec

> Source-of-truth order: **`spec/behavior.md` (highest)** -> `requirements.md` -> `styles.md` -> `layout.md` -> `agentic-ui-design.md`. Fluent UI v9 defines the API shape; Oat defines the native-first, minimal-JS implementation philosophy.

## Identity

- Tag: `tyui-button`
- Define: `@tyui/define/button`
- Status: draft
- Native substrate: native `<button>` as the semantic core. If shadow DOM is used, the host must expose native-equivalent button behavior and delegate activation/state to the internal button.
- Shadow DOM: allowed only when it does not hide button semantics from consumers, trigger wrappers, forms, or accessibility APIs.
- Category: action control
- Component family: native-like control
- Pattern type: APG Button
- Fluent / reference analogue: Fluent UI React v9 `Button`.

## Intent

Use for explicit user actions: submit, save, open, close, toggle, or invoke another component. Button is also the canonical trigger surface for `tyui-dialog`, `tyui-menu`, `tyui-popover`, and `tyui-tooltip`.

Do not use for navigation with a URL (`tyui-link`), selectable data options (`tyui-select` / listbox-like controls), or status-only decoration (`tyui-badge`).

## Selection Guidance

- Use when: the user performs one explicit command or opens one explicitly associated surface.
- Do not use when: the target is navigation, passive status, a menu item with nested controls, or an overloaded target that combines command + navigation + selection.
- Prefer instead: `tyui-link` for URL navigation, `tyui-menu-item-link` inside menus, `tyui-card` actions for card-local commands, native form controls for input.
- Product-level variant preferences: prefer the smallest visual variant that still preserves the target-size token and visible focus.
- One semantic target / one action rule: one button activation emits one command or toggles one owned state/surface.

## Composition Contract

- Allowed children: phrasing text, icons, loading indicator, and visually hidden text. No nested interactive descendants.
- Required parent: none; may be wrapped by `tyui-dialog-trigger`, `tyui-menu-trigger`, or slotted into `tyui-popover` / `tyui-tooltip`.
- Required child components: none.
- Optional child components: icon component, spinner/progress indicator when loading.
- Allowed slots:
  - default: visible label.
  - `icon`: leading/trailing icon.
- Disallowed nested interactive content: links, inputs, other buttons, menu items, or focusable custom elements.
- Composition anti-patterns: `<tyui-button><a href="/details">Details</a></tyui-button>`.
- Trigger compatibility requirement: when used as an overlay trigger, the `tyui-button` host must be the focusable/control surface or must expose a documented trigger adapter that forwards focus, activation, disabled state, accessible name, and ARIA state to the real native button.

## API

### Attributes

| Name                 | Type                                                       | Reflects | Default     | Notes                                                                                 |
| -------------------- | ---------------------------------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------- |
| `appearance`         | `primary \| secondary \| subtle \| transparent \| outline` | yes      | `secondary` | styling only                                                                          |
| `size`               | `small \| medium \| large`                                 | yes      | `medium`    | target and typography tokens                                                          |
| `shape`              | `rounded \| circular \| square`                            | yes      | `rounded`   | styling only                                                                          |
| `disabled`           | `boolean`                                                  | yes      | `false`     | maps to native disabled when host is not focusable                                    |
| `disabled-focusable` | `boolean`                                                  | yes      | `false`     | maps to `aria-disabled="true"` and remains focusable only for documented parity cases |
| `type`               | `button \| submit \| reset`                                | yes      | `button`    | forwarded to native button/form behavior                                              |
| `pressed`            | `boolean \| mixed`                                         | yes      | `undefined` | toggle button mode; exposes `aria-pressed`                                            |
| `loading`            | `boolean`                                                  | yes      | `false`     | inert while pending; exposes busy/loading affordance                                  |
| `icon-position`      | `before \| after`                                          | yes      | `before`    | CSS ordering only                                                                     |

### Properties

Mirror the attributes with typed properties. `pressed` may be `true`, `false`, `"mixed"`, or `undefined`.

### Events

- `activate` — composed; dispatched only for user activation after native click/keyboard activation succeeds. Includes `{ source: "click" | "keyboard" | "form" }` when the source is known.
- Native `click` must retain normal timing and cancelability. Do not replace it with a custom-only event.

### Event Semantics

- User-initiated events: native `click` plus `activate` when activation is not canceled and button is not disabled/aria-disabled.
- Programmatic state changes that must not emit user events: setting `pressed`, `disabled`, `loading`, or trigger ARIA programmatically.
- Native events that are re-dispatched: do not re-dispatch native `click`; let native event propagation work from the host or internal button adapter.
- Internal coordination events: trigger wrappers may listen to native-equivalent activation/focus and should not require private button internals.
- Cancellation behavior: if a consumer cancels the native activation path, `activate` and trigger open should not fire.

### Slots

| Name    | Description                   | Fallback | Slotted Styling Rules                     |
| ------- | ----------------------------- | -------- | ----------------------------------------- |
| default | visible button label          | none     | phrasing content only                     |
| `icon`  | decorative or meaningful icon | none     | icon is decorative when label text exists |

### CSS Parts

| Name      | Description                                  | Allowed Use                             | Required State Qualifiers                             |
| --------- | -------------------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| `button`  | internal native button if shadow DOM is used | spacing, layout, focus ring integration | must mirror disabled, pressed, loading, focus-visible |
| `icon`    | icon wrapper                                 | size and alignment                      | decorative unless icon-only                           |
| `spinner` | loading indicator                            | loading affordance                      | hidden when not loading                               |

### CSS Custom Properties

`--ty-button-background`, `--ty-button-foreground`, `--ty-button-border-color`, `--ty-button-radius`, `--ty-button-padding-inline`, `--ty-button-min-block-size`, `--ty-button-gap`, `--ty-button-focus-ring`.

### Styling State Surface

| State    | Surface                                                    | Public | Notes                                                                        |
| -------- | ---------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| Disabled | `disabled` or `aria-disabled` on host/native button        | Yes    | native disabled removes from tab order; disabled-focusable remains focusable |
| Pressed  | `pressed` host attribute + `aria-pressed`                  | Yes    | toggle mode only                                                             |
| Loading  | `loading` host attribute + busy/inert styling              | Yes    | activation suppressed while loading                                          |
| Focus    | `:focus-visible` on host or forwarded from internal button | Yes    | must work when used as trigger                                               |

## Behavior

### State Model

- Controlled state: `disabled`, `disabled-focusable`, `pressed`, `loading`, `appearance`, `size`, `shape`, and `type`.
- Uncontrolled / default state: default type is `button`; no implicit toggle unless `pressed` is supplied.
- Derived internal state: `aria-pressed`, `aria-disabled`, loading spinner visibility, and trigger ARIA forwarded by owning components.
- Parent-owned state: overlay open state remains owned by `tyui-dialog`, `tyui-menu`, or `tyui-popover`; button only invokes it.
- Child-owned state: slotted icon/text has no behavior.
- Programmatic update behavior: update DOM/ARIA without firing `click` or `activate`.
- User update behavior: native activation emits click and then `activate` if not canceled.
- State reset behavior: native form reset applies only when button participates in a form context.

### State Transition Matrix

| Current State      | User / Programmatic Action | Next State                                             | Event                           | Focus Result                                            | Notes                                 |
| ------------------ | -------------------------- | ------------------------------------------------------ | ------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| Enabled            | Click / Enter / Space      | Activated                                              | native `click`, then `activate` | Focus remains on button unless invoked surface moves it | APG Button behavior.                  |
| Toggle enabled     | Click / Enter / Space      | `pressed` toggles when uncontrolled toggle mode exists | native `click`, `activate`      | Focus remains on button                                 | Reflect `aria-pressed`.               |
| Disabled           | Click / keyboard           | unchanged                                              | none                            | not focusable                                           | Native disabled behavior.             |
| Disabled-focusable | Click / keyboard           | unchanged                                              | none                            | remains focusable                                       | `aria-disabled="true"` parity case.   |
| Loading            | Click / keyboard           | unchanged                                              | none                            | focus remains if already focused                        | Loading suppresses duplicate actions. |

### Native Behavior First

- Native element used: internal or host-level native `<button>`.
- Native behavior preserved: Enter/Space activation, click event timing, focus behavior, disabled behavior, form `type`, and accessible name computation.
- Custom behavior added: design-system styling, optional pressed/loading state, composed `activate`, and trigger adapter surface for overlays.
- Why custom behavior is necessary: styling/API parity and cross-shadow trigger compatibility that plain `<button>` cannot guarantee when wrapped in a custom element.

### Focus Model

- Focus owner: the button host must be focusable, or focus must delegate to the internal native button in a way that trigger wrappers can observe.
- `delegatesFocus`: allowed only if focus-visible styling and trigger focus checks still work from the host.
- Tabbable elements: exactly one focusable target.
- Roving tabindex: N/A.
- Active descendant: N/A.
- Focus restoration: owning overlay restores focus to the button host or documented internal focus proxy.
- Focus trap: N/A.
- Focus-visible treatment: keyboard focus must be visible on the public button surface.
- Pointer focus treatment: native pointer focus behavior only; do not move focus on hover.

### Keyboard Contract

| Key             | Context                | Action                                 | Prevent Default | Event           | Notes                                        |
| --------------- | ---------------------- | -------------------------------------- | --------------- | --------------- | -------------------------------------------- |
| Enter           | focused enabled button | Activate                               | native default  | click, activate | Must also invoke overlay trigger wrappers.   |
| Space           | focused enabled button | Press/activate on native button timing | native default  | click, activate | Preserve native button timing.               |
| Tab / Shift+Tab | sequential navigation  | Enter/leave button                     | no              | none            | Exactly one tab stop.                        |
| Escape          | focused button         | no button behavior                     | no              | none            | Owning overlay may handle Escape after open. |

### Pointer And Hit Target Contract

- Primary hit target: the button host/visual surface.
- Secondary hit targets: none inside the button.
- Hover behavior: style only.
- Pressed / active behavior: native active plus optional toggle `pressed`.
- Minimum target size: maintain design-system minimum target token.
- Touch / pen considerations: same activation as click; no hover-only behavior.
- Overloaded-target risks: reject nested links/buttons and mixed navigation/action semantics.

### Popup / Overlay Contract

- Opens on: only when an owning trigger wrapper or slotted trigger role listens to button activation.
- Closes on: owned by the overlay component.
- DOM focus while open: owned by the overlay component; the opener must remain restorable.
- Next Tab behavior: owned by the overlay component.
- Arrow-key entry behavior: owned by menu/toolbar/composite components.
- Outside click / pointerdown behavior: owned by the overlay component.
- Escape behavior: owned by the overlay component.
- Focus restoration on close: overlay restores focus to the `tyui-button` host or focus proxy.
- Behavior while enter / exit motion is running: button remains the stable invoker target; motion never changes activation semantics.

### Form Contract

- Form-associated: either use a real native button in light DOM or implement form association so `type=submit/reset/button` behaves like native.
- Submitted value: N/A unless a future `name`/`value` API is added.
- `FormData` behavior: native submit/reset behavior only.
- Validity states: N/A.
- `checkValidity()` / `reportValidity()`: N/A.
- Name propagation: N/A unless `name`/`value` are added.
- Required / readonly / disabled behavior: required/readonly N/A; disabled follows native disabled; disabled-focusable uses `aria-disabled`.

### Lifecycle And Cleanup

- External event listeners: trigger adapters, form listeners, and native button listeners clean up on disconnect.
- Observers: N/A unless slot validation or form association requires them.
- Timers: N/A except loading debounce owned by app; component must not create hidden retry timers.
- Generated IDs: only for trigger/ARIA relationships when the owner does not supply ids; stable across renders.
- Slotchange work: validate no nested interactive descendants and update icon-only accessible-name requirements.
- Cleanup requirements: remove listeners/adapters; do not leak overlay trigger references.

### Current Behavior Commitments

- Button must be usable anywhere a native button is expected by TYUI trigger wrappers.
- Trigger wrappers must not need to pierce private shadow DOM to listen for activation or assign ARIA.
- The host must accept or reflect `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-describedby`, `aria-labelledby`, and `aria-pressed` without clobbering consumer-provided accessible names/descriptions.
- If native `popovertarget` / `commandfor` cannot be supported on the host, the button must expose a documented JS/event adapter used by overlay components.
- Disabled and loading buttons never open overlays or emit `activate`.

## Layout Contract

- Display: inline-flex control with intrinsic label width and tokenized minimum block size.
- Intrinsic size: content plus icon gap and padding tokens.
- Shrink policy: label may truncate only in documented constrained variants.
- Wrap policy: no wrap by default.
- Minimum target token: public target-size token.
- Minimum visual target: visual affordance may be smaller only if hit target remains intact.
- Flexible slots: default label.
- Fixed slots: icon, spinner.
- Parent owns: placement, margins, button groups.
- Component owns: internal alignment, gap, padding, focus ring, loading overlay.
- Container-query thresholds: N/A.
- Scroll / overflow policy: no internal scroll.
- Top-layer / popover policy: N/A; button invokes but does not own top layer.

### Regions / Slots

| Region / Slot | Flex | Min Inline Size | Wraps | Scrolls | Notes        |
| ------------- | ---- | --------------- | ----- | ------- | ------------ |
| default       | 1    | content         | no    | no      | label text   |
| icon          | 0    | icon token      | no    | no      | before/after |
| spinner       | 0    | spinner token   | no    | no      | loading only |

## Styling Contract

### Public Tokens

Use `--ty-button-*` tokens for background, foreground, border, radius, padding, gap, focus ring, icon size, and min block size. Variants remap tokens rather than duplicating rule blocks.

### Private Implementation Variables

Private variables use the `--_ty-*` prefix and are not consumer API.

### CSS Parts

`button`, `icon`, `spinner` when shadow DOM is used. If no shadow DOM is used, parts are N/A and host attributes/pseudo-classes are the public styling surface.

### Styling State Surface

| State                    | Surface                                | Public | Notes                           |
| ------------------------ | -------------------------------------- | ------ | ------------------------------- |
| appearance/size/shape    | host attributes                        | Yes    | styling only                    |
| disabled/loading/pressed | host attributes + ARIA/native state    | Yes    | semantic state                  |
| focus-visible            | host or internal part mirrored to host | Yes    | must be visible for trigger use |

- Forced-colors behavior: visible border/focus indicator and text/icon contrast.
- Reduced-motion behavior: loading/pressed transitions simplify without changing state.
- App-variant hooks: public tokens and documented parts only.

## Accessibility

- Role: native button role from `<button>` or host-equivalent semantics.
- Accessible name: visible text, `aria-label`, `aria-labelledby`, or tooltip `relationship="label"` for icon-only buttons.
- ARIA attributes: preserve consumer/trigger ARIA including `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-describedby`, `aria-labelledby`, `aria-pressed`, and `aria-disabled`.
- ARIA relationships: must work when the button is used as trigger for dialog/menu/popover/tooltip.
- Label / description source: slotted label text, ARIA, or tooltip relationship.
- Consumer ARIA preservation: trigger wrappers append/merge description tokens instead of replacing unrelated consumer ARIA.
- Shadow-boundary ARIA mirroring: if the internal button receives ARIA, the host must still expose the expected relationship or provide an explicit adapter.
- Decorative content: icon is hidden when text label exists.
- Disabled vs disabled-focusable behavior: native disabled removes from tab order; disabled-focusable uses `aria-disabled` and suppresses activation.
- Loading / status semantics: loading suppresses activation and may expose `aria-busy` if the button itself communicates pending state.
- Screen reader expectations: announces as button/toggle button; icon-only buttons have a non-empty name.
- High contrast expectations: state and focus remain visible without color-only cues.

### Reference Requirements

- **APG reference**: [APG Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
  - Direct requirements:
    - Button has role `button` through native semantics.
    - Enter and Space activate the button.
    - Toggle button exposes `aria-pressed`.
    - Accessible name is present and stable.
- **Fluent UI reference**: Fluent UI React v9 `Button`.
  - Direct requirements:
    - Supports appearance, size, shape, icon, icon position, disabled, disabled-focusable, and loading-like pending states.
    - Icon-only buttons require accessible labels.
    - Buttons can be used as trigger children when required props/ref/ARIA/event handlers are applied.
    - Disabled/loading buttons do not perform actions.

### Accessibility Guidance

- Do: use native button behavior, preserve one target/one action, and expose a stable public focus/ARIA surface.
- Do not: require overlay components to inspect private shadow DOM; do not hide the real focus target from tests or assistive tech.
- Author responsibilities: provide visible text or accessible name, choose the right component for navigation, and avoid nested interactive children.
- Known tradeoffs: native `popovertarget` and `commandfor` are real-button features; `tyui-button` must either make the host equivalent or provide an adapter.

## Motion Contract

- Motion tokens: press, hover, loading, and focus transitions only.
- CSS-only motion: preferred.
- Reduced-motion behavior: remove decorative transitions and spinner flourish while keeping loading semantics.
- Delayed unmount behavior: N/A.
- Interaction behavior during motion: activation state follows input, not animation progress.
- Motion can be disabled by: `prefers-reduced-motion` and theme motion tokens.

## Icons And Media

- Icon source: design-system icon component or slotted SVG.
- Icon accessible name policy: icon is decorative when visible label exists; icon-only button requires `aria-label`, `aria-labelledby`, or tooltip label relationship.
- Decorative icon policy: `aria-hidden="true"` when duplicate of text.
- Media slot behavior: icons only; no arbitrary media.
- Media cloning behavior: do not clone slotted icons.
- Image fallback behavior: N/A.

## Examples

### Storybook Examples

```html story title="Default"
<tyui-button>Save changes</tyui-button>
```

```html story title="Appearance Matrix"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button>default</tyui-button>
  <tyui-button appearance="primary">primary</tyui-button>
  <tyui-button appearance="outline">outline</tyui-button>
  <tyui-button appearance="subtle">subtle</tyui-button>
  <tyui-button appearance="transparent">transparent</tyui-button>
</div>
```

```html story title="Size Matrix"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button size="small">small</tyui-button>
  <tyui-button size="medium">medium</tyui-button>
  <tyui-button size="large">large</tyui-button>
</div>
```

```html story title="Shape Matrix"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button shape="rounded">rounded</tyui-button>
  <tyui-button shape="circular">circular</tyui-button>
  <tyui-button shape="square">square</tyui-button>
</div>
```

```html story title="With Icon"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button appearance="primary">
    <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
      <path
        fill="currentColor"
        d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      ></path>
    </svg>
    Search
  </tyui-button>
  <tyui-button icon-position="after">
    Next
    <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
      <path
        fill="currentColor"
        d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      ></path>
    </svg>
  </tyui-button>
  <tyui-button appearance="subtle" aria-label="Search">
    <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
      <path
        fill="currentColor"
        d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      ></path>
    </svg>
  </tyui-button>
</div>
```

```html story title="Disabled States"
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
  <tyui-button disabled>Disabled</tyui-button>
  <tyui-button disabled-focusable>Focusable disabled</tyui-button>
  <tyui-button appearance="primary" disabled>Primary disabled</tyui-button>
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
    style="box-sizing:border-box;width:min(100%,720px);padding:28px;display:grid;gap:20px;"
  >
    <div style="display:grid;gap:8px;">
      <div class="ty-metric-label">Atmospheric Glass</div>
      <div style="font-size:28px;font-weight:700;line-height:1.15;">Command surfaces</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      <tyui-button appearance="primary">Start session</tyui-button>
      <tyui-button appearance="subtle">Tune forecast</tyui-button>
      <tyui-button appearance="transparent">
        <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
          ></path>
        </svg>
        Explore
      </tyui-button>
    </div>
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
    style="box-sizing:border-box;width:min(100%,760px);padding:20px;display:grid;gap:18px;"
  >
    <div style="display:grid;gap:4px;">
      <div class="ty-fluent-title">Fluent Web commands</div>
      <div class="ty-fluent-caption">
        Neutral surfaces, compact spacing, and a single brand-blue primary action.
      </div>
    </div>
    <div class="ty-fluent-toolbar">
      <tyui-button appearance="primary">Save changes</tyui-button>
      <tyui-button>Preview</tyui-button>
      <tyui-button appearance="subtle">
        <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
          ></path>
        </svg>
        Find
      </tyui-button>
      <tyui-button appearance="transparent">Cancel</tyui-button>
    </div>
    <div class="ty-fluent-toolbar">
      <tyui-button size="small">Small</tyui-button>
      <tyui-button size="medium">Medium</tyui-button>
      <tyui-button size="large">Large</tyui-button>
      <tyui-button shape="circular" aria-label="Search">
        <svg slot="icon" viewBox="0 0 20 20" aria-hidden="true" style="width:1em;height:1em;">
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.15 3.15-1.06 1.06-3.15-3.15A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
          ></path>
        </svg>
      </tyui-button>
    </div>
  </section>
</div>
```

### Valid

```html
<tyui-popover>
  <tyui-button slot="trigger" aria-haspopup="dialog">Details</tyui-button>
  <div slot="surface">More information</div>
</tyui-popover>
```

### Invalid

```html
<tyui-button><a href="/details">Details</a></tyui-button>
```

## Agent Guidance

- **Selection guidance**: use `tyui-button` for commands and trigger invocation, not URL navigation.
- **Alternatives map**: `navigation -> tyui-link`, `menu item -> tyui-menu-item`, `status -> tyui-message-bar`, `selection -> tyui-select`.
- **Layout ownership**: button owns internal spacing and min target; parent owns grouping and placement.
- **Token usage**: theme through `--ty-button-*`, never literal colors.
- **Anti-patterns to reject**: missing accessible name, nested interactive content, onclick navigation, disabled button that still opens an overlay, custom trigger that fails ARIA/focus restoration.
- **Validation gates**: flag icon-only without name, nested interactive descendants, no host-level activation surface, missing trigger adapter support, disabled/loading trigger activation.

## Tests

### Unit / Contract Tests

| Requirement              | Setup                                                                                                     | Action                                            | Validation                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Native activation parity | Render enabled `tyui-button`.                                                                             | Press Enter, press Space, click.                  | Native `click` and `activate` fire once per user activation in native timing.                              |
| Disabled suppression     | Render `disabled` and `disabled-focusable` buttons.                                                       | Click and press Enter/Space.                      | No `click`, `activate`, or overlay open occurs; disabled-focusable remains focusable with `aria-disabled`. |
| Loading suppression      | Render `loading`.                                                                                         | Click and press Enter/Space.                      | No activation fires; loading state is exposed visually and semantically.                                   |
| Toggle semantics         | Render `pressed=false`.                                                                                   | Activate.                                         | `aria-pressed` and reflected pressed state update according to toggle contract.                            |
| ARIA passthrough         | Set `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-describedby`, and `aria-labelledby` on host. | Inspect host/internal control.                    | Relationships are preserved and exposed on the actual accessible button.                                   |
| Trigger adapter surface  | Wrap in each trigger component.                                                                           | Attach listeners/ARIA through public trigger API. | Trigger wrapper does not need private shadow DOM access.                                                   |

### Browser E2E Tests

| Requirement                 | Setup                                                       | Action                                                 | Validation                                                                                                        |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Popover trigger             | Render `tyui-popover` with `tyui-button slot="trigger"`.    | Tab to button, press Enter/Space, click, press Escape. | Popover opens/closes, `aria-expanded` syncs, and focus returns to the `tyui-button`.                              |
| Menu trigger                | Render `tyui-menu-trigger` containing `tyui-button`.        | Press Enter, Space, ArrowDown, Escape.                 | Menu opens, roving focus enters as documented, Escape returns focus to the button.                                |
| Dialog trigger              | Render `tyui-dialog` with `tyui-button slot="trigger"`.     | Press Enter/click, then close with Escape/action.      | Dialog opens via native-equivalent activation, traps focus, and restores focus to `tyui-button`.                  |
| Tooltip trigger             | Render `tyui-tooltip` wrapping `tyui-button`.               | Focus, hover, press Escape.                            | Tooltip shows/hides, relationship ARIA is applied to the accessible button, and focus never moves to the tooltip. |
| Disabled trigger end-to-end | Render disabled/loading `tyui-button` in each trigger role. | Click and press Enter/Space.                           | No dialog/menu/popover/tooltip activation occurs, and no stale `aria-expanded` remains true.                      |

### Accessibility Tests

| Requirement                        | Setup                                                         | Action                                         | Validation                                                                                              |
| ---------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| APG: Button name and role          | Render text, icon-only, and labelled buttons.                 | Inspect accessibility tree.                    | Each exposes role button and a non-empty name when required.                                            |
| APG: Keyboard activation           | Focus enabled button.                                         | Press Enter and Space.                         | Activation matches native/APG button behavior.                                                          |
| APG: Toggle button                 | Render pressed button.                                        | Activate.                                      | `aria-pressed` reflects true/false/mixed contract.                                                      |
| Fluent UI: Icon-only label         | Render icon-only button without accessible label.             | Run validation.                                | Validation fails until `aria-label`, `aria-labelledby`, or tooltip label relationship is present.       |
| Fluent UI: Custom trigger contract | Use `tyui-button` as trigger for Popover/Menu/Dialog/Tooltip. | Run accessibility checks after open and close. | Trigger ARIA, accessible name/description, focus restoration, and disabled behavior all remain correct. |

### Visual And Contrast Tests

| Requirement                    | Setup                                                     | Action                               | Validation                                                         |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| Focus/hover/active distinction | Render all appearances in normal and forced-colors modes. | Hover, focus via keyboard, press.    | Focus is visible and distinct from hover/active/pressed.           |
| Tokenized variants             | Render sizes, shapes, icon positions, loading, pressed.   | Inspect computed styles.             | Public tokens drive variants; no literal colors required.          |
| Reduced motion                 | Enable `prefers-reduced-motion`.                          | Trigger loading/pressed transitions. | Motion is removed or simplified without changing activation state. |

### Generated Design / AI Contract Tests

| Requirement                     | Setup                                                    | Action                    | Validation                                                                            |
| ------------------------------- | -------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| Valid trigger generation        | Ask generator for a popover/menu/dialog/tooltip trigger. | Inspect generated markup. | Uses `tyui-button` or native `<button>` with the documented trigger adapter and ARIA. |
| Navigation anti-pattern         | Ask for a button that opens `/details`.                  | Run design validation.    | Validation rejects and suggests `tyui-link`.                                          |
| Nested interactive anti-pattern | Ask for link/input inside button.                        | Run design validation.    | Validation rejects nested interactive content.                                        |

### Coverage Checklist

| Area        | Required coverage                                                                     |
| ----------- | ------------------------------------------------------------------------------------- |
| behavior.md | Focus moves only on explicit action; button has exactly one tab stop.                 |
| behavior.md | One target = one action; no nested interactive descendants.                           |
| behavior.md | Native button semantics first; custom trigger adapter only preserves native behavior. |
| behavior.md | User activation emits public events; programmatic state changes are silent.           |
| behavior.md | Disabled/loading suppress activation; disabled-focusable is explicit.                 |
| behavior.md | Motion decorates state and never decides activation.                                  |
