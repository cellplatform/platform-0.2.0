import { type t } from './common';

/**
 * <Component>
 */
export type StoreListProps = {
  style?: t.CssValue;
};

/**
 * Model: Context
 */
export type GetStoreCtx = () => StoreCtx;
export type StoreCtx = { list: StoreListState };

/**
 * Model: Item
 */
export type StoreAction = 'Store:Left';
export type StoreItem = t.LabelItem<t.StoreAction, StoreItemData>;
export type StoreItemState = t.LabelItemState<StoreAction, StoreItemData>;
export type StoreItemRenderers = t.LabelItemRenderers<t.StoreAction>;

/**
 * Model: List
 */
export type StoreListState = t.PatchState<t.StoreList>;
export type StoreList = { state: t.LabelListState; items: t.StoreItemState[] };

/**
 * Model: Data
 */
export type StoreItemData = {
  mode: 'Add' | 'Doc';
};
