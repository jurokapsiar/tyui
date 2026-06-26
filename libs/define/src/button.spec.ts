import { describe, expect, it } from 'vitest';
import { defineTyuiButton, tyuiButtonTagName } from './button';

describe('defineTyuiButton', () => {
  it('registers tyui-button once', () => {
    defineTyuiButton();
    defineTyuiButton();

    expect(customElements.get(tyuiButtonTagName)).toBeDefined();
  });
});
