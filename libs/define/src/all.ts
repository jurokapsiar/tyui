import { defineTyuiButton } from './button';
import { defineTyuiCenter } from './center';
import { defineTyuiCheckbox } from './checkbox';
import { defineTyuiCluster } from './cluster';
import { defineTyuiContainer } from './container';
import { defineTyuiFlex } from './flex';
import { defineTyuiFrame } from './frame';
import { defineTyuiGrid } from './grid';
import { defineTyuiInput } from './input';
import { defineTyuiRadio } from './radio';
import { defineTyuiRadioGroup } from './radio-group';
import { defineTyuiSidebar } from './sidebar';

export function defineTyuiElements(): void {
  defineTyuiButton();
  defineTyuiCenter();
  defineTyuiCheckbox();
  defineTyuiCluster();
  defineTyuiContainer();
  defineTyuiFlex();
  defineTyuiFrame();
  defineTyuiGrid();
  defineTyuiInput();
  defineTyuiRadio();
  defineTyuiRadioGroup();
  defineTyuiSidebar();
}
