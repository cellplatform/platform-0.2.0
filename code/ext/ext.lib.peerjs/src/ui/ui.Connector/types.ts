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
 * Model: Item
 */
export type ConnectorAction = 'local:left' | 'local:right' | 'remote:left' | 'remote:right';
export type ConnectorItem<T extends D = D> = t.LabelItem<t.ConnectorAction, T>;
export type ConnectorItemRenderers = t.LabelItemRenderers<t.ConnectorAction>;
export type ConnectorItemState<T extends D = D> = t.LabelItemState<ConnectorAction, T>;

/**
 * Model: List
 */
export type ConnectorListState = t.PatchState<t.ConnectorList>;
export type ConnectorListItem = { state: t.ConnectorItemState; renderers: t.LabelItemRenderers };
export type ConnectorList = {
  state: t.LabelListState;
  items: t.ConnectorListItem[];
};

/**
 * Model: Data
 */
type D = ConnectorData;
export type ConnectorData = ConnectorDataSelf | ConnectorDataRemote;
export type ConnectorDataSelf = {
  kind: 'peer:self';
  copied?: string;
  peerid: string;
};

export type ConnectorDataRemote = {
  kind: 'peer:remote';
  peerid?: string;
  error?: { type: ConnectorDataRemoteError; tx: string };
};

export type ConnectorDataRemoteError = 'InvalidPeer' | 'PeerIsSelf';
