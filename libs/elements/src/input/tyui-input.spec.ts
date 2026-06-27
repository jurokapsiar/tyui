import { describe, expect, it } from 'vitest';
import { TyuiInputElement, type TyuiInputEvent } from './tyui-input';

const tagName = 'test-tyui-input';

if (!customElements.get(tagName)) {
  customElements.define(tagName, TyuiInputElement);
}

describe('TyuiInputElement', () => {
  it('applies spec defaults and syncs the internal input', () => {
    const element = document.createElement(tagName) as TyuiInputElement;

    element.name = 'email';
    element.placeholder = 'name@example.com';
    element.value = 'hello@example.com';
    document.body.append(element);

    const input = element.shadowRoot?.querySelector('input');

    expect(element.appearance).toBe('outline');
    expect(element.size).toBe('medium');
    expect(element.type).toBe('text');
    expect(input?.placeholder).toBe('name@example.com');
    expect(input?.value).toBe('hello@example.com');

    element.remove();
  });

  it('uses defaultValue only for the initial value', () => {
    const element = document.createElement(tagName) as TyuiInputElement;

    element.defaultValue = 'initial';
    document.body.append(element);
    element.defaultValue = 'next';

    expect(element.value).toBe('initial');

    element.remove();
  });

  it('emits composed input events with value detail', () => {
    const element = document.createElement(tagName) as TyuiInputElement;
    const events: TyuiInputEvent[] = [];

    element.addEventListener('input', (event) => events.push(event as unknown as TyuiInputEvent));
    document.body.append(element);

    const input = element.shadowRoot?.querySelector('input');
    if (!input) throw new Error('Missing inner input.');

    input.value = 'typed';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(element.value).toBe('typed');
    expect(events).toHaveLength(1);
    expect(events[0]?.detail).toEqual({ value: 'typed' });
    expect(events[0]?.composed).toBe(true);

    element.remove();
  });

  it('reflects required validation into invalid state', () => {
    const element = document.createElement(tagName) as TyuiInputElement;

    element.required = true;
    document.body.append(element);

    expect(element.invalid).toBe(true);

    element.value = 'resolved';

    expect(element.invalid).toBe(false);

    element.remove();
  });
});
