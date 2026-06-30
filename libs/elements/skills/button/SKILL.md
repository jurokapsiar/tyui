---
name: button
description: Use and integrate the tyui-button custom element correctly, including registration, intent, states, events, and anti-patterns.
license: Apache-2.0
metadata:
  type: library
  library: '@toyu-ui/elements'
  library_version: '0.1.0'
  source: src/button/tyui-button.ts
  manifest: ../../custom-elements.json
---

# tyui-button

## Intent

Use `tyui-button` to trigger an immediate in-page action. Use a link for navigation.

## API Source

Authoritative API facts live in `@toyu-ui/elements/custom-elements.json`. Do not copy
attribute or event types from memory.

## Registration

```ts
import { defineTyuiButton } from '@toyu-ui/define/button';

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
