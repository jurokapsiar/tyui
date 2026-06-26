import { describe, expect, it } from 'vitest';
import { TyuiButtonElement, type TyuiButtonActivateEvent } from './tyui-button';

const tagName = 'test-tyui-button';

if (!customElements.get(tagName)) {
  customElements.define(tagName, TyuiButtonElement);
}

describe('TyuiButtonElement', () => {
  it('reflects disabled state to the internal button', () => {
    const element = document.createElement(tagName) as TyuiButtonElement;
    element.disabled = true;

    document.body.append(element);

    const button = element.shadowRoot?.querySelector('button');

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect((button as HTMLButtonElement).disabled).toBe(true);

    element.remove();
  });

  it('emits activate with pressed state', () => {
    const element = document.createElement(tagName) as TyuiButtonElement;
    const events: TyuiButtonActivateEvent[] = [];

    element.addEventListener('activate', (event) => {
      events.push(event as TyuiButtonActivateEvent);
    });

    document.body.append(element);

    element.shadowRoot?.querySelector('button')?.click();

    expect(element.pressed).toBe(true);
    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toEqual({
      pressed: true,
      source: 'keyboard',
    });

    element.remove();
  });
});
