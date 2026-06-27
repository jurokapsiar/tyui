import { TyuiRadioElement } from '@tyui/elements/radio';

export const tyuiRadioTagName = 'tyui-radio';

export function defineTyuiRadio(): void {
  if (!customElements.get(tyuiRadioTagName)) {
    customElements.define(tyuiRadioTagName, TyuiRadioElement);
  }
}
