export type TyuiCheckboxEvent = Event;

const checkboxSheet = new CSSStyleSheet();

checkboxSheet.replaceSync(`
  @layer ty.component-base {
    :host {
      display: inline-flex;
      align-items: center;
      color: var(--ty-checkbox-foreground, var(--ty-color-text, CanvasText));
      font-family: var(--ty-font-family, inherit);
      font-size: var(--ty-checkbox-font-size, var(--ty-control-font-size, 0.875rem));
      line-height: var(--ty-checkbox-line-height, 1.25rem);
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      color: var(--ty-checkbox-disabled-foreground, var(--ty-color-disabled-text, GrayText));
      cursor: not-allowed;
    }

    [part='control'] {
      display: inline-flex;
      align-items: center;
      gap: var(--ty-checkbox-gap, var(--ty-control-gap, 0.5rem));
      cursor: inherit;
    }

    input[type='checkbox'] {
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

    [part='box'] {
      box-sizing: border-box;
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
      inline-size: var(--ty-checkbox-size, 1rem);
      block-size: var(--ty-checkbox-size, 1rem);
      border:
        var(--ty-checkbox-border-width, var(--ty-control-border-width, 1px))
        solid
        var(--ty-checkbox-border-color, var(--ty-color-border-strong, ButtonText));
      border-radius: var(--ty-checkbox-radius, var(--ty-radius-1, 0.25rem));
      background: var(--ty-checkbox-background, var(--ty-color-surface, Canvas));
      color: var(--ty-checkbox-mark-color, transparent);
      transition:
        background-color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        border-color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        color var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease),
        box-shadow var(--ty-motion-feedback-duration, 120ms) var(--ty-motion-easing, ease);
    }

    :host(:hover:not([disabled]):not([checked]):not([indeterminate])) [part='box'] {
      border-color: var(--ty-checkbox-border-color-hover, var(--ty-color-border-strong, ButtonText));
    }

    :host([checked]) [part='box'] {
      --ty-checkbox-mark-color: var(--ty-checkbox-checked-foreground, var(--ty-color-on-accent, HighlightText));
      background: var(--ty-checkbox-checked-background, var(--ty-color-accent, Highlight));
      border-color: var(--ty-checkbox-checked-border-color, var(--ty-color-accent, Highlight));
    }

    :host([indeterminate]) [part='box'] {
      --ty-checkbox-mark-color: var(--ty-checkbox-indeterminate-foreground, var(--ty-color-accent, Highlight));
      background: var(--ty-checkbox-background, var(--ty-color-surface, Canvas));
      border-color: var(--ty-checkbox-indeterminate-border-color, var(--ty-color-accent, Highlight));
    }

    :host(:hover:not([disabled])[checked]) [part='box'] {
      background: var(--ty-checkbox-checked-background-hover, var(--ty-color-accent-hover, Highlight));
      border-color: var(--ty-checkbox-checked-border-color-hover, var(--ty-color-accent-hover, Highlight));
    }

    :host(:active:not([disabled])[checked]) [part='box'] {
      background: var(--ty-checkbox-checked-background-active, var(--ty-color-accent-pressed, Highlight));
      border-color: var(--ty-checkbox-checked-border-color-active, var(--ty-color-accent-pressed, Highlight));
    }

    :host([disabled]) [part='box'] {
      background: var(--ty-checkbox-disabled-background, var(--ty-color-disabled-surface, Canvas));
      border-color: var(--ty-checkbox-disabled-border-color, var(--ty-color-disabled-border, GrayText));
    }

    :host([disabled][checked]) [part='box'],
    :host([disabled][indeterminate]) [part='box'] {
      --ty-checkbox-mark-color: var(--ty-checkbox-disabled-foreground, var(--ty-color-disabled-text, GrayText));
      background: var(--ty-checkbox-disabled-selected-background, var(--ty-color-disabled-border, GrayText));
      border-color: var(--ty-checkbox-disabled-border-color, var(--ty-color-disabled-border, GrayText));
    }

    [data-ty-checkbox-mark] {
      inline-size: calc(var(--ty-checkbox-size, 1rem) * 0.75);
      block-size: calc(var(--ty-checkbox-size, 1rem) * 0.75);
      color: inherit;
    }

    [part='label'] {
      min-inline-size: 0;
    }

    :host(:focus-within) [part='box'] {
      outline: var(--ty-focus-width, 2px) solid var(--ty-focus-color, Highlight);
      outline-offset: var(--ty-focus-offset, 2px);
      box-shadow: 0 0 0 2px var(--ty-focus-inner-color, Canvas);
    }

    @media (forced-colors: active) {
      [part='box'] {
        forced-color-adjust: none;
        background: ButtonFace;
        border-color: ButtonText;
      }

      :host([checked]) [part='box'],
      :host([indeterminate]) [part='box'] {
        background: Highlight;
        border-color: Highlight;
        color: HighlightText;
      }

      :host([disabled]) {
        color: GrayText;
      }

      :host([disabled]) [part='box'] {
        border-color: GrayText;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      [part='box'] {
        transition-duration: 0ms;
      }
    }
  }
`);

const template = document.createElement('template');

template.innerHTML = `
  <label part="control">
    <input type="checkbox" />
    <span part="box" aria-hidden="true"></span>
    <span part="label"><slot></slot></span>
  </label>
`;

function boolFromAttribute(element: HTMLElement, name: string): boolean {
  return element.hasAttribute(name);
}

export class TyuiCheckboxElement extends HTMLElement {
  static formAssociated = true;

  static observedAttributes = ['checked', 'disabled', 'indeterminate', 'name', 'required', 'value'];

  readonly #input: HTMLInputElement;
  readonly #box: HTMLElement;
  readonly #internals: ElementInternals | null;

  #name = '';
  #value = 'on';

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    root.adoptedStyleSheets = [checkboxSheet];
    root.append(template.content.cloneNode(true));

    const input = root.querySelector('input');
    const box = root.querySelector('[part="box"]');

    if (!(input instanceof HTMLInputElement) || !(box instanceof HTMLElement)) {
      throw new Error('TyuiCheckboxElement template is missing expected controls.');
    }

    this.#input = input;
    this.#box = box;
    this.#internals = this.#attachInternals();

    this.addEventListener('click', this.#handleHostClick, { capture: true });
    this.addEventListener('keydown', this.#handleHostKeydown);
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

  get indeterminate(): boolean {
    return boolFromAttribute(this, 'indeterminate');
  }

  set indeterminate(value: boolean) {
    this.toggleAttribute('indeterminate', value);
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

  get validity(): ValidityState {
    return this.#internals?.validity ?? this.#input.validity;
  }

  connectedCallback(): void {
    this.#syncPropertiesFromAttributes();
    if (!this.hasAttribute('tabindex')) this.tabIndex = this.disabled ? -1 : 0;
    this.#render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'name') this.#name = newValue ?? '';
    else if (name === 'value') this.#value = newValue ?? 'on';
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
    this.#name = this.getAttribute('name') ?? this.#name;
    this.#value = this.getAttribute('value') ?? this.#value;
  }

  #handleHostClick = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (event.composedPath()[0] === this) {
      event.stopImmediatePropagation();
      this.#toggleFromUser();
    }
  };

  #handleHostKeydown = (event: KeyboardEvent): void => {
    if (this.disabled || (event.key !== ' ' && event.key !== 'Enter')) return;
    if (!event.isTrusted) {
      event.preventDefault();
      this.#toggleFromUser();
    }
  };

  #handleInputChange = (event: Event): void => {
    event.stopPropagation();
    const wasIndeterminate = this.indeterminate;
    if (wasIndeterminate) {
      this.#input.indeterminate = false;
      this.#input.checked = true;
    }
    this.indeterminate = this.#input.indeterminate;
    this.checked = this.#input.checked;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  #toggleFromUser(): void {
    this.checked = this.indeterminate ? true : !this.checked;
    this.indeterminate = false;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  #render(): void {
    this.tabIndex = this.disabled ? -1 : this.tabIndex < 0 ? 0 : this.tabIndex;
    this.#input.checked = this.checked;
    this.#input.indeterminate = this.indeterminate;
    this.#input.disabled = this.disabled;
    this.#input.required = this.required;
    this.#input.name = this.#name;
    this.#input.value = this.#value;
    this.#renderMark();
    this.#syncValidity();
  }

  #renderMark(): void {
    this.#box.replaceChildren(this.#createMark());
  }

  #createMark(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('data-ty-checkbox-mark', '');
    svg.setAttribute('viewBox', '0 0 12 12');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('fill', 'currentColor');

    if (this.indeterminate) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '2');
      rect.setAttribute('y', '2');
      rect.setAttribute('width', '8');
      rect.setAttribute('height', '8');
      rect.setAttribute('rx', '1');
      svg.append(rect);
    } else {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        'M9.76 3.2c.3.29.32.76.04 1.06l-4.25 4.5a.75.75 0 0 1-1.08.02L2.22 6.53a.75.75 0 0 1 1.06-1.06l1.7 1.7L8.7 3.24a.75.75 0 0 1 1.06-.04Z',
      );
      svg.append(path);
    }

    return svg;
  }

  #syncValidity(): void {
    this.#internals?.setFormValue(
      !this.disabled && this.checked && !this.indeterminate ? this.#value : null,
    );

    if (this.required && !this.disabled && !this.checked) {
      this.#internals?.setValidity({ valueMissing: true }, 'This field is required.', this.#input);
      return;
    }

    this.#internals?.setValidity({});
  }
}
