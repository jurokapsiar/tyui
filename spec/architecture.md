# Component Library Architecture

## Premise

Compiling arbitrary Solid components into framework-free code is not a practical primary architecture.
Solid's compiler emits DOM operations plus calls into Solid's reactive runtime. Once a component uses signals, effects, context, control-flow components, or Solid lifecycle APIs, the generated component remains coupled to `solid-js`.

There are three viable architecture families to consider.

## Option 1: Restricted JSX Source To Multiple Targets

This is the cleanest solution when the goal is one component source that generates multiple framework-native outputs.

Define a framework-neutral JSX dialect, then compile it to:

- Vanilla Custom Elements.
- Lit.
- Solid.
- React wrappers.
- Potential Vue or Svelte wrappers.

This is essentially the Mitosis model. Mitosis uses a restricted JSX component format, parses it into an intermediate representation, and generates targets including React, Solid, Lit, Stencil, and raw Web Components.

### Example Neutral Source

```tsx
import { useMetadata, useStore } from '@acme/component-compiler';

useMetadata({
  customElement: 'acme-counter',
});

export default function Counter(props: { initial?: number }) {
  const state = useStore({
    count: props.initial ?? 0,
  });

  return (
    <button type="button" onClick={() => state.count++}>
      Count: {state.count}
    </button>
  );
}
```

### Pipeline

```text
neutral TSX
  -> parse
component IR / AST
  -> vanilla custom-element generator
  -> Lit generator
  -> Solid generator
  -> React generator
```

The key is that this source is not actually Solid source, even when it looks Solid-like.

### Benefits

- No Solid dependency in vanilla output.
- Native React components for React consumers.
- Native Solid components for Solid consumers.
- Target-specific optimizations.
- One source of truth.

### Costs

The language must be constrained:

- No arbitrary hooks.
- No arbitrary framework imports.
- No Solid context.
- No `<For>` or `<Show>` unless the compiler understands them.
- No runtime reflection magic.
- Event and lifecycle semantics must be normalized.

This is the strongest multi-target architecture, but it also requires the most compiler work. It does not match the requirement that component implementations should not use JSX.

## Option 2: Solid-Flavored JSX To Vanilla DOM And A Neutral Runtime

Another path is to build a Babel, SWC, or Vite transform that turns Solid-like components into Custom Elements plus a small framework-neutral runtime.

For example, this component:

```tsx
function Counter() {
  const [count, setCount] = createSignal(0);

  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
}
```

Could become something conceptually like:

```ts
class AcmeCounter extends HTMLElement {
  connectedCallback(): void {
    const button = document.createElement('button');
    const text = document.createTextNode('');

    let count = 0;

    const updateCount = (): void => {
      text.data = String(count);
    };

    button.addEventListener('click', () => {
      count++;
      updateCount();
    });

    button.append(text);
    this.append(button);

    updateCount();
  }
}
```

That can produce excellent output, but it is effectively a new framework/compiler.

The compiler would need transformations for:

- Signals.
- Memos.
- Effects and cleanup.
- Conditionals.
- Keyed lists.
- Spread props.
- Dynamic attributes and properties.
- Event delegation.
- Refs.
- Slots.
- Lifecycle.
- Server rendering and hydration, if needed.

Solid already performs much of this work, but its output assumes the Solid runtime. Replacing that runtime requires either recognizing all Solid primitives statically or defining restricted equivalents.

A practical version is to create owned primitives:

```ts
import { signal, memo, effect } from '@acme/reactivity';
```

Those primitives can then compile differently for every target. This approach should not accept general `solid-js` imports.

This option is powerful, but it conflicts with the requirement to avoid a custom JSX compiler unless it becomes genuinely necessary.

## Option 3: Solid Internals Behind Standard Web Components

This option is consumer-agnostic, though not implementation-agnostic.

```text
Solid implementation
  -> Custom Element API
  -> React / Vue / Angular / vanilla consumers
```

Consumers do not need to know the implementation framework. `solid-element` exists specifically to expose Solid implementations as interoperable custom elements.

The package can bundle Solid internally:

```text
acme-button.js
  -> generated component DOM code
  -> required Solid reactive helpers
  -> custom-element registration
```

The external contract is neutral:

```html
<acme-button disabled>Save</acme-button>
```

```ts
button.addEventListener('activate', handler);
```

This is often sufficient for a design system. In many contexts, "framework-agnostic" means consumers are not coupled to the implementation, not that the shipped implementation contains no framework runtime.

However, the requirements here explicitly prefer no Solid, React, Lit, JSX, or virtual DOM in the component implementation. That makes this a fallback option rather than the best fit.

## Recommended Direction

Use native Custom Elements internally, plus a thin Solid typing and optional wrapper package for consumption.

```text
Component library
  plain TypeScript + DOM APIs
  native Custom Elements
  no Solid, React, Lit, or JSX
      |
      v
Solid application
  imports/registers those elements
  consumes them naturally from Solid JSX
```

This keeps the library framework-independent. Only the consuming app uses Solid JSX, and Solid compiles only the application code.

## Recommended Nx/Vite Monorepo Structure

```text
package.json
nx.json
tsconfig.base.json
vitest.workspace.ts

libs/
  core/
    project.json
    vite.config.ts
    src/
      state machines
      accessibility behavior
      keyboard navigation
      DOM-independent component logic

  elements/
    project.json
    vite.config.ts
    src/
      native HTMLElement implementations
      shadow DOM structure
      attributes, properties, slots, events

  define/
    project.json
    vite.config.ts
    src/
      optional custom-element registration entry points

  solid/
    project.json
    vite.config.ts
    src/
      JSX intrinsic-element declarations
      typed event definitions
      optional property-binding helpers
      optional ergonomic wrappers

  testing/
    project.json
    vite.config.ts
    src/
      shared component contract tests
      accessibility helpers
      visual regression utilities

apps/
  solid/
    project.json
    vite.config.ts
    src/

  vanilla/
    project.json
    vite.config.ts
    src/
```

Nx owns workspace orchestration, dependency-aware task execution, caching, and project graph visibility. Vite owns package builds, app dev servers, and Vitest-powered tests. The Solid package should not reimplement components. It should only improve type safety and ergonomics for Solid consumers.

## Headless Core Pattern

Reusable behavior can be plain TypeScript:

```ts
export type ToggleState = {
  pressed: boolean;
  disabled: boolean;
};

export function createToggleController(options: {
  initialPressed?: boolean;
  disabled?: boolean;
  onChange?: (pressed: boolean) => void;
}) {
  let state: ToggleState = {
    pressed: options.initialPressed ?? false,
    disabled: options.disabled ?? false,
  };

  const subscribers = new Set<(state: ToggleState) => void>();

  const emit = (): void => {
    for (const subscriber of subscribers) {
      subscriber(state);
    }
  };

  return {
    getState(): ToggleState {
      return state;
    },

    press(): void {
      if (state.disabled) return;

      state = {
        ...state,
        pressed: !state.pressed,
      };

      options.onChange?.(state.pressed);
      emit();
    },

    subscribe(subscriber: (state: ToggleState) => void): () => void {
      subscribers.add(subscriber);
      subscriber(state);

      return () => subscribers.delete(subscriber);
    },
  };
}
```

This avoids duplicating the hard parts across renderers: accessibility behavior, state transitions, and keyboard logic can live in one framework-neutral layer.

## Native Web Component Pattern

The actual component implementation should use the browser platform directly:

```ts
export class AcmeButton extends HTMLElement {
  static observedAttributes = ['disabled'];

  readonly #button = document.createElement('button');

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });

    this.#button.type = 'button';

    const slot = document.createElement('slot');
    this.#button.append(slot);

    this.#button.addEventListener('click', () => {
      if (this.disabled) return;

      this.dispatchEvent(
        new CustomEvent('activate', {
          bubbles: true,
          composed: true,
        }),
      );
    });

    root.append(this.#button);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  attributeChangedCallback(): void {
    this.#button.disabled = this.disabled;
  }
}

export function defineAcmeButton(): void {
  if (!customElements.get('acme-button')) {
    customElements.define('acme-button', AcmeButton);
  }
}
```

There is no component runtime here, only the browser platform.

## Solid Consumption Pattern

The Solid app imports or registers the custom element, then consumes it from JSX:

```tsx
import { createSignal } from 'solid-js';
import { defineAcmeButton } from '@acme/components/button';

defineAcmeButton();

export function App() {
  const [saving, setSaving] = createSignal(false);

  return (
    <acme-button
      disabled={saving()}
      on:activate={() => {
        setSaving(true);
      }}
    >
      {saving() ? 'Saving...' : 'Save'}
    </acme-button>
  );
}
```

Solid compiles the application JSX. The component library remains plain JavaScript.

## Solid JSX Types

TypeScript will not automatically know custom-element properties and events. Add declarations in the Solid application or publish them from the component package:

```ts
// solid.d.ts
import type { JSX } from 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'acme-button': JSX.HTMLAttributes<HTMLElement> & {
        disabled?: boolean;
        children?: JSX.Element;
        'on:activate'?: (event: CustomEvent<void>) => void;
      };
    }
  }
}
```

For an event with data:

```ts
export type ActivateDetail = {
  source: 'keyboard' | 'pointer';
};

type ActivateEvent = CustomEvent<ActivateDetail>;
```

## Structured Properties

Attributes are fine for strings, numbers, booleans, and primitive configuration.

For objects, arrays, callbacks, or controllers, expose JavaScript properties:

```ts
export class AcmeList extends HTMLElement {
  #items: readonly ListItem[] = [];

  get items(): readonly ListItem[] {
    return this.#items;
  }

  set items(value: readonly ListItem[]) {
    if (Object.is(this.#items, value)) return;

    this.#items = value;
    this.#render();
  }

  #render(): void {
    // Update the DOM.
  }
}
```

Solid can assign the property from JSX:

```tsx
<acme-list items={items()} />
```

Depending on JSX/custom-element typing and compiler behavior, a ref gives fully explicit property assignment:

```tsx
let list!: AcmeList;

createEffect(() => {
  list.items = items();
});

return <acme-list ref={list} />;
```

## Fine-Grained Component Updates

Raw DOM components must design update granularity directly. Avoid implementing every property change as:

```ts
this.shadowRoot!.innerHTML = this.render();
```

That recreates DOM, event state, and potentially focus.

Instead, create stable nodes once and update only the nodes affected by each state change:

```ts
export class AcmeCounter extends HTMLElement {
  readonly #valueNode = document.createTextNode('0');
  readonly #button = document.createElement('button');

  #value = 0;

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });

    this.#button.append('Count: ', this.#valueNode);
    this.#button.addEventListener('click', this.#increment);

    root.append(this.#button);
  }

  get value(): number {
    return this.#value;
  }

  set value(next: number) {
    if (Object.is(next, this.#value)) return;

    this.#value = next;
    this.#valueNode.data = String(next);
  }

  #increment = (): void => {
    this.value++;

    this.dispatchEvent(
      new CustomEvent('valuechange', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };
}
```

This gives behavior comparable to compiled fine-grained bindings: each setter updates only its associated DOM node.

## Optional Solid Wrapper Pattern

A wrapper can improve API ergonomics while keeping implementation neutral:

```tsx
import type { JSX } from 'solid-js';
import '@acme/components/button/define';

type ButtonProps = {
  disabled?: boolean;
  onActivate?: () => void;
  children?: JSX.Element;
};

export function Button(props: ButtonProps) {
  return (
    <acme-button disabled={props.disabled} on:activate={props.onActivate}>
      {props.children}
    </acme-button>
  );
}
```

The app gets conventional JSX:

```tsx
<Button disabled={saving()} onActivate={save}>
  Save
</Button>
```

The wrapper compiles into the Solid application and should tree-shake normally. The underlying component remains framework-independent.

## Decision

The best fit for the current requirements is:

- Plain TypeScript for component behavior and state machines.
- Native Custom Elements as the primary distribution.
- Direct DOM updates with stable nodes rather than virtual DOM or `innerHTML` rerenders.
- Thin Solid JSX typings and optional wrappers for ergonomic consumption.
- No custom JSX compiler unless the component set later proves that native DOM authoring is too expensive.

This achieves implementation agnosticism without building a compiler and without requiring consumers to know how the components are implemented.
