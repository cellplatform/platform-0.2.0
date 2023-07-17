import { type t } from './common';

export type LabelItemControllerKind = 'Edit' | 'Selection';

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
 * Controller API
 */
export type LabelActionController = {
  readonly enabled: boolean;
  readonly data: t.LabelItemData;
  readonly props: t.LabelItemProps;
  readonly handlers: t.LabelItemPropsHandlers;
};

/**
 * Component (View).
 */
export type LabelItemStatefulProps = {
  item?: LabelItemState; // NB: If not specified default is generated.
  useControllers?: t.LabelItemControllerKind[];
  rightActions?: t.LabelAction[];
  style?: t.CssValue;
  onChange?: LabelItemDataChangeHandler;
};

/**
 * Events.
 */
export type LabelItemDataChangeHandler = (e: LabelItemDataChangeHandlerArgs) => void;
export type LabelItemDataChangeHandlerArgs = {
  action: LabelItemChangeAction;
  data: LabelItemData;
};
export type LabelItemChangeAction = 'data:label' | 'edit:start' | 'edit:accept' | 'edit:cancel';
