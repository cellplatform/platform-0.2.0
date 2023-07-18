import { type t } from './common';

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
  autoChildSelection?: boolean; // Selects namespace children when parent is selected (eg. "foo" → "foo.bar")

  indent?: number;
  style?: t.CssValue;

  onClick?: PropListFieldSelectorClickHandler;
};

export type PropListFieldSelectorClickHandler = (e: PropListFieldSelectorClickHandlerArgs) => void;
export type PropListFieldSelectorClickHandlerArgs<F extends string = string> = {
  action: 'Select' | 'Deselect' | 'Reset:Default' | 'Reset:Clear';
  field?: F;
  previous?: F[];
  next?: F[];
  as<T extends string>(): PropListFieldSelectorClickHandlerArgs<T>;
};
