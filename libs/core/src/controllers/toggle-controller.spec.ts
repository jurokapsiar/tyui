import { describe, expect, it, vi } from 'vitest';
import { createToggleController } from './toggle-controller';

describe('createToggleController', () => {
  it('toggles pressed state and emits changes', () => {
    const onChange = vi.fn();
    const controller = createToggleController({ onChange });

    const transition = controller.press('keyboard');

    expect(transition.changed).toBe(true);
    expect(transition.state.pressed).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true, 'keyboard');
  });

  it('does not toggle when disabled', () => {
    const onChange = vi.fn();
    const controller = createToggleController({
      disabled: true,
      onChange,
    });

    const transition = controller.press('pointer');

    expect(transition.changed).toBe(false);
    expect(transition.state.pressed).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });
});
