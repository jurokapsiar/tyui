import type { JSX } from 'solid-js';
import type {
  TyuiButtonAppearance,
  TyuiButtonElement,
  TyuiButtonIconPosition,
  TyuiButtonShape,
  TyuiButtonSize,
  TyuiButtonType,
} from '@toyu-ui/elements/button';
import type { TyuiCenterElement, TyuiCenterGutter } from '@toyu-ui/elements/center';
import type { TyuiCheckboxElement } from '@toyu-ui/elements/checkbox';
import type {
  TyuiClusterAlign,
  TyuiClusterElement,
  TyuiClusterJustify,
} from '@toyu-ui/elements/cluster';
import type {
  TyuiContainerElement,
  TyuiContainerGutter,
  TyuiContainerSize,
} from '@toyu-ui/elements/container';
import type {
  TyuiFlexAlign,
  TyuiFlexDirection,
  TyuiFlexElement,
  TyuiFlexJustify,
  TyuiFlexWrap,
} from '@toyu-ui/elements/flex';
import type { TyuiFrameElement, TyuiFrameFit } from '@toyu-ui/elements/frame';
import type { TyuiGridAlign, TyuiGridElement, TyuiGridJustify } from '@toyu-ui/elements/grid';
import type {
  TyuiInputAppearance,
  TyuiInputElement,
  TyuiInputEvent,
  TyuiInputSize,
  TyuiInputType,
} from '@toyu-ui/elements/input';
import type { TyuiRadioElement, TyuiRadioLabelPosition } from '@toyu-ui/elements/radio';
import type {
  TyuiRadioGroupElement,
  TyuiRadioGroupEvent,
  TyuiRadioGroupLayout,
} from '@toyu-ui/elements/radio-group';
import type { TyuiSidebarElement, TyuiSidebarSide } from '@toyu-ui/elements/sidebar';

export type TyuiButtonSolidAttributes = JSX.HTMLAttributes<TyuiButtonElement> & {
  appearance?: TyuiButtonAppearance | undefined;
  disabled?: boolean | undefined;
  disabledFocusable?: boolean | undefined;
  'disabled-focusable'?: boolean | undefined;
  iconPosition?: TyuiButtonIconPosition | undefined;
  'icon-position'?: TyuiButtonIconPosition | undefined;
  shape?: TyuiButtonShape | undefined;
  size?: TyuiButtonSize | undefined;
  type?: TyuiButtonType | undefined;
  children?: JSX.Element | undefined;
};

type TyuiInputBaseAttributes = Omit<
  JSX.HTMLAttributes<TyuiInputElement>,
  'onInput' | 'on:input' | 'onChange' | 'on:change'
>;

export type TyuiInputSolidAttributes = TyuiInputBaseAttributes & {
  appearance?: TyuiInputAppearance | undefined;
  defaultValue?: string | undefined;
  'default-value'?: string | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  size?: TyuiInputSize | undefined;
  type?: TyuiInputType | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
  'on:input'?: ((event: TyuiInputEvent) => void) | undefined;
  'on:change'?: ((event: Event) => void) | undefined;
};

type TyuiCheckboxBaseAttributes = Omit<
  JSX.HTMLAttributes<TyuiCheckboxElement>,
  'onChange' | 'on:change'
>;

export type TyuiCheckboxSolidAttributes = TyuiCheckboxBaseAttributes & {
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  indeterminate?: boolean | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
  'on:change'?: ((event: Event) => void) | undefined;
};

export type TyuiRadioSolidAttributes = JSX.HTMLAttributes<TyuiRadioElement> & {
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  labelPosition?: TyuiRadioLabelPosition | undefined;
  'label-position'?: TyuiRadioLabelPosition | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
};

type TyuiRadioGroupBaseAttributes = Omit<
  JSX.HTMLAttributes<TyuiRadioGroupElement>,
  'onChange' | 'on:change'
>;

export type TyuiRadioGroupSolidAttributes = TyuiRadioGroupBaseAttributes & {
  disabled?: boolean | undefined;
  label?: string | undefined;
  layout?: TyuiRadioGroupLayout | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  value?: string | undefined;
  children?: JSX.Element | undefined;
  'on:change'?: ((event: TyuiRadioGroupEvent) => void) | undefined;
};

export type TyuiFlexSolidAttributes = JSX.HTMLAttributes<TyuiFlexElement> & {
  direction?: TyuiFlexDirection | undefined;
  wrap?: TyuiFlexWrap | undefined;
  align?: TyuiFlexAlign | undefined;
  justify?: TyuiFlexJustify | undefined;
  gap?: '0' | '1' | '2' | '3' | '4' | undefined;
  inline?: boolean | undefined;
  children?: JSX.Element | undefined;
};

export type TyuiClusterSolidAttributes = JSX.HTMLAttributes<TyuiClusterElement> & {
  align?: TyuiClusterAlign | undefined;
  justify?: TyuiClusterJustify | undefined;
  gap?: '0' | '1' | '2' | '3' | '4' | undefined;
  rowGap?: '0' | '1' | '2' | '3' | '4' | undefined;
  'row-gap'?: '0' | '1' | '2' | '3' | '4' | undefined;
  children?: JSX.Element | undefined;
};

export type TyuiGridSolidAttributes = JSX.HTMLAttributes<TyuiGridElement> & {
  minItemSize?: string | undefined;
  'min-item-size'?: string | undefined;
  gap?: '0' | '1' | '2' | '3' | '4' | undefined;
  rowGap?: '0' | '1' | '2' | '3' | '4' | undefined;
  'row-gap'?: '0' | '1' | '2' | '3' | '4' | undefined;
  align?: TyuiGridAlign | undefined;
  justify?: TyuiGridJustify | undefined;
  dense?: boolean | undefined;
  children?: JSX.Element | undefined;
};

export type TyuiCenterSolidAttributes = JSX.HTMLAttributes<TyuiCenterElement> & {
  measure?: string | undefined;
  gutter?: TyuiCenterGutter | undefined;
  intrinsic?: boolean | undefined;
  children?: JSX.Element | undefined;
};

export type TyuiContainerSolidAttributes = JSX.HTMLAttributes<TyuiContainerElement> & {
  size?: TyuiContainerSize | undefined;
  gutter?: TyuiContainerGutter | undefined;
  bleed?: boolean | undefined;
  children?: JSX.Element | undefined;
};

export type TyuiFrameSolidAttributes = JSX.HTMLAttributes<TyuiFrameElement> & {
  ratio?: string | undefined;
  fit?: TyuiFrameFit | undefined;
  position?: string | undefined;
  children?: JSX.Element | undefined;
};

export type TyuiSidebarSolidAttributes = JSX.HTMLAttributes<TyuiSidebarElement> & {
  side?: TyuiSidebarSide | undefined;
  sideSize?: string | undefined;
  'side-size'?: string | undefined;
  contentMin?: string | undefined;
  'content-min'?: string | undefined;
  gap?: '0' | '1' | '2' | '3' | '4' | undefined;
  noStretch?: boolean | undefined;
  'no-stretch'?: boolean | undefined;
  children?: JSX.Element | undefined;
};

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'tyui-button': TyuiButtonSolidAttributes;
      'tyui-center': TyuiCenterSolidAttributes;
      'tyui-checkbox': TyuiCheckboxSolidAttributes;
      'tyui-cluster': TyuiClusterSolidAttributes;
      'tyui-container': TyuiContainerSolidAttributes;
      'tyui-flex': TyuiFlexSolidAttributes;
      'tyui-frame': TyuiFrameSolidAttributes;
      'tyui-grid': TyuiGridSolidAttributes;
      'tyui-input': TyuiInputSolidAttributes;
      'tyui-radio': TyuiRadioSolidAttributes;
      'tyui-radio-group': TyuiRadioGroupSolidAttributes;
      'tyui-sidebar': TyuiSidebarSolidAttributes;
    }
  }
}
