import type { t } from './common';

/**
 * Model: Context
 */
export type GetConnectorCtx = () => ConnectorCtx;
export type ConnectorCtx = { peer: t.PeerModel; list: t.ConnectorListState };

/**
 * Model: Item
 */
export type ConnectorAction = ConnectorActionSelf | ConnectorActionRemote;
export type ConnectorActionSelf = 'self:left' | 'self:right';
export type ConnectorActionRemote = 'remote:left' | 'remote:right';

export type ConnectorItem<T extends D = D> = t.LabelItem<t.ConnectorAction, T>;
export type ConnectorItemRenderers = t.LabelItemRenderers<t.ConnectorAction>;
export type ConnectorItemState<T extends D = D> = t.LabelItemState<ConnectorAction, T>;

type TSelf = t.ConnectorActionSelf;
type TRemote = t.ConnectorActionRemote;

export type ConnectorItemSelf = t.LabelItem<TSelf, t.ConnectorDataRemote>;
export type ConnectorItemRemote = t.LabelItem<TRemote, t.ConnectorDataRemote>;

export type ConnectorItemStateSelf = t.LabelItemState<TSelf, t.ConnectorDataSelf>;
export type ConnectorItemStateSelfEvents = t.LabelItemEvents<TSelf>;
export type ConnectorItemStateRemote = t.LabelItemState<TRemote, t.ConnectorDataRemote>;
export type ConnectorItemStateRemoteEvents = t.LabelItemEvents<TRemote>;

/**
 * Model: <List>
 */
export type ConnectorListState = t.LabelListState;

/**
 * Model: <Data>
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
  remoteid?: string;
  stage?: 'Connecting' | 'Connected';
  error?: { tx: string; type: ConnectorDataRemoteError; message?: string };
};

export type ConnectorDataRemoteError = 'InvalidPeer' | 'PeerIsSelf' | 'ConnectFail';
