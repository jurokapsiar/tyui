export type TyuiRadioLabelPosition = 'after' | 'below';
type TyuiRadioUpgradeableProperty =
  | 'checked'
  | 'disabled'
  | 'labelPosition'
  | 'name'
  | 'required'
  | 'value';

const radioSheet = new CSSStyleSheet();

radioSheet.replaceSync(`
  @layer ty.component-base {
    :host {
      display: inline-flex;
      align-items: center;
      color: var(--ty-radio-foreground, var(--ty-color-text, CanvasText));
      font-family: var(--ty-font-family, inherit);
      font-size: var(--ty-radio-font-size, var(--ty-control-font-size, 0.875rem));
      line-height: var(--ty-radio-line-height, 1.25rem);
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]),
    :host([aria-disabled='true']) {
      color: var(--ty-radio-disabled-foreground, var(--ty-color-disabled-text, GrayText));
      cursor: not-allowed;
    }

    [part='root'] {
      display: inline-flex;
      align-items: center;
      gap: var(--ty-radio-gap, var(--ty-control-gap, 0.5rem));
      cursor: inherit;
    }

    [part='root'][data-label-position='below'] {
      flex-direction: column;
      align-items: center;
      gap: var(--ty-radio-gap-below, var(--ty-space-1, 0.25rem));
      text-align: center;
    }

    [part='indicator'] {
      position: relative;
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
    }

    [part='input'] {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }

    [part='circle'] {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--ty-radio-size, 1rem);
      block-size: var(--ty-radio-size, 1rem);
      border:
        var(--ty-radio-border-width, var(--ty-control-border-width, 1px))
        solid
        var(--ty-radio-border-color, var(--ty-color-border-strong, ButtonText));
      border-radius: var(--ty-radius-pill, 9999px);
      background: var(--ty-radio-background, var(--ty-color-surface, Canvas));
      transition:
        background-color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        border-color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        box-shadow var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease);
    }

    :host(:hover:not([disabled]):not([aria-disabled='true'])) [part='circle'],
    :host([checked]) [part='circle'] {
      border-color: var(--ty-radio-checked-color, var(--ty-color-accent, Highlight));
    }

    :host([checked]) [part='circle'] {
      background: var(--ty-radio-checked-color, var(--ty-color-accent, Highlight));
    }

    [part='dot'] {
      inline-size: var(--ty-radio-dot-size, 0.5rem);
      block-size: var(--ty-radio-dot-size, 0.5rem);
      border-radius: var(--ty-radius-pill, 9999px);
      background: var(--ty-radio-checked-dot-color, var(--ty-color-on-accent, HighlightText));
      opacity: 0;
      transition: opacity var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease);
    }

    :host([checked]) [part='dot'] {
      opacity: 1;
    }

    [part='label'] {
      min-inline-size: 0;
    }

    :host(:focus-within) [part='circle'] {
      outline: var(--ty-focus-width, 2px) solid var(--ty-focus-color, Highlight);
      outline-offset: var(--ty-focus-offset, 2px);
      box-shadow: 0 0 0 2px var(--ty-focus-inner-color, Canvas);
    }

    @media (forced-colors: active) {
      [part='circle'] {
        forced-color-adjust: none;
        background: ButtonFace;
        border-color: ButtonText;
      }

      :host([checked]) [part='circle'] {
        background: Highlight;
        border-color: Highlight;
      }

      [part='dot'] {
        background: HighlightText;
      }

      :host([disabled]),
      :host([aria-disabled='true']) {
        color: GrayText;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [part='circle'],
      [part='dot'] {
        transition-duration: 0ms;
      }
    }
  }
`);

const template = document.createElement('template');

template.innerHTML = `
  <label part="root">
    <span part="indicator">
      <input part="input" type="radio" tabindex="-1" />
      <span part="circle" aria-hidden="true"><span part="dot"></span></span>
    </span>
    <span part="label"><slot></slot></span>
  </label>
`;

function boolFromAttribute(element: HTMLElement, name: string): boolean {
  return element.hasAttribute(name);
}

function normalizeLabelPosition(value: string | null): TyuiRadioLabelPosition {
  return value === 'below' ? 'below' : 'after';
}

export class TyuiRadioElement extends HTMLElement {
  static observedAttributes = [
    'checked',
    'disabled',
    'label-position',
    'name',
    'required',
    'tabindex',
    'value',
  ];

  readonly #input: HTMLInputElement;
  readonly #root: HTMLElement;

  #name = '';
  #value = '';

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.adoptedStyleSheets = [radioSheet];
    root.append(template.content.cloneNode(true));

    const input = root.querySelector('input');
    const labelRoot = root.querySelector('[part="root"]');

    if (!(input instanceof HTMLInputElement) || !(labelRoot instanceof HTMLElement)) {
      throw new Error('TyuiRadioElement template is missing expected controls.');
    }

    this.#input = input;
    this.#root = labelRoot;
    this.#input.addEventListener('change', this.#handleInputChange);
  }

  get checked(): boolean {
    return boolFromAttribute(this, 'checked');
  }

  set checked(value: boolean) {
    this.toggleAttribute('checked', value);
  }

  get disabled(): boolean {
    return boolFromAttribute(this, 'disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  get labelPosition(): TyuiRadioLabelPosition {
    return normalizeLabelPosition(this.getAttribute('label-position'));
  }

  set labelPosition(value: TyuiRadioLabelPosition) {
    this.setAttribute('label-position', value);
  }

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = String(value);
    if (this.#name) this.setAttribute('name', this.#name);
    else this.removeAttribute('name');
  }

  get required(): boolean {
    return boolFromAttribute(this, 'required');
  }

  set required(value: boolean) {
    this.toggleAttribute('required', value);
  }

  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    this.#value = String(value);
    this.setAttribute('value', this.#value);
  }

  connectedCallback(): void {
    this.#upgradeProperty('checked');
    this.#upgradeProperty('disabled');
    this.#upgradeProperty('labelPosition');
    this.#upgradeProperty('name');
    this.#upgradeProperty('required');
    this.#upgradeProperty('value');
    this.#syncPropertiesFromAttributes();
    if (!this.hasAttribute('tabindex') && this.tabIndex < 0) this.tabIndex = -1;
    this.#render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'name') this.#name = newValue ?? '';
    else if (name === 'value') this.#value = newValue ?? '';
    this.#render();
  }

  override focus(options?: FocusOptions): void {
    this.#input.focus(options);
  }

  #syncPropertiesFromAttributes(): void {
    this.#name = this.getAttribute('name') ?? this.#name;
    this.#value = this.getAttribute('value') ?? this.#value;
  }

  #upgradeProperty(name: TyuiRadioUpgradeableProperty): void {
    if (!Object.prototype.hasOwnProperty.call(this, name)) return;
    const value = this[name];
    delete this[name];
    this[name] = value as never;
  }

  #handleInputChange = (event: Event): void => {
    event.stopPropagation();
    this.checked = this.#input.checked;
  };

  #render(): void {
    if (this.disabled && this.tabIndex !== -1) this.tabIndex = -1;
    this.#input.checked = this.checked;
    this.#input.disabled = this.disabled;
    this.#input.required = this.required;
    this.#input.name = this.#name;
    this.#input.value = this.#value;
    this.#input.tabIndex = !this.disabled && this.tabIndex === 0 ? 0 : -1;
    this.#root.dataset.labelPosition = this.labelPosition;
  }
}
