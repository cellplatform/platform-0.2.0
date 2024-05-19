import type { t } from './common';

/**
 * Component: <PropList>
 */
export type PropListSize = { fixed?: number; min?: number; max?: number };
export type PropListTitleInput = PropListTitle['value'] | PropListTitle;
export type PropListTitleContent = t.RenderInput;
export type PropListTitle = {
  value?: PropListTitleContent | [PropListTitleContent, PropListTitleContent];
  ellipsis?: boolean;
  margin?: t.CssEdgesInput;
};

export type PropListProps = {
  title?: t.PropListTitleInput;
  items?: (PropListItem | undefined)[] | Record<string, unknown>;
  defaults?: t.PropListDefaults;

  padding?: t.CssEdgesInput;
  margin?: t.CssEdgesInput;
  width?: number | t.PropListSize;
  height?: number | t.PropListSize;
  theme?: t.CommonTheme;
  style?: t.CssValue;

  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
};

/**
 * Factory
 */
export type PropListFieldBuilder<F extends string> = {
  field(name: F, item: PropListItemFactory | PropListItem): PropListFieldBuilder<F>;
  items(fields?: F[]): PropListItem[];
};
export type PropListItemFactory = () => (PropListItem | t.Falsy) | (PropListItem | t.Falsy)[];

/**
 * Default values used when optional properties are ommitted.
 */
export type PropListDefaults = {
  readonly clipboard?: boolean;
  readonly monospace?: boolean;
};

/**
 * A single row within a [PropList].
 */
export type PropListItem = {
  readonly label?: string | number | JSX.Element;
  readonly value?: string | number | boolean | JSX.Element | PropListValue;
  readonly tooltip?: string;
  readonly visible?: boolean;
  readonly indent?: number;
  readonly selected?: boolean | PropListItemSelected;
  readonly divider?: boolean;
  readonly onClick?: t.PropListItemHandler;
};

export type PropListItemSelected = { readonly color: string | number };

/**
 * The value portion of a [PropList] item.
 */
export type PropListValue = PropListValueGeneric | PropListValueKinds;

type ValueBase = {
  readonly monospace?: boolean;
  readonly clipboard?: string | boolean | (() => string | undefined);
  readonly color?: string | number;
  readonly fontSize?: number;
  readonly bold?: boolean;
  readonly opacity?: number;
  readonly indent?: number;
  readonly onClick?: t.PropListItemHandler;
};

export type PropListValueGeneric = ValueBase & {
  data?: string | number | boolean | JSX.Element;
};

export type PropListValueKinds = PropListValueSwitch;
export type PropListValueSwitch = ValueBase & {
  readonly kind: 'Switch';
  readonly data?: boolean;
  readonly enabled?: boolean;
};

/**
 * CLICK event arguments.
 */
export type PropListItemHandler = (e: PropListItemHandlerArgs) => void;
export type PropListItemHandlerArgs = {
  readonly item: PropListItem;
  readonly value: PropListValue;
  readonly message: (value: JSX.Element | string, delay?: number) => void;
};