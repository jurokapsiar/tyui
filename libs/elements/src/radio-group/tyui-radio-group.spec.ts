import { describe, expect, it, vi } from 'vitest';
import { TyuiRadioElement } from '../radio';
import { TyuiRadioGroupElement, type TyuiRadioGroupEvent } from './tyui-radio-group';

const radioTag = 'tyui-radio';
const groupTag = 'test-tyui-radio-group';

if (!customElements.get(radioTag)) {
  customElements.define(radioTag, TyuiRadioElement);
}

if (!customElements.get(groupTag)) {
  customElements.define(groupTag, TyuiRadioGroupElement);
}

function createRadio(value: string, label = value): TyuiRadioElement {
  const radio = document.createElement(radioTag) as TyuiRadioElement;
  radio.value = value;
  radio.textContent = label;
  return radio;
}

describe('TyuiRadioElement', () => {
  it('renders a native radio input outside the tab order by default', () => {
    const radio = createRadio('a', 'A');

    document.body.append(radio);

    const input = radio.shadowRoot?.querySelector('input');

    expect(input?.type).toBe('radio');
    expect(input?.tabIndex).toBe(-1);
    expect(radio.tabIndex).toBe(-1);

    radio.remove();
  });

  it('preserves parent-assigned roving tabindex when connected', () => {
    const radio = createRadio('a', 'A');

    radio.tabIndex = 0;
    document.body.append(radio);

    expect(radio.tabIndex).toBe(0);
    expect(radio.shadowRoot?.querySelector('input')?.tabIndex).toBe(0);

    radio.remove();
  });

  it('uses native label activation for standalone radio selection', () => {
    const radio = createRadio('a', 'A');

    document.body.append(radio);

    const label = radio.shadowRoot?.querySelector('[part="label"]') as HTMLElement | null;
    label?.click();

    expect(radio.shadowRoot?.querySelector('input')?.checked).toBe(true);
    expect(radio.checked).toBe(true);

    radio.remove();
  });
});

describe('TyuiRadioGroupElement', () => {
  it('sets radiogroup semantics and selects matching value', async () => {
    const group = document.createElement(groupTag) as TyuiRadioGroupElement;
    const radioA = createRadio('a', 'A');
    const radioB = createRadio('b', 'B');

    group.label = 'Pick one';
    group.value = 'b';
    group.append(radioA, radioB);
    document.body.append(group);
    await Promise.resolve();

    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(group.getAttribute('aria-labelledby')).toBeTruthy();
    expect(radioA.checked).toBe(false);
    expect(radioB.checked).toBe(true);
    expect(radioA.tabIndex).toBe(-1);
    expect(radioA.shadowRoot?.querySelector('input')?.tabIndex).toBe(-1);
    expect(radioB.tabIndex).toBe(0);
    expect(radioB.shadowRoot?.querySelector('input')?.tabIndex).toBe(0);

    group.remove();
  });

  it('makes the first enabled radio tabbable when no value is set', async () => {
    const group = document.createElement(groupTag) as TyuiRadioGroupElement;
    const disabled = createRadio('a', 'A');
    const enabled = createRadio('b', 'B');

    disabled.disabled = true;
    group.append(disabled, enabled);
    document.body.append(group);
    await Promise.resolve();

    expect(disabled.tabIndex).toBe(-1);
    expect(disabled.shadowRoot?.querySelector('input')?.tabIndex).toBe(-1);
    expect(enabled.tabIndex).toBe(0);
    expect(enabled.shadowRoot?.querySelector('input')?.tabIndex).toBe(0);

    group.remove();
  });

  it('click selection updates value and emits change detail', async () => {
    const group = document.createElement(groupTag) as TyuiRadioGroupElement;
    const radioA = createRadio('a', 'A');
    const radioB = createRadio('b', 'B');
    const onChange = vi.fn();

    group.append(radioA, radioB);
    group.addEventListener('change', onChange);
    document.body.append(group);
    await Promise.resolve();

    radioB.click();

    expect(group.value).toBe('b');
    expect(radioB.checked).toBe(true);
    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0]?.[0] as TyuiRadioGroupEvent)?.detail).toEqual({ value: 'b' });
    expect((onChange.mock.calls[0]?.[0] as Event)?.composed).toBe(true);

    group.remove();
  });

  it('does not emit change when programmatic value changes', async () => {
    const group = document.createElement(groupTag) as TyuiRadioGroupElement;
    const radioA = createRadio('a', 'A');
    const radioB = createRadio('b', 'B');
    const onChange = vi.fn();

    group.append(radioA, radioB);
    group.addEventListener('change', onChange);
    document.body.append(group);
    await Promise.resolve();

    group.value = 'b';

    expect(radioB.checked).toBe(true);
    expect(onChange).not.toHaveBeenCalled();

    group.remove();
  });

  it('arrow navigation wraps and skips disabled radios', async () => {
    const group = document.createElement(groupTag) as TyuiRadioGroupElement;
    const radioA = createRadio('a', 'A');
    const radioB = createRadio('b', 'B');
    const radioC = createRadio('c', 'C');

    radioB.disabled = true;
    group.value = 'a';
    group.append(radioA, radioB, radioC);
    document.body.append(group);
    await Promise.resolve();

    radioA.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }),
    );

    expect(group.value).toBe('c');
    expect(radioC.checked).toBe(true);
    expect(radioC.tabIndex).toBe(0);

    group.remove();
  });

  it('keeps selected group form state values in sync', async () => {
    const group = document.createElement(groupTag) as TyuiRadioGroupElement;

    group.name = 'choice';
    group.value = 'b';
    group.append(createRadio('a', 'A'), createRadio('b', 'B'));
    document.body.append(group);
    await Promise.resolve();

    expect(group.name).toBe('choice');
    expect(group.value).toBe('b');
    expect(group.checkValidity()).toBe(true);

    group.remove();
  });

  it('tracks required validity', () => {
    const group = document.createElement(groupTag) as TyuiRadioGroupElement;

    group.required = true;
    document.body.append(group);

    expect(group.checkValidity()).toBe(false);

    group.value = 'a';

    expect(group.checkValidity()).toBe(true);

    group.remove();
  });
});
