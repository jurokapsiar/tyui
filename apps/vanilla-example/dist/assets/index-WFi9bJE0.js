(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes) e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
function e(e = {}) {
  let t = { pressed: e.initialPressed ?? !1, disabled: e.disabled ?? !1 },
    n = new Set(),
    r = () => {
      for (let e of n) e(t);
    },
    i = (n, i, a) => {
      if (!(n.pressed !== t.pressed || n.disabled !== t.disabled))
        return { changed: !1, source: i, state: t };
      let o = n.pressed !== t.pressed;
      return (
        (t = n), r(), a && o && e.onChange?.(t.pressed, i), { changed: !0, source: i, state: t }
      );
    };
  return {
    getState() {
      return t;
    },
    setDisabled(e) {
      return i({ ...t, disabled: e }, `programmatic`, !1);
    },
    setPressed(e) {
      return i({ ...t, pressed: e }, `programmatic`, !1);
    },
    press(e = `programmatic`) {
      return t.disabled
        ? { changed: !1, source: e, state: t }
        : i({ ...t, pressed: !t.pressed }, e, !0);
    },
    subscribe(e) {
      return (
        n.add(e),
        e(t),
        () => {
          n.delete(e);
        }
      );
    },
  };
}
var t = document.createElement(`template`);
t.innerHTML = `
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
var n = class extends HTMLElement {
    static observedAttributes = [`disabled`, `pressed`];
    #e = e();
    #t;
    #n = !1;
    constructor() {
      super();
      let e = this.attachShadow({ mode: `open` });
      e.append(t.content.cloneNode(!0));
      let n = e.querySelector(`button`);
      if (!(n instanceof HTMLButtonElement))
        throw Error(`TyuiButtonElement template is missing its button.`);
      ((this.#t = n), this.addEventListener(`click`, this.#r));
    }
    get disabled() {
      return this.hasAttribute(`disabled`);
    }
    set disabled(e) {
      this.toggleAttribute(`disabled`, e);
    }
    get pressed() {
      return this.hasAttribute(`pressed`);
    }
    set pressed(e) {
      this.toggleAttribute(`pressed`, e);
    }
    connectedCallback() {
      (this.#i(), this.#o());
    }
    attributeChangedCallback() {
      this.#n || (this.#i(), this.#o());
    }
    #r = (e) => {
      this.#i();
      let t = e.detail === 0 ? `keyboard` : `pointer`,
        n = this.#e.press(t);
      n.changed &&
        (this.#a(n.state.pressed),
        this.#o(),
        this.dispatchEvent(
          new CustomEvent(`activate`, {
            detail: { pressed: n.state.pressed, source: t },
            bubbles: !0,
            composed: !0,
          }),
        ));
    };
    #i() {
      (this.#e.setDisabled(this.disabled), this.#e.setPressed(this.pressed));
    }
    #a(e) {
      ((this.#n = !0), this.toggleAttribute(`pressed`, e), (this.#n = !1));
    }
    #o() {
      let e = this.#e.getState();
      ((this.#t.disabled = e.disabled), this.#t.setAttribute(`aria-pressed`, String(e.pressed)));
    }
  },
  r = `tyui-button`;
function i() {
  customElements.get(`tyui-button`) || customElements.define(r, n);
}
i();
var a = document.getElementById(`button`),
  o = document.getElementById(`status`);
a?.addEventListener(`activate`, (e) => {
  let { pressed: t } = e.detail;
  (o && (o.textContent = `Status: ${t ? `active` : `idle`}`),
    a && (a.textContent = t ? `Pressed` : `Press me`));
});
