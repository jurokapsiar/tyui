import { TyuiButtonElement as e } from '@tyui/elements/button';
//#region src/button.ts
var t = 'tyui-button';
function n() {
  customElements.get('tyui-button') || customElements.define(t, e);
}
//#endregion
export { n as defineTyuiButton, t as tyuiButtonTagName };
