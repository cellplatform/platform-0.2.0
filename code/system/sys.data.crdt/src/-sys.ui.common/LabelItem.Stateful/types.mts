import { type t } from './common';

/**
 * Data.
 */
export type LabelItemData = {
  label?: string;
  editing?: boolean;
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState = t.Immutable<t.LabelItemData> & {
  readonly instance: { id: string };
};
export type LabelItemStateChanger = (draft: t.LabelItemData) => void;

/**
 * Component (View).
 */
export type LabelItemStatefulProps = {
  state?: LabelItemState; // NB: If not specified default is generated.
  useEditController?: boolean;
  rightActions?: t.LabelAction[];
  style?: t.CssValue;
  onChange?: LabelItemDataChangeHandler;
};

/**
 * Events.
 */
export type LabelItemDataChangeHandler = (e: LabelItemDataChangeHandlerArgs) => void;
export type LabelItemDataChangeHandlerArgs = {
  action: 'data:label' | 'prop:editing';
  data: LabelItemData;
};
