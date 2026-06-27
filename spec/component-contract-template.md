# Component Contract Template

Use this template before implementing each substantial component. The completed document lives under `ai/components/<component>.md` and is the single source of truth for human guidance, agent guidance, layout/styling contracts, examples, anti-examples, and test expectations.

## Identity

- Component name:
- Tag name:
- Package entry point:
- Status:
- Source file:
- Manifest reference:
- Design metadata file:
- Component family:
- Pattern type:
- Closest native element or ARIA pattern:
- Fluent / reference analogue:
- Related components:

## Intent

Describe the user-facing job of the component and when it should not be used.

## Selection Guidance

- Use when:
- Do not use when:
- Prefer instead:
- Product-level variant preferences:
- One semantic target / one action rule:

## Composition Contract

- Allowed children:
- Required parent:
- Required child components:
- Optional child components:
- Allowed slots:
- Disallowed nested interactive content:
- Composition anti-patterns:

Use this section to prevent ambiguous component combinations. Examples: an option belongs inside a listbox-like owner; a header and panel belong inside an accordion item; a dismiss action must be a separate target from a primary action.

## API

### Attributes

| Name | Type | Reflected Property | Default | Description |
| ---- | ---- | ------------------ | ------- | ----------- |
|      |      |                    |         |             |

### Properties

| Name | Type | Attribute | Default | Description |
| ---- | ---- | --------- | ------- | ----------- |
|      |      |           |         |             |

### Events

| Name | Detail Type | Bubbles | Composed | Description |
| ---- | ----------- | ------- | -------- | ----------- |
|      |             |         |          |             |

### Event Semantics

- User-initiated events:
- Programmatic state changes that must not emit user events:
- Native events that are re-dispatched:
- Internal coordination events:
- Cancellation behavior:

### Slots

| Name    | Description | Fallback | Slotted Styling Rules |
| ------- | ----------- | -------- | --------------------- |
| default |             |          |                       |

### CSS Parts

| Name | Description | Allowed Use | Required State Qualifiers |
| ---- | ----------- | ----------- | ------------------------- |
|      |             |             |                           |

### Forwarded CSS Parts

| Name | Source Component | Description |
| ---- | ---------------- | ----------- |
|      |                  |             |

### CSS Custom Properties

#### Public Tokens

| Name | Default | Description |
| ---- | ------- | ----------- |
|      |         |             |

#### Private Implementation Variables

Private variables use the `--_ty-*` prefix. List them only so reviewers can distinguish implementation details from consumer hooks; consumers must not depend on them.

| Name | Purpose |
| ---- | ------- |
|      |         |

### Styling State Surface

| State | Surface                                        | Public   | Notes |
| ----- | ---------------------------------------------- | -------- | ----- |
|       | Host attribute / pseudo-class / ARIA / data-\* | Yes / No |       |

## Behavior

### State Model

- Controlled state:
- Uncontrolled / default state:
- Derived internal state:
- Parent-owned state:
- Child-owned state:
- Programmatic update behavior:
- User update behavior:
- State reset behavior:

### State Transition Matrix

| Current State | User / Programmatic Action | Next State | Event | Focus Result | Notes |
| ------------- | -------------------------- | ---------- | ----- | ------------ | ----- |
|               |                            |            |       |              |       |

### Native Behavior First

- Native element used:
- Native behavior preserved:
- Custom behavior added:
- Why custom behavior is necessary:

### Focus Model

- Focus owner:
- `delegatesFocus`:
- Tabbable elements:
- Roving tabindex:
- Active descendant:
- Focus restoration:
- Focus trap:
- Focus-visible treatment:
- Pointer focus treatment:

### Keyboard Contract

| Key | Context | Action | Prevent Default | Event | Notes |
| --- | ------- | ------ | --------------- | ----- | ----- |
|     |         |        |                 |       |       |

### Pointer And Hit Target Contract

- Primary hit target:
- Secondary hit targets:
- Hover behavior:
- Pressed / active behavior:
- Minimum target size:
- Touch / pen considerations:
- Overloaded-target risks:

### Popup / Overlay Contract

- Opens on:
- Closes on:
- DOM focus while open:
- Next Tab behavior:
- Arrow-key entry behavior:
- Outside click / pointerdown behavior:
- Escape behavior:
- Focus restoration on close:
- Behavior while enter / exit motion is running:

### Form Contract

- Form-associated:
- Submitted value:
- `FormData` behavior:
- Validity states:
- `checkValidity()` / `reportValidity()`:
- Name propagation:
- Required / readonly / disabled behavior:

### Lifecycle And Cleanup

- External event listeners:
- Observers:
- Timers:
- Generated IDs:
- Slotchange work:
- Cleanup requirements:

## Layout Contract

- Display:
- Intrinsic size:
- Shrink policy:
- Wrap policy:
- Minimum target token:
- Minimum visual target:
- Flexible slots:
- Fixed slots:
- Parent owns:
- Component owns:
- Container-query thresholds:
- Scroll / overflow policy:
- Top-layer / popover policy:

### Regions / Slots

| Region / Slot | Flex | Min Inline Size | Wraps | Scrolls | Notes |
| ------------- | ---- | --------------- | ----- | ------- | ----- |
|               |      |                 |       |         |       |

## Styling Contract

- Semantic tokens:
- Component tokens:
- Private `--_ty-*` variables:
- Public parts:
- Forwarded parts:
- Slots and slotted-content rules:
- Allowed `::part()` use:
- Host class guidance:
- Inline style guidance:
- Forced-colors behavior:
- Reduced-motion behavior:
- App-variant hooks:

Consumer override order for this component:

1. Attributes and properties:
2. Host classes / app-local CSS:
3. Public CSS custom properties:
4. Documented `::part()` selectors:
5. Inline `style` for dynamic per-instance values:

## Accessibility

- Role:
- Accessible name:
- ARIA attributes:
- ARIA relationships:
- Label / description source:
- Consumer ARIA preservation:
- Shadow-boundary ARIA mirroring:
- Decorative content:
- Disabled vs disabled-focusable behavior:
- Loading / status semantics:
- Screen reader expectations:
- High contrast expectations:

### Accessibility Guidance

- Do:
- Do not:
- Author responsibilities:
- Known tradeoffs:

## Motion Contract

- Motion tokens:
- CSS-only motion:
- Reduced-motion behavior:
- Delayed unmount behavior:
- Interaction behavior during motion:
- Motion can be disabled by:

## Icons And Media

- Icon source:
- Icon accessible name policy:
- Decorative icon policy:
- Media slot behavior:
- Media cloning behavior:
- Image fallback behavior:

## Examples

### Valid Example

```tsx

```

### Invalid Example

Reason:

```tsx

```

### Edge Case Example

Reason:

```tsx

```

## Agent Guidance

- Preferred intent:
- Common misuse:
- Safe composition patterns:
- `design-app.md` notes:
- Library gaps to report:
- Required source docs to read before implementation:
- Implementation pitfalls:

## Tests

### Unit / Contract Tests

| Requirement | Setup | Action | Validation |
| ----------- | ----- | ------ | ---------- |
|             |       |        |            |

### Browser E2E Tests

Browser E2E tests run against direct Vite fixtures, not Storybook. Any component with keyboard, focus, form, popup, or pointer behavior must include at least one browser E2E row that starts from a realistic page state and uses trusted browser input such as `page.keyboard.press()` or `page.mouse.click()`.

For focus and keyboard behavior, rows must name the observable focus target, including shadow DOM focus when relevant. Do not accept "unit tests pass" as proof for `Tab`, `Shift+Tab`, arrow keys, Space, Enter, focus delegation, focus restoration, or native form control keyboard defaults.

| Requirement | Setup | Action | Validation |
| ----------- | ----- | ------ | ---------- |
|             |       |        |            |

### Accessibility Tests

| Requirement | Setup | Action | Validation |
| ----------- | ----- | ------ | ---------- |
|             |       |        |            |

### Visual And Contrast Tests

| Requirement | Setup | Action | Validation |
| ----------- | ----- | ------ | ---------- |
|             |       |        |            |

### Generated Design / AI Contract Tests

| Requirement | Setup | Action | Validation |
| ----------- | ----- | ------ | ---------- |
|             |       |        |            |

### Coverage Checklist

- Core behavior:
- DOM contract:
- Public API reflection:
- Events:
- Slots:
- Parts and forwarded parts:
- Styling tokens:
- Private styling boundary:
- Accessibility:
- Keyboard:
- Focus:
- Browser keyboard acceptance:
- Pointer:
- Form behavior:
- Popup / overlay behavior:
- Motion and reduced motion:
- Forced colors:
- Contrast:
- Cleanup:
- Solid typing:
- Example smoke coverage:
- Manifest/doc sync:
- Design metadata sync:
