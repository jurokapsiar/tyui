import { TyuiRadioGroupElement } from '@tyui/elements/radio-group';

export const tyuiRadioGroupTagName = 'tyui-radio-group';

export function defineTyuiRadioGroup(): void {
  if (!customElements.get(tyuiRadioGroupTagName)) {
    customElements.define(tyuiRadioGroupTagName, TyuiRadioGroupElement);
  }
}
