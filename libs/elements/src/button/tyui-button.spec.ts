import { describe, expect, it } from 'vitest';
import { TyuiButtonElement } from './tyui-button';

const tagName = 'test-tyui-button';

if (!customElements.get(tagName)) {
  customElements.define(tagName, TyuiButtonElement);
}

describe('TyuiButtonElement', () => {
  it('applies spec defaults', () => {
    const element = document.createElement(tagName) as TyuiButtonElement;

    document.body.append(element);

    const button = element.shadowRoot?.querySelector('button');

    expect(element.appearance).toBe('default');
    expect(element.size).toBe('medium');
    expect(element.shape).toBe('rounded');
    expect(element.iconPosition).toBe('before');
    expect(element.type).toBe('button');
    expect(button?.type).toBe('button');

    element.remove();
  });

  it('reflects disabled state to the internal button', () => {
    const element = document.createElement(tagName) as TyuiButtonElement;
    element.disabled = true;

    document.body.append(element);

    const button = element.shadowRoot?.querySelector('button');

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect((button as HTMLButtonElement).disabled).toBe(true);

    element.remove();
  });

  it('supports focusable disabled commands without firing click', () => {
    const element = document.createElement(tagName) as TyuiButtonElement;
    let clicks = 0;

    element.disabledFocusable = true;
    element.addEventListener('click', () => clicks++);

    document.body.append(element);

    element.shadowRoot?.querySelector('button')?.click();

    expect(element.shadowRoot?.querySelector('button')?.getAttribute('aria-disabled')).toBe('true');
    expect(clicks).toBe(0);

    element.remove();
  });

  it('marks icon-only buttons when only an icon slot is provided', async () => {
    const element = document.createElement(tagName) as TyuiButtonElement;
    const icon = document.createElement('span');

    icon.slot = 'icon';
    element.append(icon);

    document.body.append(element);
    await Promise.resolve();

    expect(element.shadowRoot?.querySelector('button')?.hasAttribute('data-icon-only')).toBe(true);

    element.remove();
  });
});
