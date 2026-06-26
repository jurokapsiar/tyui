import { createToggleController, type InteractionSource, type ToggleController } from '@tyui/core';

export type TyuiButtonActivateDetail = {
  pressed: boolean;
  source: InteractionSource;
};

export type TyuiButtonActivateEvent = CustomEvent<TyuiButtonActivateDetail>;

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: inline-block;
    }

    button {
      align-items: center;
      appearance: none;
      background: var(--tyui-button-background, Canvas);
      border: var(--tyui-button-border, 1px solid ButtonBorder);
      border-radius: var(--tyui-button-radius, 6px);
      color: var(--tyui-button-color, ButtonText);
      cursor: pointer;
      display: inline-flex;
      font: inherit;
      gap: var(--tyui-button-gap, 0.375rem);
      min-height: var(--tyui-button-min-height, 2rem);
      padding: var(--tyui-button-padding, 0.375rem 0.75rem);
    }

    button[disabled] {
      cursor: not-allowed;
      opacity: 0.55;
    }

    button[aria-pressed='true'] {
      background: var(--tyui-button-pressed-background, Highlight);
      color: var(--tyui-button-pressed-color, HighlightText);
    }
  </style>
  <button part="button" type="button">
    <slot></slot>
  </button>
`;

export class TyuiButtonElement extends HTMLElement {
  static observedAttributes = ['disabled', 'pressed'];

  readonly #controller: ToggleController = createToggleController();
  readonly #button: HTMLButtonElement;

  #reflecting = false;

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));

    const button = root.querySelector('button');

    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('TyuiButtonElement template is missing its button.');
    }

    this.#button = button;
    this.addEventListener('click', this.#handleClick);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  get pressed(): boolean {
    return this.hasAttribute('pressed');
  }

  set pressed(value: boolean) {
    this.toggleAttribute('pressed', value);
  }

  connectedCallback(): void {
    this.#syncControllerFromAttributes();
    this.#render();
  }

  attributeChangedCallback(): void {
    if (this.#reflecting) return;

    this.#syncControllerFromAttributes();
    this.#render();
  }

  #handleClick = (event: MouseEvent): void => {
    this.#syncControllerFromAttributes();

    const source: InteractionSource = event.detail === 0 ? 'keyboard' : 'pointer';
    const transition = this.#controller.press(source);

    if (!transition.changed) return;

    this.#reflectPressed(transition.state.pressed);
    this.#render();

    this.dispatchEvent(
      new CustomEvent<TyuiButtonActivateDetail>('activate', {
        detail: {
          pressed: transition.state.pressed,
          source,
        },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #syncControllerFromAttributes(): void {
    this.#controller.setDisabled(this.disabled);
    this.#controller.setPressed(this.pressed);
  }

  #reflectPressed(pressed: boolean): void {
    this.#reflecting = true;
    this.toggleAttribute('pressed', pressed);
    this.#reflecting = false;
  }

  #render(): void {
    const state = this.#controller.getState();

    this.#button.disabled = state.disabled;
    this.#button.setAttribute('aria-pressed', String(state.pressed));
  }
}
