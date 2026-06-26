export type InteractionSource = 'keyboard' | 'pointer' | 'programmatic';

export type ToggleState = {
  pressed: boolean;
  disabled: boolean;
};

export type ToggleTransition = {
  changed: boolean;
  source: InteractionSource;
  state: ToggleState;
};

export type ToggleControllerOptions = {
  initialPressed?: boolean;
  disabled?: boolean;
  onChange?: (pressed: boolean, source: InteractionSource) => void;
};

export type ToggleController = {
  getState(): ToggleState;
  setDisabled(disabled: boolean): ToggleTransition;
  setPressed(pressed: boolean): ToggleTransition;
  press(source?: InteractionSource): ToggleTransition;
  subscribe(subscriber: (state: ToggleState) => void): () => void;
};

export function createToggleController(options: ToggleControllerOptions = {}): ToggleController {
  let state: ToggleState = {
    pressed: options.initialPressed ?? false,
    disabled: options.disabled ?? false,
  };

  const subscribers = new Set<(state: ToggleState) => void>();

  const emit = (): void => {
    for (const subscriber of subscribers) {
      subscriber(state);
    }
  };

  const commit = (
    next: ToggleState,
    source: InteractionSource,
    notifyChange: boolean,
  ): ToggleTransition => {
    const changed = next.pressed !== state.pressed || next.disabled !== state.disabled;

    if (!changed) {
      return {
        changed: false,
        source,
        state,
      };
    }

    const pressedChanged = next.pressed !== state.pressed;
    state = next;
    emit();

    if (notifyChange && pressedChanged) {
      options.onChange?.(state.pressed, source);
    }

    return {
      changed: true,
      source,
      state,
    };
  };

  return {
    getState(): ToggleState {
      return state;
    },

    setDisabled(disabled: boolean): ToggleTransition {
      return commit(
        {
          ...state,
          disabled,
        },
        'programmatic',
        false,
      );
    },

    setPressed(pressed: boolean): ToggleTransition {
      return commit(
        {
          ...state,
          pressed,
        },
        'programmatic',
        false,
      );
    },

    press(source: InteractionSource = 'programmatic'): ToggleTransition {
      if (state.disabled) {
        return {
          changed: false,
          source,
          state,
        };
      }

      return commit(
        {
          ...state,
          pressed: !state.pressed,
        },
        source,
        true,
      );
    },

    subscribe(subscriber: (state: ToggleState) => void): () => void {
      subscribers.add(subscriber);
      subscriber(state);

      return () => {
        subscribers.delete(subscriber);
      };
    },
  };
}
