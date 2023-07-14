import { type t } from './common';

/**
 * Data
 */
export type LabelItemData = {
  label?: string;
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState = {
  readonly current: t.LabelItemData;
  change(fn: (draft: t.LabelItemData) => void): void;
};

/**
 * Component (View)
 */
export type LabelItemStatefulProps = {
  useController?: boolean;
  style?: t.CssValue;
  onChange?: LabelItemDataChangeHandler;
};

/**
 * Events
 */

export type LabelItemDataChangeHandler = (e: LabelItemDataChangeHandlerArgs) => void;
export type LabelItemDataChangeHandlerArgs = {
  action: 'label' | 'editing';
  data: LabelItemData;
  props: t.LabelItemProps;
};
