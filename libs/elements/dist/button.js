import { createToggleController as e } from '@tyui/core';
//#region src/button/tyui-button.ts
var t = document.createElement('template');
t.innerHTML =
  '\n  <style>\n    :host {\n      display: inline-block;\n    }\n\n    button {\n      align-items: center;\n      appearance: none;\n      background: var(--tyui-button-background, Canvas);\n      border: var(--tyui-button-border, 1px solid ButtonBorder);\n      border-radius: var(--tyui-button-radius, 6px);\n      color: var(--tyui-button-color, ButtonText);\n      cursor: pointer;\n      display: inline-flex;\n      font: inherit;\n      gap: var(--tyui-button-gap, 0.375rem);\n      min-height: var(--tyui-button-min-height, 2rem);\n      padding: var(--tyui-button-padding, 0.375rem 0.75rem);\n    }\n\n    button[disabled] {\n      cursor: not-allowed;\n      opacity: 0.55;\n    }\n\n    button[aria-pressed=\'true\'] {\n      background: var(--tyui-button-pressed-background, Highlight);\n      color: var(--tyui-button-pressed-color, HighlightText);\n    }\n  </style>\n  <button part="button" type="button">\n    <slot></slot>\n  </button>\n';
var n = class extends HTMLElement {
  static observedAttributes = ['disabled', 'pressed'];
  #e = e();
  #t;
  #n = !1;
  constructor() {
    super();
    let e = this.attachShadow({ mode: 'open' });
    e.append(t.content.cloneNode(!0));
    let n = e.querySelector('button');
    if (!(n instanceof HTMLButtonElement))
      throw Error('TyuiButtonElement template is missing its button.');
    ((this.#t = n), this.addEventListener('click', this.#r));
  }
  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(e) {
    this.toggleAttribute('disabled', e);
  }
  get pressed() {
    return this.hasAttribute('pressed');
  }
  set pressed(e) {
    this.toggleAttribute('pressed', e);
  }
  connectedCallback() {
    (this.#i(), this.#o());
  }
  attributeChangedCallback() {
    this.#n || (this.#i(), this.#o());
  }
  #r = (e) => {
    this.#i();
    let t = e.detail === 0 ? 'keyboard' : 'pointer',
      n = this.#e.press(t);
    n.changed &&
      (this.#a(n.state.pressed),
      this.#o(),
      this.dispatchEvent(
        new CustomEvent('activate', {
          detail: {
            pressed: n.state.pressed,
            source: t,
          },
          bubbles: !0,
          composed: !0,
        }),
      ));
  };
  #i() {
    (this.#e.setDisabled(this.disabled), this.#e.setPressed(this.pressed));
  }
  #a(e) {
    ((this.#n = !0), this.toggleAttribute('pressed', e), (this.#n = !1));
  }
  #o() {
    let e = this.#e.getState();
    ((this.#t.disabled = e.disabled), this.#t.setAttribute('aria-pressed', String(e.pressed)));
  }
};
//#endregion
export { n as TyuiButtonElement };
