import {
  installTyuiLayoutStyles,
  normalizeAttribute,
  ratioOrFallback,
  setReflectedAttribute,
  setStyleVar,
} from '../layout/layout-helpers';

export type TyuiFrameFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

const fits = ['cover', 'contain', 'fill', 'scale-down', 'none'] as const;

export class TyuiFrameElement extends HTMLElement {
  static observedAttributes = ['fit', 'position', 'ratio'];

  connectedCallback(): void {
    installTyuiLayoutStyles();
    this.#syncStyles();
  }

  attributeChangedCallback(): void {
    this.#syncStyles();
  }

  get ratio(): string {
    return this.getAttribute('ratio') ?? '16/9';
  }

  set ratio(value: string) {
    setReflectedAttribute(this, 'ratio', value);
  }

  get fit(): TyuiFrameFit {
    return normalizeAttribute(this.getAttribute('fit'), fits, 'cover');
  }

  set fit(value: TyuiFrameFit) {
    setReflectedAttribute(this, 'fit', value);
  }

  get position(): string {
    return this.getAttribute('position') ?? 'center';
  }

  set position(value: string) {
    setReflectedAttribute(this, 'position', value);
  }

  #syncStyles(): void {
    setStyleVar(this, '--ty-frame-ratio', ratioOrFallback(this.ratio, '16 / 9'));
    setStyleVar(this, '--ty-frame-fit', this.fit);
    setStyleVar(this, '--ty-frame-position', this.position.trim() || 'center');
  }
}
