import type { t } from './common';

type ElementInput = JSX.Element | null | false;

/**
 * Component: <PropList>
 */
export type PropListTheme = t.CommonTheme;

export type PropListTitleInput = PropListTitle['value'] | PropListTitle;
export type PropListTitleContent = string | JSX.Element | null;
export type PropListTitle = {
  value?: PropListTitleContent | [PropListTitleContent, PropListTitleContent];
  ellipsis?: boolean;
  margin?: t.CssEdgesInput;
};

export type PropListProps = {
  title?: t.PropListTitleInput;
  items?: (PropListItem | undefined)[] | Record<string, unknown>;
  defaults?: t.PropListDefaults;
  card?: boolean | PropListCard;
  flipped?: boolean;

  header?: ElementInput;
  footer?: ElementInput;

  backside?: ElementInput;
  backsideHeader?: ElementInput;
  backsideFooter?: ElementInput;

  padding?: t.CssEdgesInput;
  margin?: t.CssEdgesInput;
  width?: number | t.PropListSize;
  height?: number | t.PropListSize;
  theme?: t.PropListTheme;
  style?: t.CssValue;

  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
};

export type PropListSize = { fixed?: number; min?: number; max?: number };
export type PropListCard = {
  flipSpeed?: t.Milliseconds;
  shadow?: boolean | t.CssShadow;
  background?: t.CardBackground;
  border?: t.CardBorder;
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
  clipboard?: boolean;
  monospace?: boolean;
};

/**
 * A single row within a [PropList].
 */
export type PropListItem = {
  label?: string | number | JSX.Element;
  value?: string | number | boolean | JSX.Element | PropListValue;
  tooltip?: string;
  visible?: boolean;
  indent?: number;
  selected?: boolean | PropListItemSelected;
  divider?: boolean;
};

export type PropListItemSelected = { color: string | number };

/**
 * The value portion of a [PropList] item.
 */
export type PropListValue = PropListValueGeneric | PropListValueKinds;

type ValueBase = {
  monospace?: boolean;
  clipboard?: string | boolean | (() => string | undefined);
  color?: string | number;
  fontSize?: number;
  bold?: boolean;
  opacity?: number;
  indent?: number;
  onClick?: (e: PropListValueEventArgs) => void;
};

export type PropListValueGeneric = ValueBase & {
  data?: string | number | boolean | JSX.Element;
};

export type PropListValueKinds = PropListValueSwitch;
export type PropListValueSwitch = ValueBase & {
  kind: 'Switch';
  data?: boolean;
  enabled?: boolean;
};

/**
 * CLICK event arguments.
 */
export type PropListValueEventArgs = {
  item: PropListItem;
  value: PropListValue;
  message: (value: JSX.Element | string, delay?: number) => void;
};
