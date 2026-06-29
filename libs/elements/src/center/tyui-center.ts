import {
  installTyuiLayoutStyles,
  lengthOrFallback,
  normalizeAttribute,
  setReflectedAttribute,
  setStyleVar,
  spaceValue,
} from '../layout/layout-helpers';

export type TyuiCenterGutter = '0' | '1' | '2' | '3' | '4' | 'page';

const gutters = ['0', '1', '2', '3', '4', 'page'] as const;

function centerGutter(value: string | null): string {
  const normalized = normalizeAttribute(value, gutters, 'page');
  return normalized === 'page' ? 'var(--ty-page-gutter, 1rem)' : spaceValue(normalized, '3');
}

export class TyuiCenterElement extends HTMLElement {
  static observedAttributes = ['gutter', 'intrinsic', 'measure'];

  connectedCallback(): void {
    installTyuiLayoutStyles();
    this.#syncStyles();
  }

  attributeChangedCallback(): void {
    this.#syncStyles();
  }

  get measure(): string {
    return this.getAttribute('measure') ?? '65ch';
  }

  set measure(value: string) {
    setReflectedAttribute(this, 'measure', value);
  }

  get gutter(): TyuiCenterGutter {
    return normalizeAttribute(this.getAttribute('gutter'), gutters, 'page');
  }

  set gutter(value: TyuiCenterGutter) {
    setReflectedAttribute(this, 'gutter', value);
  }

  get intrinsic(): boolean {
    return this.hasAttribute('intrinsic');
  }

  set intrinsic(value: boolean) {
    setReflectedAttribute(this, 'intrinsic', value);
  }

  #syncStyles(): void {
    setStyleVar(this, '--ty-center-measure', lengthOrFallback(this.measure, '65ch'));
    setStyleVar(this, '--ty-center-gutter', centerGutter(this.getAttribute('gutter')));
  }
}
