import { type t } from './common';

type InstanceId = string;
export type LabelItemBehaviorKind = 'Edit' | 'Selection';

export type LabelItemList = {};

/**
 * Item (Data Model)
 */
export type LabelItem = {
  label?: string;
  editing?: boolean;
  enabled?: boolean;
  focused?: boolean;
  left?: t.LabelAction | t.LabelAction[];
  right?: t.LabelAction | t.LabelAction[];
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState = t.Immutable<t.LabelItem> & { readonly instance: InstanceId };
export type LabelItemStateChanger = (draft: t.LabelItem) => void;


/**
 * Controller API
 */
export type LabelActionController = {
  readonly enabled: boolean;
  readonly data: t.LabelItem;
  readonly handlers: t.LabelItemPropsHandlers;
};

/**
 * Component (View).
 */
export type LabelItemStatefulProps = {
  item?: LabelItemState; // NB: If not specified default is generated.
  useBehaviors?: t.LabelItemBehaviorKind[];
  style?: t.CssValue;
  onChange?: LabelItemStateChangeHandler;
};

/**
 * Events.
 */
export type LabelItemStateChangeHandler = (e: LabelItemStateChangeHandlerArgs) => void;
export type LabelItemStateChangeHandlerArgs = {
  action: LabelItemChangeAction;
  data: LabelItem;
};
export type LabelItemChangeAction =
  | 'ready'
  | 'data:label'
  | 'view:focus'
  | 'view:blur'
  | 'edit:start'
  | 'edit:accept'
  | 'edit:cancel';
