import type { t } from '../common.t';

type Milliseconds = number;

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
  padding?: t.CssEdgesInput;
  margin?: t.CssEdgesInput;
  width?: number | t.PropListSize;
  height?: number | t.PropListSize;
  card?: boolean | PropListCard;
  flipped?: boolean;
  backside?: JSX.Element | null;
  theme?: t.PropListTheme;
  style?: t.CssValue;
};

export type PropListSize = { fixed?: number; min?: number; max?: number };
export type PropListCard = { flipSpeed?: Milliseconds; shadow?: boolean | t.CssShadow };

/**
 * Component: <PropsList.FieldSelector>
 */
export type PropListFieldSelectorProps<F extends string = string> = {
  title?: t.PropListTitleInput;
  all?: F[];
  selected?: F[];
  resettable?: boolean;
  showIndexes?: boolean;
  style?: t.CssValue;
  onClick?: PropListFieldSelectorClickHandler;
};

export type PropListFieldSelectorClickHandler = (e: PropListFieldSelectorClickHandlerArgs) => void;
export type PropListFieldSelectorClickHandlerArgs<F extends string = string> = {
  action: 'Select' | 'Deselect' | 'Reset';
  field?: F;
  previous?: F[];
  next?: F[];
};

/**
 * Factory
 */
export type PropListFieldBuilder<F extends string> = {
  field(name: F, item: PropListItemFactory | PropListItem): PropListFieldBuilder<F>;
  items(fields?: F[]): PropListItem[];
};
export type PropListItemFactory = () => PropListItem | PropListItem[] | undefined;

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
};

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
