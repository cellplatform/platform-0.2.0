import type { t } from './common';

/**
 * <Component>
 */
export type ConnectorProps = {
  style?: t.CssValue;
};

/**
 * Model
 */
export type GetConnectorCtx = () => ConnectorCtx;
export type ConnectorCtx = { list: ConnectorListState };

/**
 * Item
 */
export type ConnectorActionKind = 'local:left' | 'local:copy' | 'remote:left';
export type ConnectorItem = t.LabelItem<t.ConnectorActionKind>;
export type ConnectorItemRenderers = t.LabelItemRenderers<t.ConnectorActionKind>;

/**
 * List
 */
export type ConnectorListState = t.PatchState<t.ConnectorList>;
export type ConnectorListItem = { state: t.LabelItemState; renderers: t.LabelItemRenderers };
export type ConnectorList = {
  list: t.LabelItemListState;
  items: t.ConnectorListItem[];
};

/**
 * Model Data
 */
export type ConnectorDataRemote = {};
export type ConnectorDataSelf = { copied?: string };
