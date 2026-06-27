import { TyuiCheckboxElement } from '@tyui/elements/checkbox';

export const tyuiCheckboxTagName = 'tyui-checkbox';

export function defineTyuiCheckbox(): void {
  if (!customElements.get(tyuiCheckboxTagName)) {
    customElements.define(tyuiCheckboxTagName, TyuiCheckboxElement);
  }
}
