import type { TyuiRadioElement } from '../radio';

export type TyuiRadioGroupLayout = 'vertical' | 'horizontal' | 'horizontal-stacked';

export type TyuiRadioGroupEventDetail = {
  value: string;
};

export type TyuiRadioGroupEvent = CustomEvent<TyuiRadioGroupEventDetail>;

const radioGroupSheet = new CSSStyleSheet();

radioGroupSheet.replaceSync(`
  @layer ty.component-base {
    :host {
      display: inline-flex;
      flex-direction: column;
      gap: var(--ty-radio-group-gap, var(--ty-space-2, 0.5rem));
      color: var(--ty-radio-group-foreground, var(--ty-color-text, CanvasText));
      font-family: var(--ty-font-family, inherit);
      font-size: var(--ty-radio-group-font-size, var(--ty-control-font-size, 0.875rem));
      line-height: var(--ty-radio-group-line-height, 1.25rem);
    }

    :host([disabled]) {
      color: var(--ty-radio-group-disabled-foreground, var(--ty-color-disabled-text, GrayText));
    }

    [part='label'] {
      color: var(--ty-radio-group-label-color, currentColor);
      font-weight: var(--ty-radio-group-label-font-weight, var(--ty-font-weight-regular, 400));
    }

    [part='items'] {
      display: flex;
      flex-direction: column;
      gap: var(--ty-radio-group-gap, var(--ty-space-2, 0.5rem));
    }

    :host([layout='horizontal']) [part='items'],
    :host([layout='horizontal-stacked']) [part='items'] {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ty-radio-group-inline-gap, var(--ty-space-4, 1rem));
    }

    :host([layout='horizontal-stacked']) [part='items'] {
      align-items: flex-start;
    }

    @media (forced-colors: active) {
      :host,
      [part='label'] {
        color: CanvasText;
      }

      :host([disabled]),
      :host([disabled]) [part='label'] {
        color: GrayText;
      }
    }
  }
`);

const template = document.createElement('template');

template.innerHTML = `
  <span part="label"></span>
  <div part="items"><slot></slot></div>
`;

let labelIdCounter = 0;
let groupNameCounter = 0;

function normalizeLayout(value: string | null): TyuiRadioGroupLayout {
  if (value === 'horizontal' || value === 'horizontal-stacked') return value;
  return 'vertical';
}

function boolFromAttribute(element: HTMLElement, name: string): boolean {
  return element.hasAttribute(name);
}

export class TyuiRadioGroupElement extends HTMLElement {
  static formAssociated = true;

  static observedAttributes = ['disabled', 'label', 'layout', 'name', 'required', 'value'];

  readonly #internals: ElementInternals | null;
  readonly #label: HTMLElement;
  readonly #slot: HTMLSlotElement;
  readonly #labelId = `tyui-radio-group-label-${++labelIdCounter}`;
  readonly #fallbackName = `tyui-radio-group-${++groupNameCounter}`;

  #externalLabelledBy = false;
  #labelText = '';
  #name = '';
  #value = '';

  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [radioGroupSheet];
    root.append(template.content.cloneNode(true));

    const label = root.querySelector('[part="label"]');
    const slot = root.querySelector('slot');

    if (!(label instanceof HTMLElement) || !(slot instanceof HTMLSlotElement)) {
      throw new Error('TyuiRadioGroupElement template is missing expected nodes.');
    }

    this.#label = label;
    this.#slot = slot;
    this.#internals = this.#attachInternals();

    this.addEventListener('click', this.#handleClick);
    this.addEventListener('keydown', this.#handleKeydown);
    this.#slot.addEventListener('slotchange', this.#handleSlotChange);
  }

  get disabled(): boolean {
    return boolFromAttribute(this, 'disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  get label(): string {
    return this.#labelText;
  }

  set label(value: string) {
    this.#labelText = String(value);
    if (this.#labelText) this.setAttribute('label', this.#labelText);
    else this.removeAttribute('label');
  }

  get layout(): TyuiRadioGroupLayout {
    return normalizeLayout(this.getAttribute('layout'));
  }

  set layout(value: TyuiRadioGroupLayout) {
    this.setAttribute('layout', value);
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
    this.#setValue(String(value), false);
  }

  get validity(): ValidityState | undefined {
    return this.#internals?.validity;
  }

  connectedCallback(): void {
    this.#syncPropertiesFromAttributes();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'radiogroup');
    const labelledBy = this.getAttribute('aria-labelledby');
    if (labelledBy) this.#externalLabelledBy = true;
    else this.setAttribute('aria-labelledby', this.#labelId);
    this.#ensureDefaultAttributes();
    this.#render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'label') this.#labelText = newValue ?? '';
    else if (name === 'name') this.#name = newValue ?? '';
    else if (name === 'value') this.#value = newValue ?? '';
    this.#render();
  }

  checkValidity(): boolean {
    return this.#internals?.checkValidity() ?? (!this.required || !!this.#value || this.disabled);
  }

  reportValidity(): boolean {
    return this.#internals?.reportValidity() ?? this.checkValidity();
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
    this.#labelText = this.getAttribute('label') ?? this.#labelText;
    this.#name = this.getAttribute('name') ?? this.#name;
    this.#value = this.getAttribute('value') ?? this.#value;
  }

  #ensureDefaultAttributes(): void {
    if (!this.hasAttribute('layout')) this.setAttribute('layout', 'vertical');
  }

  #handleSlotChange = (): void => {
    if (!this.#value) {
      const checked = this.#radios().find((radio) => radio.checked);
      if (checked) this.#value = checked.value;
    }
    this.#render();
  };

  #handleClick = (event: Event): void => {
    if (this.disabled) return;
    const radio = this.#radioFromPath(event.composedPath());
    if (!radio || radio.disabled || radio.getAttribute('aria-disabled') === 'true') return;
    this.#setValue(radio.value, true);
  };

  #handleKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    const radios = this.#focusableRadios();
    if (radios.length === 0) return;

    const current = this.#radioFromPath(event.composedPath());
    const index = current ? radios.indexOf(current) : -1;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      const target = radios[index === -1 ? 0 : (index + 1) % radios.length];
      if (target) this.#focusAndSelect(target);
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const target = radios[index === -1 ? 0 : (index - 1 + radios.length) % radios.length];
      if (target) this.#focusAndSelect(target);
      return;
    }

    if (event.key === ' ' && current && !current.disabled) {
      event.preventDefault();
      this.#setValue(current.value, true);
    }
  };

  #focusAndSelect(radio: TyuiRadioElement): void {
    this.#setValue(radio.value, true);
    radio.focus();
  }

  #setValue(value: string, emit: boolean): void {
    if (value === this.#value) return;
    this.#value = value;
    if (value) this.setAttribute('value', value);
    else this.removeAttribute('value');
    this.#render();

    if (emit) {
      this.dispatchEvent(
        new CustomEvent<TyuiRadioGroupEventDetail>('change', {
          detail: { value: this.#value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  #render(): void {
    this.setAttribute('aria-disabled', String(this.disabled));
    this.setAttribute('aria-required', String(this.required));

    this.#label.id = this.#labelId;
    this.#label.textContent = this.#externalLabelledBy ? '' : this.#labelText;
    this.#label.toggleAttribute('hidden', this.#externalLabelledBy && this.#labelText.length === 0);

    this.#syncRadios();
    this.#syncValidity();
  }

  #syncRadios(): void {
    const radios = this.#radios();
    const labelPosition = this.layout === 'horizontal-stacked' ? 'below' : 'after';

    for (const radio of radios) {
      if (this.#value) radio.toggleAttribute('checked', radio.value === this.#value);
      radio.toggleAttribute('required', this.required);
      radio.setAttribute('label-position', labelPosition);

      if (this.#name) radio.setAttribute('name', this.#name);
      else if (!radio.name) radio.setAttribute('name', this.#fallbackName);

      if (this.disabled) {
        radio.setAttribute('aria-disabled', 'true');
        radio.tabIndex = -1;
      } else {
        radio.setAttribute('aria-disabled', String(radio.disabled));
      }
    }

    this.#syncTabindex(radios);
  }

  #syncTabindex(radios = this.#radios()): void {
    if (this.disabled) {
      for (const radio of radios) radio.tabIndex = -1;
      return;
    }

    const checked = radios.find((radio) => radio.checked && !radio.disabled);
    const target = checked ?? radios.find((radio) => !radio.disabled);

    for (const radio of radios) {
      radio.tabIndex = radio === target ? 0 : -1;
    }
  }

  #syncValidity(): void {
    this.#internals?.setFormValue(!this.disabled && this.#value ? this.#value : null);

    if (this.required && !this.disabled && !this.#value) {
      this.#internals?.setValidity({ valueMissing: true }, 'Select an option.');
      return;
    }

    this.#internals?.setValidity({});
  }

  #radios(): TyuiRadioElement[] {
    return this.#slot
      .assignedElements({ flatten: true })
      .filter((element): element is TyuiRadioElement => element.tagName === 'TYUI-RADIO');
  }

  #focusableRadios(): TyuiRadioElement[] {
    return this.#radios().filter((radio) => !radio.disabled);
  }

  #radioFromPath(path: EventTarget[]): TyuiRadioElement | undefined {
    return path.find(
      (target): target is TyuiRadioElement =>
        target instanceof Element && target.tagName === 'TYUI-RADIO',
    );
  }
}
