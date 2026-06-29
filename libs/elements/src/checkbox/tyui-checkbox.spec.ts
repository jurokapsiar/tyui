import { describe, expect, it, vi } from 'vitest';
import { TyuiCheckboxElement } from './tyui-checkbox';

const tagName = 'test-tyui-checkbox';

if (!customElements.get(tagName)) {
  customElements.define(tagName, TyuiCheckboxElement);
}

describe('TyuiCheckboxElement', () => {
  it('renders a native checkbox and is tabbable by default', () => {
    const element = document.createElement(tagName) as TyuiCheckboxElement;

    document.body.append(element);

    const input = element.shadowRoot?.querySelector('input');

    expect(input?.type).toBe('checkbox');
    expect(input?.checked).toBe(false);
    expect(element.tabIndex).toBe(0);

    element.remove();
  });

  it('exposes only the documented public styling parts', () => {
    const element = document.createElement(tagName) as TyuiCheckboxElement;

    document.body.append(element);

    const parts = Array.from(element.shadowRoot?.querySelectorAll('[part]') ?? []).flatMap((node) =>
      (node.getAttribute('part') ?? '').split(/\s+/).filter(Boolean),
    );

    expect(parts.sort()).toEqual(['box', 'control', 'label']);
    expect(element.shadowRoot?.querySelector('[part="root"]')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part="input"]')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part="mark"]')).toBeNull();
    expect(element.shadowRoot?.querySelector('[data-ty-checkbox-mark]')).not.toBeNull();

    element.remove();
  });

  it('toggles on host click and emits a composed change event', () => {
    const element = document.createElement(tagName) as TyuiCheckboxElement;
    const onChange = vi.fn();

    element.addEventListener('change', onChange);
    document.body.append(element);

    element.click();

    expect(element.checked).toBe(true);
    expect(element.shadowRoot?.querySelector('input')?.checked).toBe(true);
    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0]?.[0] as Event).composed).toBe(true);

    element.remove();
  });

  it('clears indeterminate when toggled by the user', () => {
    const element = document.createElement(tagName) as TyuiCheckboxElement;

    element.indeterminate = true;
    document.body.append(element);

    element.click();

    expect(element.indeterminate).toBe(false);
    expect(element.checked).toBe(true);

    element.remove();
  });

  it('does not toggle when disabled', () => {
    const element = document.createElement(tagName) as TyuiCheckboxElement;

    element.disabled = true;
    document.body.append(element);
    element.click();

    expect(element.checked).toBe(false);
    expect(element.shadowRoot?.querySelector('input')?.disabled).toBe(true);
    expect(element.tabIndex).toBe(-1);

    element.remove();
  });

  it('sets form value state for checked and unchecked values', () => {
    const element = document.createElement(tagName) as TyuiCheckboxElement;

    element.name = 'terms';
    element.checked = true;
    document.body.append(element);

    expect(element.name).toBe('terms');
    expect(element.value).toBe('on');
    expect(element.checkValidity()).toBe(true);
    element.checked = false;

    expect(element.checked).toBe(false);

    element.remove();
  });

  it('tracks required validity', () => {
    const element = document.createElement(tagName) as TyuiCheckboxElement;

    element.required = true;
    document.body.append(element);

    expect(element.checkValidity()).toBe(false);

    element.checked = true;

    expect(element.checkValidity()).toBe(true);

    element.remove();
  });
});
