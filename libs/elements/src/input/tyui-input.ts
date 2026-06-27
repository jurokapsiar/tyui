export type TyuiInputAppearance = 'outline' | 'filled-darker' | 'filled-lighter';
export type TyuiInputSize = 'small' | 'medium' | 'large';
export type TyuiInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';

export type TyuiInputEventDetail = {
  value: string;
};

export type TyuiInputEvent = CustomEvent<TyuiInputEventDetail>;

const inputSheet = new CSSStyleSheet();

inputSheet.replaceSync(`
  @layer ty.component-base {
    :host {
      display: inline-block;
      color: var(--ty-input-foreground, var(--ty-color-text, FieldText));
      font-family: var(--ty-font-family, inherit);
      font-size: var(--ty-input-font-size, var(--ty-control-font-size, 0.875rem));
      --_ty-input-icon-size: 1.25rem;
    }

    :host([size='small']) {
      --ty-input-min-block-size: 1.5rem;
      --ty-input-padding-inline: var(--ty-space-2, 0.5rem);
      --ty-input-padding-block: var(--ty-space-1, 0.25rem);
      --ty-input-font-size: var(--ty-font-size-100, 0.75rem);
      --ty-input-gap: var(--ty-space-1, 0.25rem);
      --_ty-input-icon-size: 1rem;
    }

    :host(:not([size='small']):not([size='large'])),
    :host([size='medium']) {
      --ty-input-min-block-size: 2rem;
      --ty-input-padding-inline: var(--ty-space-3, 0.75rem);
      --ty-input-padding-block: var(--ty-space-2, 0.5rem);
      --ty-input-font-size: var(--ty-font-size-200, 0.875rem);
      --ty-input-gap: var(--ty-space-1, 0.25rem);
      --_ty-input-icon-size: 1.25rem;
    }

    :host([size='large']) {
      --ty-input-min-block-size: 2.5rem;
      --ty-input-padding-inline: var(--ty-space-4, 1rem);
      --ty-input-padding-block: var(--ty-space-3, 0.75rem);
      --ty-input-font-size: var(--ty-font-size-300, 1rem);
      --ty-input-gap: var(--ty-space-2, 0.5rem);
      --_ty-input-icon-size: 1.5rem;
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    [part='control'] {
      position: relative;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: var(--ty-input-gap, var(--ty-control-gap, 0.25rem));
      min-block-size: var(--ty-input-min-block-size, var(--ty-control-min-block-size, 2rem));
      min-inline-size: var(--ty-input-min-inline-size, 12.5rem);
      padding-inline: var(--ty-input-padding-inline, var(--ty-control-padding-inline, 0.75rem));
      border:
        var(--ty-input-border-width, var(--ty-control-border-width, 1px))
        solid
        var(--ty-input-border-color, var(--ty-color-border, ButtonBorder));
      border-radius: var(--ty-input-radius, var(--ty-control-radius, 0.5rem));
      background: var(--ty-input-background, var(--ty-color-surface, Field));
      color: var(--ty-input-foreground, var(--ty-color-text, FieldText));
      transition:
        background-color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        border-color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        box-shadow var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease);
    }

    :host([appearance='filled-darker']) [part='control'] {
      --ty-input-background: var(--ty-input-background-filled-darker, var(--ty-color-surface-pressed, Field));
      --ty-input-border-color: transparent;
    }

    :host([appearance='filled-lighter']) [part='control'] {
      --ty-input-background: var(--ty-input-background-filled-lighter, var(--ty-color-surface-hover, Field));
      --ty-input-border-color: transparent;
    }

    [part='control']:hover:not(:has(input:disabled)) {
      border-color: var(--ty-input-border-color-strong, var(--ty-color-border-strong, ButtonText));
    }

    [part='control']:focus-within {
      outline: var(--ty-focus-width, 2px) solid var(--ty-input-focus-indicator-color, var(--ty-focus-color, Highlight));
      outline-offset: var(--ty-focus-offset, 2px);
      box-shadow: 0 0 0 2px var(--ty-focus-inner-color, Canvas);
    }

    :host([invalid]) [part='control'] {
      border-color: var(--ty-input-invalid-border-color, var(--ty-color-danger, Mark));
    }

    [part='input'] {
      all: unset;
      box-sizing: border-box;
      flex: 1 1 auto;
      min-inline-size: 0;
      padding-block: var(--ty-input-padding-block, var(--ty-control-padding-block, 0.5rem));
      color: inherit;
      font: inherit;
      background: transparent;
    }

    [part='input']::placeholder {
      color: var(--ty-input-placeholder-color, var(--ty-color-text-muted, GrayText));
      opacity: 1;
    }

    [part='input']:disabled {
      color: var(--ty-input-disabled-foreground, var(--ty-color-disabled-text, GrayText));
      cursor: not-allowed;
    }

    [part='content-before'],
    [part='content-after'] {
      display: inline-flex;
      flex: none;
      align-items: center;
      color: var(--ty-input-content-color, var(--ty-color-text-muted, GrayText));
    }

    ::slotted(svg),
    ::slotted([slot='contentBefore']),
    ::slotted([slot='contentAfter']) {
      max-inline-size: var(--_ty-input-icon-size, 1.25rem);
      max-block-size: var(--_ty-input-icon-size, 1.25rem);
    }

    @media (forced-colors: active) {
      [part='control'] {
        forced-color-adjust: none;
        background: Field;
        border-color: FieldText;
        color: FieldText;
      }

      :host([disabled]) [part='control'],
      [part='input']:disabled {
        color: GrayText;
      }

      [part='control']:focus-within {
        outline-color: Highlight;
        box-shadow: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [part='control'] {
        transition-duration: 0ms;
      }
    }
  }
`);

const template = document.createElement('template');

template.innerHTML = `
  <span part="control">
    <span part="content-before"><slot name="contentBefore"></slot></span>
    <input part="input" />
    <span part="content-after"><slot name="contentAfter"></slot></span>
  </span>
`;

function normalizeAttribute<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function boolFromAttribute(element: HTMLElement, name: string): boolean {
  return element.hasAttribute(name);
}

export class TyuiInputElement extends HTMLElement {
  static formAssociated = true;

  static observedAttributes = [
    'appearance',
    'aria-describedby',
    'aria-invalid',
    'aria-label',
    'aria-labelledby',
    'default-value',
    'disabled',
    'invalid',
    'name',
    'placeholder',
    'readonly',
    'required',
    'size',
    'type',
    'value',
  ];

  readonly #input: HTMLInputElement;
  readonly #internals: ElementInternals | null;

  #defaultApplied = false;
  #autoInvalid = false;
  #reflectingInvalid = false;
  #value = '';
  #defaultValue = '';
  #name = '';
  #placeholder = '';

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.adoptedStyleSheets = [inputSheet];
    root.append(template.content.cloneNode(true));

    const input = root.querySelector('input');
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('TyuiInputElement template is missing its input.');
    }

    this.#input = input;
    this.#input.addEventListener('input', this.#handleInput);
    this.#input.addEventListener('change', this.#handleChange);

    this.#internals = this.#attachInternals();
  }

  get appearance(): TyuiInputAppearance {
    return normalizeAttribute(
      this.getAttribute('appearance'),
      ['outline', 'filled-darker', 'filled-lighter'],
      'outline',
    );
  }

  set appearance(value: TyuiInputAppearance) {
    this.setAttribute('appearance', value);
  }

  get defaultValue(): string {
    return this.#defaultValue;
  }

  set defaultValue(value: string) {
    this.#defaultValue = String(value);
    this.setAttribute('default-value', this.#defaultValue);
  }

  get disabled(): boolean {
    return boolFromAttribute(this, 'disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  get invalid(): boolean {
    return boolFromAttribute(this, 'invalid');
  }

  set invalid(value: boolean) {
    this.toggleAttribute('invalid', value);
  }

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = String(value);
    if (this.#name) this.setAttribute('name', this.#name);
    else this.removeAttribute('name');
  }

  get placeholder(): string {
    return this.#placeholder;
  }

  set placeholder(value: string) {
    this.#placeholder = String(value);
    if (this.#placeholder) this.setAttribute('placeholder', this.#placeholder);
    else this.removeAttribute('placeholder');
  }

  get readonly(): boolean {
    return boolFromAttribute(this, 'readonly');
  }

  set readonly(value: boolean) {
    this.toggleAttribute('readonly', value);
  }

  get required(): boolean {
    return boolFromAttribute(this, 'required');
  }

  set required(value: boolean) {
    this.toggleAttribute('required', value);
  }

  get size(): TyuiInputSize {
    return normalizeAttribute(this.getAttribute('size'), ['small', 'medium', 'large'], 'medium');
  }

  set size(value: TyuiInputSize) {
    this.setAttribute('size', value);
  }

  get type(): TyuiInputType {
    return normalizeAttribute(
      this.getAttribute('type'),
      ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
      'text',
    );
  }

  set type(value: TyuiInputType) {
    this.setAttribute('type', value);
  }

  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    this.#setValue(String(value));
  }

  connectedCallback(): void {
    this.#syncPropertiesFromAttributes();
    this.#applyDefaultValueOnce();
    this.#ensureDefaultAttributes();
    this.#render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'invalid' && this.#reflectingInvalid) return;

    if (name === 'value') this.#setValue(newValue ?? '');
    else if (name === 'default-value') this.#defaultValue = newValue ?? '';
    else if (name === 'name') this.#name = newValue ?? '';
    else if (name === 'placeholder') this.#placeholder = newValue ?? '';

    this.#render();
  }

  override focus(options?: FocusOptions): void {
    this.#input.focus(options);
  }

  checkValidity(): boolean {
    return this.#internals?.checkValidity() ?? this.#input.checkValidity();
  }

  reportValidity(): boolean {
    return this.#internals?.reportValidity() ?? this.#input.reportValidity();
  }

  #attachInternals(): ElementInternals | null {
    if (!('attachInternals' in this)) return null;

    try {
      return this.attachInternals();
    } catch {
      return null;
    }
  }

  #syncPropertiesFromAttributes(): void {
    this.#value = this.getAttribute('value') ?? this.#value;
    this.#defaultValue = this.getAttribute('default-value') ?? this.#defaultValue;
    this.#name = this.getAttribute('name') ?? this.#name;
    this.#placeholder = this.getAttribute('placeholder') ?? this.#placeholder;
  }

  #applyDefaultValueOnce(): void {
    if (this.#defaultApplied) return;
    this.#defaultApplied = true;
    if (!this.#value && this.#defaultValue) this.#value = this.#defaultValue;
  }

  #ensureDefaultAttributes(): void {
    if (!this.hasAttribute('appearance')) this.setAttribute('appearance', 'outline');
    if (!this.hasAttribute('size')) this.setAttribute('size', 'medium');
    if (!this.hasAttribute('type')) this.setAttribute('type', 'text');
  }

  #handleInput = (event: Event): void => {
    event.stopPropagation();
    this.#setValue(this.#input.value);
    this.dispatchEvent(
      new CustomEvent<TyuiInputEventDetail>('input', {
        detail: { value: this.#value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #handleChange = (event: Event): void => {
    event.stopPropagation();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  #setValue(value: string): void {
    this.#value = value;
    this.#render();
  }

  #render(): void {
    this.#input.value = this.#value;
    this.#input.type = this.type;
    this.#input.placeholder = this.#placeholder;
    this.#input.disabled = this.disabled;
    this.#input.readOnly = this.readonly;
    this.#input.required = this.required;

    this.#mirrorAria('aria-label');
    this.#mirrorAria('aria-labelledby');
    this.#mirrorAria('aria-describedby');

    if (this.invalid) this.#input.setAttribute('aria-invalid', 'true');
    else if (this.getAttribute('aria-invalid') === 'true')
      this.#input.setAttribute('aria-invalid', 'true');
    else this.#input.removeAttribute('aria-invalid');

    this.#syncValidity();
  }

  #mirrorAria(name: string): void {
    const value = this.getAttribute(name);
    if (value === null || value === '') this.#input.removeAttribute(name);
    else this.#input.setAttribute(name, value);
  }

  #syncValidity(): void {
    this.#internals?.setFormValue(this.disabled ? null : this.#value);

    if (this.required && !this.disabled && this.#value.length === 0) {
      this.#internals?.setValidity({ valueMissing: true }, 'This field is required.', this.#input);
      this.#autoInvalid = true;
      this.#reflectInvalid(true);
      return;
    }

    this.#internals?.setValidity({});
    if (this.#autoInvalid) {
      this.#autoInvalid = false;
      this.#reflectInvalid(false);
    }
  }

  #reflectInvalid(value: boolean): void {
    if (this.#reflectingInvalid) return;

    this.#reflectingInvalid = true;
    this.toggleAttribute('invalid', value);
    this.#reflectingInvalid = false;
  }
}
