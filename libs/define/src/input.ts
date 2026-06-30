import { TyuiInputElement } from '@toyu-ui/elements/input';

export const tyuiInputTagName = 'tyui-input';

export function defineTyuiInput(): void {
  if (!customElements.get(tyuiInputTagName)) {
    customElements.define(tyuiInputTagName, TyuiInputElement);
  }
}
