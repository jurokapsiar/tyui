import { defineTyuiElements } from '@toyu-ui/define';

defineTyuiElements();

await Promise.all([
  customElements.whenDefined('tyui-button'),
  customElements.whenDefined('tyui-radio'),
  customElements.whenDefined('tyui-radio-group'),
]);

window.dispatchEvent(new Event('tyui-fixture-ready'));
