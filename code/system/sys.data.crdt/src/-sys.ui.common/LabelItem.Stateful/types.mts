import { type t } from './common';

type Id = string;
export type LabelItemBehaviorKind = 'Edit' | 'Selection';

/**
 * Data.
 */
export type LabelItemData = {
  label?: string;
  editing?: boolean;
  left?: t.LabelAction | t.LabelAction[];
  right?: t.LabelAction | t.LabelAction[];
};

/**
 * Simple safe/immutable state wrapper for the data object.
 */
export type LabelItemState = t.Immutable<t.LabelItemData> & { readonly instance: Id };
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
  useBehaviors?: t.LabelItemBehaviorKind[];
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
