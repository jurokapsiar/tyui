# Button

`tyui-button` is the first architecture proof point for the component library.

## Imports

```ts
import { defineTyuiButton } from '@toyu-ui/define/button';

defineTyuiButton();
```

Solid consumers can use the thin wrapper:

```tsx
import { Button } from '@toyu-ui/solid';
```

## Attributes And Properties

| Name       | Type      | Description            |
| ---------- | --------- | ---------------------- |
| `disabled` | `boolean` | Disables activation.   |
| `pressed`  | `boolean` | Reflects toggle state. |

## Events

| Name       | Detail                | Description                        |
| ---------- | --------------------- | ---------------------------------- |
| `activate` | `{ pressed, source }` | Fires after successful activation. |

The event bubbles and is composed so app-level listeners can receive it across the shadow boundary.

## Slots And Parts

- Default slot: button content.
- `::part(button)`: internal button control.
