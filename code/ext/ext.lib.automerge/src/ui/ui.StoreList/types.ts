import { type t } from './common';

/**
 * <Component>
 */
export type StoreListProps = {
  style?: t.CssValue;
};

/**
 * Model: Item
 */
export type StoreAction = 'store:left';
export type StoreItem = t.LabelItem<t.StoreAction, StoreItemData>;
export type StoreItemState = t.LabelItemState<StoreAction, StoreItemData>;
export type StoreItemRenderers = t.LabelItemRenderers<t.StoreAction>;

/**
 * Model: Data
 */
export type StoreItemData = {};
