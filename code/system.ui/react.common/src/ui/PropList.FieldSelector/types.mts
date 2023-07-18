import { type t } from './common';

/**
 * Component: <PropsList.FieldSelector>
 */
export type PropListFieldSelectorProps<F extends string = string> = {
  title?: t.PropListTitleInput;
  all?: F[];
  selected?: F[];
  default?: F[];
  resettable?: boolean;
  indexes?: boolean;
  indent?: number;
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
