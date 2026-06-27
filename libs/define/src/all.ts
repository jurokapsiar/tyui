import { defineTyuiButton } from './button';
import { defineTyuiCheckbox } from './checkbox';
import { defineTyuiInput } from './input';
import { defineTyuiRadio } from './radio';
import { defineTyuiRadioGroup } from './radio-group';

export function defineTyuiElements(): void {
  defineTyuiButton();
  defineTyuiCheckbox();
  defineTyuiInput();
  defineTyuiRadio();
  defineTyuiRadioGroup();
}
