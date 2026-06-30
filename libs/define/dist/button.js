import { TyuiButtonElement as e } from "@toyu-ui/elements/button";
const t = "tyui-button";
function o() {
  customElements.get(t) || customElements.define(t, e);
}
export {
  o as defineTyuiButton,
  t as tyuiButtonTagName
};
