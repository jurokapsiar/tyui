import { TyuiInputElement } from '@tyui/elements/input';

export const tyuiInputTagName = 'tyui-input';

export function defineTyuiInput(): void {
  if (!customElements.get(tyuiInputTagName)) {
    customElements.define(tyuiInputTagName, TyuiInputElement);
  }
}
