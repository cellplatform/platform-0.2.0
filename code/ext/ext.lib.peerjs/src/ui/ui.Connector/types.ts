import type { t } from './common';

/**
 * <Component>
 */
export type ConnectorProps = {
  style?: t.CssValue;
};

/**
 * Model: Context
 */
export type GetConnectorCtx = () => ConnectorCtx;
export type ConnectorCtx = { list: ConnectorListState };

/**
 * Model: Item
 */
export type ConnectorAction = ConnectorActionLocal | ConnectorActionRemote;
export type ConnectorActionLocal = 'local:left' | 'local:right';
export type ConnectorActionRemote = 'remote:left' | 'remote:right';

export type ConnectorItem<T extends D = D> = t.LabelItem<t.ConnectorAction, T>;
export type ConnectorItemRenderers = t.LabelItemRenderers<t.ConnectorAction>;
export type ConnectorItemState<T extends D = D> = t.LabelItemState<ConnectorAction, T>;

export type ConnectorItemLocal = t.LabelItem<t.ConnectorActionLocal, t.ConnectorDataRemote>;
export type ConnectorItemRemote = t.LabelItem<t.ConnectorActionRemote, t.ConnectorDataRemote>;

/**
 * Model: <List>
 */
export type ConnectorListState = t.LabelListState;

/**
 * Model: <Data>
 */
type D = ConnectorData;
export type ConnectorData = ConnectorDataLocal | ConnectorDataRemote;
export type ConnectorDataLocal = {
  kind: 'peer:local';
  copied?: string;
  peerid: string;
};

export type ConnectorDataRemote = {
  kind: 'peer:remote';
  peerid?: string;
  error?: { type: ConnectorDataRemoteError; tx: string };
};

export type ConnectorDataRemoteError = 'InvalidPeer' | 'PeerIsSelf';
