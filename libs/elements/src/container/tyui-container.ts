import {
  installTyuiLayoutStyles,
  normalizeAttribute,
  setReflectedAttribute,
  setStyleVar,
  spaceValue,
} from '../layout/layout-helpers';

export type TyuiContainerSize = 'narrow' | 'medium' | 'wide' | 'full';
export type TyuiContainerGutter = '0' | '1' | '2' | '3' | '4' | 'page';

const sizes = ['narrow', 'medium', 'wide', 'full'] as const;
const gutters = ['0', '1', '2', '3', '4', 'page'] as const;

const sizeValues: Record<TyuiContainerSize, string> = {
  full: 'none',
  medium: 'var(--ty-container-medium, 60rem)',
  narrow: 'var(--ty-container-narrow, 42rem)',
  wide: 'var(--ty-container-wide, 72rem)',
};

function containerGutter(value: string | null): string {
  const normalized = normalizeAttribute(value, gutters, 'page');
  return normalized === 'page' ? 'var(--ty-page-gutter, 1rem)' : spaceValue(normalized, '3');
}

export class TyuiContainerElement extends HTMLElement {
  static observedAttributes = ['bleed', 'gutter', 'size'];

  connectedCallback(): void {
    installTyuiLayoutStyles();
    this.#syncStyles();
  }

  attributeChangedCallback(): void {
    this.#syncStyles();
  }

  get size(): TyuiContainerSize {
    return normalizeAttribute(this.getAttribute('size'), sizes, 'wide');
  }

  set size(value: TyuiContainerSize) {
    setReflectedAttribute(this, 'size', value);
  }

  get gutter(): TyuiContainerGutter {
    return normalizeAttribute(this.getAttribute('gutter'), gutters, 'page');
  }

  set gutter(value: TyuiContainerGutter) {
    setReflectedAttribute(this, 'gutter', value);
  }

  get bleed(): boolean {
    return this.hasAttribute('bleed');
  }

  set bleed(value: boolean) {
    setReflectedAttribute(this, 'bleed', value);
  }

  #syncStyles(): void {
    setStyleVar(this, '--ty-container-max-inline-size', sizeValues[this.size]);
    setStyleVar(this, '--ty-container-gutter', this.bleed ? '0' : containerGutter(this.gutter));
  }
}
