import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { resolveProjectPaths } from '../shared/workspace-paths';

type ComponentManifest = {
  tagName: string;
  className: string;
  modulePath: string;
  summary: string;
  attributes: Array<{ name: string; type: string; default?: string; description: string }>;
  properties: Array<{ name: string; type: string; attribute?: string; description: string }>;
  events: Array<{ name: string; type: string; description: string }>;
  slots: Array<{ name: string; description: string }>;
  cssParts: Array<{ name: string; description: string }>;
  cssProperties: Array<{ name: string; default?: string; description: string }>;
  design: {
    intent: string;
    pattern: string;
    layoutOwnership: string;
    accessibility: string[];
    misuse: string[];
  };
};

const components: ComponentManifest[] = [
  {
    tagName: 'tyui-button',
    className: 'TyuiButtonElement',
    modulePath: './src/button/tyui-button.ts',
    summary: 'Native custom element button for immediate actions.',
    attributes: [
      {
        name: 'appearance',
        type: 'default | secondary | primary | outline | subtle | transparent',
        default: 'default',
        description: 'Visual emphasis.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the native button.',
      },
      {
        name: 'disabled-focusable',
        type: 'boolean',
        default: 'false',
        description: 'Keeps the button focusable while suppressing activation.',
      },
      {
        name: 'icon-position',
        type: 'before | after',
        default: 'before',
        description: 'Places slotted icon before or after text.',
      },
      {
        name: 'shape',
        type: 'rounded | circular | square',
        default: 'rounded',
        description: 'Control corner treatment.',
      },
      {
        name: 'size',
        type: 'small | medium | large',
        default: 'medium',
        description: 'Control density.',
      },
      {
        name: 'type',
        type: 'button | submit | reset',
        default: 'button',
        description: 'Native button type.',
      },
    ],
    properties: [
      {
        name: 'appearance',
        type: 'TyuiButtonAppearance',
        attribute: 'appearance',
        description: 'Reflected visual emphasis.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        attribute: 'disabled',
        description: 'Reflected disabled state.',
      },
      {
        name: 'disabledFocusable',
        type: 'boolean',
        attribute: 'disabled-focusable',
        description: 'Focusable disabled state.',
      },
      {
        name: 'type',
        type: 'TyuiButtonType',
        attribute: 'type',
        description: 'Native button type.',
      },
    ],
    events: [
      {
        name: 'click',
        type: 'MouseEvent',
        description: 'Native composed click from the internal button.',
      },
    ],
    slots: [
      { name: 'default', description: 'Button label.' },
      { name: 'icon', description: 'Decorative or named icon.' },
    ],
    cssParts: [
      { name: 'control', description: 'Internal native button.' },
      { name: 'label', description: 'Label wrapper.' },
    ],
    cssProperties: [
      { name: '--ty-button-background', description: 'Resting background.' },
      { name: '--ty-button-foreground', description: 'Text color.' },
      { name: '--ty-button-border-color', description: 'Border color.' },
      { name: '--ty-button-radius', description: 'Corner radius.' },
    ],
    design: {
      intent: 'Trigger an immediate in-page action.',
      pattern: 'Native button',
      layoutOwnership:
        'Component owns internal padding and icon-label gap; parent owns width and placement.',
      accessibility: [
        'Use a button for actions, not navigation.',
        'Icon-only buttons require an accessible name.',
      ],
      misuse: [
        'Do not use for navigation.',
        'Do not place interactive controls inside the label slot.',
      ],
    },
  },
  {
    tagName: 'tyui-input',
    className: 'TyuiInputElement',
    modulePath: './src/input/tyui-input.ts',
    summary: 'Form-associated single-line text input.',
    attributes: [
      {
        name: 'appearance',
        type: 'outline | filled-darker | filled-lighter',
        default: 'outline',
        description: 'Base field style.',
      },
      {
        name: 'default-value',
        type: 'string',
        default: '',
        description: 'Initial uncontrolled value.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the native input.',
      },
      {
        name: 'invalid',
        type: 'boolean',
        default: 'false',
        description: 'Reflects invalid visual/ARIA state.',
      },
      { name: 'name', type: 'string', default: '', description: 'Form field name.' },
      {
        name: 'placeholder',
        type: 'string',
        default: '',
        description: 'Native placeholder, not a label.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        description: 'Forwards native readOnly.',
      },
      {
        name: 'required',
        type: 'boolean',
        default: 'false',
        description: 'Participates in validity.',
      },
      {
        name: 'size',
        type: 'small | medium | large',
        default: 'medium',
        description: 'Control density.',
      },
      {
        name: 'type',
        type: 'text | email | password | search | tel | url | number',
        default: 'text',
        description: 'Supported native input type.',
      },
      { name: 'value', type: 'string', default: '', description: 'Current value.' },
    ],
    properties: [
      {
        name: 'value',
        type: 'string',
        attribute: 'value',
        description: 'Updates internal input and form value.',
      },
      {
        name: 'defaultValue',
        type: 'string',
        attribute: 'default-value',
        description: 'Seeds initial value once.',
      },
      {
        name: 'invalid',
        type: 'boolean',
        attribute: 'invalid',
        description: 'Reflected invalid state.',
      },
    ],
    events: [
      {
        name: 'input',
        type: 'CustomEvent<{ value: string }>',
        description: 'User text input after host value updates.',
      },
      { name: 'change', type: 'Event', description: 'Native change re-dispatched from host.' },
    ],
    slots: [
      { name: 'contentBefore', description: 'Decorative content before text.' },
      { name: 'contentAfter', description: 'Decorative content after text.' },
    ],
    cssParts: [
      { name: 'control', description: 'Input surface wrapper.' },
      { name: 'input', description: 'Internal native input.' },
      { name: 'content-before', description: 'Before slot wrapper.' },
      { name: 'content-after', description: 'After slot wrapper.' },
    ],
    cssProperties: [
      { name: '--ty-input-background', description: 'Resting field background.' },
      { name: '--ty-input-border-color', description: 'Resting border.' },
      { name: '--ty-input-focus-indicator-color', description: 'Focus indicator color.' },
    ],
    design: {
      intent: 'Capture short single-line text.',
      pattern: 'Native input',
      layoutOwnership:
        'Component owns internal padding, gap, and native input; field wrapper owns label and messages.',
      accessibility: [
        'Requires a visible label or accessible name.',
        'Placeholder is not a label.',
      ],
      misuse: [
        'Do not put focusable controls in content slots.',
        'Use combobox/search components for popups or clear buttons.',
      ],
    },
  },
  {
    tagName: 'tyui-checkbox',
    className: 'TyuiCheckboxElement',
    modulePath: './src/checkbox/tyui-checkbox.ts',
    summary: 'Native checkbox custom element.',
    attributes: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Checked state.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state.' },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'Mixed visual state.',
      },
      { name: 'value', type: 'string', default: 'on', description: 'Submitted value.' },
    ],
    properties: [
      {
        name: 'checked',
        type: 'boolean',
        attribute: 'checked',
        description: 'Reflected checked state.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        attribute: 'indeterminate',
        description: 'Reflected mixed state.',
      },
    ],
    events: [
      {
        name: 'change',
        type: 'CustomEvent<{ checked: boolean }>',
        description: 'User change event.',
      },
    ],
    slots: [{ name: 'default', description: 'Checkbox label.' }],
    cssParts: [
      { name: 'control', description: 'Native input.' },
      { name: 'box', description: 'Visual box.' },
      { name: 'label', description: 'Label wrapper.' },
    ],
    cssProperties: [{ name: '--ty-checkbox-size', description: 'Checkbox visual size.' }],
    design: {
      intent: 'Toggle an independent boolean choice.',
      pattern: 'Native checkbox',
      layoutOwnership: 'Component owns indicator/label gap; parent owns grouping.',
      accessibility: ['Use for independent choices.', 'Use radio for mutually exclusive choices.'],
      misuse: ['Do not use checkbox as a command button.'],
    },
  },
  {
    tagName: 'tyui-radio',
    className: 'TyuiRadioElement',
    modulePath: './src/radio/tyui-radio.ts',
    summary: 'Radio option used inside tyui-radio-group.',
    attributes: [
      {
        name: 'checked',
        type: 'boolean',
        default: 'false',
        description: 'Checked state controlled by group.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state.' },
      { name: 'value', type: 'string', default: '', description: 'Option value.' },
    ],
    properties: [
      { name: 'value', type: 'string', attribute: 'value', description: 'Option value.' },
    ],
    events: [
      { name: 'change', type: 'Event', description: 'Native input change reflected to host.' },
    ],
    slots: [{ name: 'default', description: 'Radio label.' }],
    cssParts: [
      { name: 'root', description: 'Label root.' },
      { name: 'input', description: 'Native radio input.' },
      { name: 'circle', description: 'Visual circle.' },
      { name: 'dot', description: 'Selected dot.' },
      { name: 'label', description: 'Label wrapper.' },
    ],
    cssProperties: [{ name: '--ty-radio-checked-color', description: 'Selected fill and border.' }],
    design: {
      intent: 'Represent one option in a mutually exclusive set.',
      pattern: 'Native radio',
      layoutOwnership:
        'Radio owns native input and indicator; radio group owns value and roving tabindex.',
      accessibility: ['Use inside tyui-radio-group for coordinated keyboard behavior.'],
      misuse: ['Do not use standalone radios for unrelated boolean choices.'],
    },
  },
  {
    tagName: 'tyui-radio-group',
    className: 'TyuiRadioGroupElement',
    modulePath: './src/radio-group/tyui-radio-group.ts',
    summary: 'Form-associated radio group coordinating tyui-radio children.',
    attributes: [
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the group.' },
      { name: 'label', type: 'string', default: '', description: 'Group label text.' },
      {
        name: 'layout',
        type: 'vertical | horizontal | horizontal-stacked',
        default: 'vertical',
        description: 'Child layout.',
      },
      { name: 'name', type: 'string', default: '', description: 'Form field name.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Requires selection.' },
      { name: 'value', type: 'string', default: '', description: 'Selected radio value.' },
    ],
    properties: [
      { name: 'value', type: 'string', attribute: 'value', description: 'Selected value.' },
    ],
    events: [
      {
        name: 'change',
        type: 'CustomEvent<{ value: string }>',
        description: 'User selection change.',
      },
    ],
    slots: [{ name: 'default', description: 'tyui-radio children.' }],
    cssParts: [
      { name: 'label', description: 'Group label.' },
      { name: 'items', description: 'Radio item container.' },
    ],
    cssProperties: [{ name: '--ty-radio-group-gap', description: 'Gap between radio items.' }],
    design: {
      intent: 'Select one option from a small set.',
      pattern: 'ARIA radiogroup with native radio children',
      layoutOwnership: 'Group owns child layout, value, roving tabindex, and form state.',
      accessibility: ['Tab enters one active radio.', 'Arrow keys move focus and selection.'],
      misuse: ['Do not put non-radio interactive controls in the default slot.'],
    },
  },
  {
    tagName: 'tyui-flex',
    className: 'TyuiFlexElement',
    modulePath: './src/flex/tyui-flex.ts',
    summary: 'Light-DOM flex layout primitive.',
    attributes: [
      {
        name: 'direction',
        type: 'row | row-reverse | column | column-reverse',
        default: 'row',
        description: 'Flex direction.',
      },
      {
        name: 'wrap',
        type: 'nowrap | wrap | wrap-reverse',
        default: 'nowrap',
        description: 'Flex wrapping.',
      },
      {
        name: 'align',
        type: 'stretch | start | center | end | baseline',
        default: 'stretch',
        description: 'Cross-axis alignment.',
      },
      {
        name: 'justify',
        type: 'start | center | end | between | around | evenly',
        default: 'start',
        description: 'Main-axis distribution.',
      },
      {
        name: 'gap',
        type: '0 | 1 | 2 | 3 | 4',
        default: '3',
        description: 'Spacing token used for row and column gap.',
      },
      {
        name: 'inline',
        type: 'boolean',
        default: 'false',
        description: 'Uses inline-flex display.',
      },
    ],
    properties: [
      {
        name: 'direction',
        type: 'TyuiFlexDirection',
        attribute: 'direction',
        description: 'Reflected flex direction.',
      },
      {
        name: 'wrap',
        type: 'TyuiFlexWrap',
        attribute: 'wrap',
        description: 'Reflected wrapping mode.',
      },
      {
        name: 'align',
        type: 'TyuiFlexAlign',
        attribute: 'align',
        description: 'Reflected cross-axis alignment.',
      },
      {
        name: 'justify',
        type: 'TyuiFlexJustify',
        attribute: 'justify',
        description: 'Reflected main-axis distribution.',
      },
      { name: 'gap', type: 'string', attribute: 'gap', description: 'Reflected spacing token.' },
      {
        name: 'inline',
        type: 'boolean',
        attribute: 'inline',
        description: 'Reflected inline display flag.',
      },
    ],
    events: [],
    slots: [{ name: 'default', description: 'Laid-out children.' }],
    cssParts: [],
    cssProperties: [
      {
        name: '--ty-flex-display',
        description: 'Display value used by the shared layout stylesheet.',
      },
      { name: '--ty-flex-direction', description: 'Mapped flex-direction.' },
      { name: '--ty-flex-wrap', description: 'Mapped flex-wrap.' },
      { name: '--ty-flex-align', description: 'Mapped align-items.' },
      { name: '--ty-flex-justify', description: 'Mapped justify-content.' },
      { name: '--ty-flex-gap', description: 'Mapped gap.' },
    ],
    design: {
      intent: 'Arrange children along one axis.',
      pattern: 'Intrinsic flex layout primitive',
      layoutOwnership:
        'Parent owns child placement; children keep intrinsic sizing unless CSS changes it.',
      accessibility: ['Preserves DOM order and does not set roles.'],
      misuse: ['Do not use for data grids or tabular relationships.'],
    },
  },
  {
    tagName: 'tyui-cluster',
    className: 'TyuiClusterElement',
    modulePath: './src/cluster/tyui-cluster.ts',
    summary: 'Wrapping inline cluster layout primitive.',
    attributes: [
      {
        name: 'align',
        type: 'start | center | end | baseline | stretch',
        default: 'center',
        description: 'Cross-axis alignment.',
      },
      {
        name: 'justify',
        type: 'start | center | end | between',
        default: 'start',
        description: 'Main-axis distribution.',
      },
      {
        name: 'gap',
        type: '0 | 1 | 2 | 3 | 4',
        default: '2',
        description: 'Inline spacing token.',
      },
      { name: 'row-gap', type: '0 | 1 | 2 | 3 | 4', description: 'Optional row spacing token.' },
    ],
    properties: [
      {
        name: 'align',
        type: 'TyuiClusterAlign',
        attribute: 'align',
        description: 'Reflected cross-axis alignment.',
      },
      {
        name: 'justify',
        type: 'TyuiClusterJustify',
        attribute: 'justify',
        description: 'Reflected main-axis distribution.',
      },
      {
        name: 'gap',
        type: 'string',
        attribute: 'gap',
        description: 'Reflected inline spacing token.',
      },
      {
        name: 'rowGap',
        type: 'string | null',
        attribute: 'row-gap',
        description: 'Reflected row spacing token.',
      },
    ],
    events: [],
    slots: [{ name: 'default', description: 'Wrapping children.' }],
    cssParts: [],
    cssProperties: [
      { name: '--ty-cluster-align', description: 'Mapped align-items.' },
      { name: '--ty-cluster-justify', description: 'Mapped justify-content.' },
      { name: '--ty-cluster-gap', description: 'Mapped column gap.' },
      { name: '--ty-cluster-row-gap', description: 'Mapped row gap.' },
    ],
    design: {
      intent: 'Wrap small peer controls or chips across lines.',
      pattern: 'Intrinsic cluster layout primitive',
      layoutOwnership: 'Parent owns wrapping, gaps, and alignment; children keep their own width.',
      accessibility: ['Preserves DOM order and does not set roles.'],
      misuse: ['Do not use as a radio group or toolbar behavior primitive.'],
    },
  },
  {
    tagName: 'tyui-grid',
    className: 'TyuiGridElement',
    modulePath: './src/grid/tyui-grid.ts',
    summary: 'Responsive auto-fit grid layout primitive.',
    attributes: [
      {
        name: 'min-item-size',
        type: 'string',
        default: '16rem',
        description: 'Minimum grid track size.',
      },
      {
        name: 'gap',
        type: '0 | 1 | 2 | 3 | 4',
        default: '4',
        description: 'Column and row spacing token.',
      },
      { name: 'row-gap', type: '0 | 1 | 2 | 3 | 4', description: 'Optional row spacing token.' },
      {
        name: 'align',
        type: 'stretch | start | center | end',
        default: 'stretch',
        description: 'Grid item block-axis placement.',
      },
      {
        name: 'justify',
        type: 'stretch | start | center | end',
        default: 'stretch',
        description: 'Grid item inline-axis placement.',
      },
      {
        name: 'dense',
        type: 'boolean',
        default: 'false',
        description: 'Enables dense auto-placement.',
      },
    ],
    properties: [
      {
        name: 'minItemSize',
        type: 'string',
        attribute: 'min-item-size',
        description: 'Reflected minimum item size.',
      },
      { name: 'gap', type: 'string', attribute: 'gap', description: 'Reflected spacing token.' },
      {
        name: 'rowGap',
        type: 'string | null',
        attribute: 'row-gap',
        description: 'Reflected row spacing token.',
      },
      {
        name: 'align',
        type: 'TyuiGridAlign',
        attribute: 'align',
        description: 'Reflected block-axis placement.',
      },
      {
        name: 'justify',
        type: 'TyuiGridJustify',
        attribute: 'justify',
        description: 'Reflected inline-axis placement.',
      },
      {
        name: 'dense',
        type: 'boolean',
        attribute: 'dense',
        description: 'Reflected dense placement flag.',
      },
    ],
    events: [],
    slots: [{ name: 'default', description: 'Grid children.' }],
    cssParts: [],
    cssProperties: [
      { name: '--ty-grid-min-item-size', description: 'Mapped grid minimum item size.' },
      { name: '--ty-grid-align', description: 'Mapped align-items.' },
      { name: '--ty-grid-justify', description: 'Mapped justify-items.' },
      { name: '--ty-grid-gap', description: 'Mapped column gap.' },
      { name: '--ty-grid-row-gap', description: 'Mapped row gap.' },
      { name: '--ty-grid-auto-flow', description: 'Mapped grid-auto-flow.' },
    ],
    design: {
      intent: 'Lay out peer cards or fields in responsive columns.',
      pattern: 'Intrinsic grid layout primitive',
      layoutOwnership: 'Parent owns track sizing and gaps; children own their internal layout.',
      accessibility: ['Preserves DOM order and does not set roles.'],
      misuse: ['Do not use for semantic data tables.'],
    },
  },
  {
    tagName: 'tyui-center',
    className: 'TyuiCenterElement',
    modulePath: './src/center/tyui-center.ts',
    summary: 'Centered measure layout primitive.',
    attributes: [
      { name: 'measure', type: 'string', default: '65ch', description: 'Maximum inline measure.' },
      {
        name: 'gutter',
        type: '0 | 1 | 2 | 3 | 4 | page',
        default: 'page',
        description: 'Inline padding token.',
      },
      {
        name: 'intrinsic',
        type: 'boolean',
        default: 'false',
        description: 'Centers children intrinsically.',
      },
    ],
    properties: [
      {
        name: 'measure',
        type: 'string',
        attribute: 'measure',
        description: 'Reflected maximum inline measure.',
      },
      {
        name: 'gutter',
        type: 'TyuiCenterGutter',
        attribute: 'gutter',
        description: 'Reflected gutter token.',
      },
      {
        name: 'intrinsic',
        type: 'boolean',
        attribute: 'intrinsic',
        description: 'Reflected intrinsic centering flag.',
      },
    ],
    events: [],
    slots: [{ name: 'default', description: 'Centered content.' }],
    cssParts: [],
    cssProperties: [
      { name: '--ty-center-measure', description: 'Mapped max-inline-size.' },
      { name: '--ty-center-gutter', description: 'Mapped inline padding.' },
      { name: '--ty-center-display', description: 'Display value for intrinsic centering.' },
    ],
    design: {
      intent: 'Center readable content within a measure.',
      pattern: 'Intrinsic center layout primitive',
      layoutOwnership: 'Parent owns readable measure and gutter; children own internal layout.',
      accessibility: ['Preserves DOM order and does not set roles.'],
      misuse: ['Do not use as a generic card or surface.'],
    },
  },
  {
    tagName: 'tyui-container',
    className: 'TyuiContainerElement',
    modulePath: './src/container/tyui-container.ts',
    summary: 'Page container layout primitive.',
    attributes: [
      {
        name: 'size',
        type: 'narrow | medium | wide | full',
        default: 'wide',
        description: 'Container rail size.',
      },
      {
        name: 'gutter',
        type: '0 | 1 | 2 | 3 | 4 | page',
        default: 'page',
        description: 'Inline padding token.',
      },
      {
        name: 'bleed',
        type: 'boolean',
        default: 'false',
        description: 'Removes max width and gutter.',
      },
    ],
    properties: [
      {
        name: 'size',
        type: 'TyuiContainerSize',
        attribute: 'size',
        description: 'Reflected rail size.',
      },
      {
        name: 'gutter',
        type: 'TyuiContainerGutter',
        attribute: 'gutter',
        description: 'Reflected gutter token.',
      },
      { name: 'bleed', type: 'boolean', attribute: 'bleed', description: 'Reflected bleed flag.' },
    ],
    events: [],
    slots: [{ name: 'default', description: 'Page section content.' }],
    cssParts: [],
    cssProperties: [
      { name: '--ty-container-max-inline-size', description: 'Mapped max-inline-size.' },
      { name: '--ty-container-gutter', description: 'Mapped inline padding.' },
    ],
    design: {
      intent: 'Constrain page sections to product rails.',
      pattern: 'Page container layout primitive',
      layoutOwnership: 'Parent owns section width and gutter; children own internal layout.',
      accessibility: ['Preserves DOM order and does not set roles.'],
      misuse: ['Do not use bleed and full size to fake unrelated section behavior.'],
    },
  },
  {
    tagName: 'tyui-frame',
    className: 'TyuiFrameElement',
    modulePath: './src/frame/tyui-frame.ts',
    summary: 'Aspect-ratio media frame layout primitive.',
    attributes: [
      { name: 'ratio', type: 'string', default: '16/9', description: 'Aspect ratio.' },
      {
        name: 'fit',
        type: 'cover | contain | fill | scale-down | none',
        default: 'cover',
        description: 'Object-fit for replaced children.',
      },
      {
        name: 'position',
        type: 'string',
        default: 'center',
        description: 'Object-position for replaced children.',
      },
    ],
    properties: [
      { name: 'ratio', type: 'string', attribute: 'ratio', description: 'Reflected aspect ratio.' },
      { name: 'fit', type: 'TyuiFrameFit', attribute: 'fit', description: 'Reflected object-fit.' },
      {
        name: 'position',
        type: 'string',
        attribute: 'position',
        description: 'Reflected object-position.',
      },
    ],
    events: [],
    slots: [{ name: 'default', description: 'One media or visual child.' }],
    cssParts: [],
    cssProperties: [
      { name: '--ty-frame-ratio', description: 'Mapped aspect-ratio.' },
      { name: '--ty-frame-fit', description: 'Mapped object-fit for replaced children.' },
      { name: '--ty-frame-position', description: 'Mapped object-position for replaced children.' },
    ],
    design: {
      intent: 'Preserve a media aspect ratio.',
      pattern: 'Intrinsic frame layout primitive',
      layoutOwnership: 'Parent owns ratio and crop behavior; media child owns rendered content.',
      accessibility: ['Preserves child semantics and alternative text.'],
      misuse: ['Do not expect fit or position to affect non-replaced children.'],
    },
  },
  {
    tagName: 'tyui-sidebar',
    className: 'TyuiSidebarElement',
    modulePath: './src/sidebar/tyui-sidebar.ts',
    summary: 'Two-child sidebar/content layout primitive.',
    attributes: [
      {
        name: 'side',
        type: 'start | end',
        default: 'start',
        description: 'Places the fixed side at the start or end.',
      },
      {
        name: 'side-size',
        type: 'string',
        default: '18rem',
        description: 'Preferred sidebar basis.',
      },
      {
        name: 'content-min',
        type: 'string',
        default: '50%',
        description: 'Minimum content width before wrapping.',
      },
      {
        name: 'gap',
        type: '0 | 1 | 2 | 3 | 4',
        default: '3',
        description: 'Spacing token between children.',
      },
      {
        name: 'no-stretch',
        type: 'boolean',
        default: 'false',
        description: 'Aligns children to flex-start.',
      },
    ],
    properties: [
      {
        name: 'side',
        type: 'TyuiSidebarSide',
        attribute: 'side',
        description: 'Reflected sidebar side.',
      },
      {
        name: 'sideSize',
        type: 'string',
        attribute: 'side-size',
        description: 'Reflected sidebar basis.',
      },
      {
        name: 'contentMin',
        type: 'string',
        attribute: 'content-min',
        description: 'Reflected content minimum width.',
      },
      { name: 'gap', type: 'string', attribute: 'gap', description: 'Reflected spacing token.' },
      {
        name: 'noStretch',
        type: 'boolean',
        attribute: 'no-stretch',
        description: 'Reflected no-stretch flag.',
      },
    ],
    events: [],
    slots: [{ name: 'default', description: 'Exactly two direct children: sidebar and content.' }],
    cssParts: [],
    cssProperties: [
      { name: '--ty-sidebar-direction', description: 'Mapped flex-direction.' },
      { name: '--ty-sidebar-size', description: 'Mapped sidebar flex-basis.' },
      {
        name: '--ty-sidebar-content-min-inline-size',
        description: 'Mapped content minimum inline size.',
      },
      { name: '--ty-sidebar-gap', description: 'Mapped gap.' },
      { name: '--ty-sidebar-align', description: 'Mapped align-items.' },
    ],
    design: {
      intent: 'Place a sidebar beside flexible content until wrapping is required.',
      pattern: 'Intrinsic sidebar layout primitive',
      layoutOwnership: 'Parent owns the two-child relationship, side sizing, wrapping, and gap.',
      accessibility: ['Preserves DOM order; side=end changes visual order with row-reverse only.'],
      misuse: ['Do not use with more or fewer than two direct children.'],
    },
  },
];

export default async function cem(
  _options: Record<string, never>,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const paths = resolveProjectPaths(context);
  const packageJsonPath = join(paths.projectAbsRoot, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
    name: string;
    version: string;
  };

  const manifest = {
    schemaVersion: '1.0.0',
    readme: '',
    package: packageJson.name,
    version: packageJson.version,
    modules: components.map((component) => ({
      kind: 'javascript-module',
      path: component.modulePath,
      declarations: [
        {
          kind: 'class',
          declaration: {
            name: component.className,
            module: component.modulePath,
          },
          name: component.className,
          tagName: component.tagName,
          customElement: true,
          summary: component.summary,
          attributes: component.attributes,
          members: component.properties.map((property) => ({
            kind: 'field',
            name: property.name,
            type: { text: property.type },
            attribute: property.attribute,
            description: property.description,
          })),
          events: component.events.map((event) => ({
            name: event.name,
            type: { text: event.type },
            description: event.description,
          })),
          slots: component.slots,
          cssParts: component.cssParts,
          cssProperties: component.cssProperties,
          'x-design-system': component.design,
        },
      ],
      exports: [
        {
          kind: 'custom-element-definition',
          name: component.tagName,
          declaration: {
            name: component.className,
            module: component.modulePath,
          },
        },
      ],
    })),
  };

  await mkdir(paths.projectAbsRoot, { recursive: true });
  await writeFile(
    join(paths.projectAbsRoot, 'custom-elements.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  return { success: true };
}
