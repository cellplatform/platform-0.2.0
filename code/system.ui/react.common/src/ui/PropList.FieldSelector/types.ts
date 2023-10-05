import type { t } from './common';

export type PropListFieldSelectorAction = 'Select' | 'Deselect' | 'Reset:Default' | 'Reset:Clear';

/**
 * Component: <PropsList.FieldSelector>
 */
export type PropListFieldSelectorProps<F extends string = string> = {
  title?: t.PropListTitleInput;
  all?: F[];
  selected?: F[];
  defaults?: F[];

  resettable?: boolean;
  indexes?: boolean;

  switchColor?: string | number;
  indent?: number;
  style?: t.CssValue;
  onClick?: PropListFieldSelectorClickHandler;
};

export type PropListFieldSelectorClickHandler = (e: PropListFieldSelectorClickHandlerArgs) => void;
export type PropListFieldSelectorClickHandlerArgs<F extends string = string> = {
  action: PropListFieldSelectorAction;
  field?: F;
  previous?: F[];
  next?: F[];
  as<T extends string>(): PropListFieldSelectorClickHandlerArgs<T>;
};
