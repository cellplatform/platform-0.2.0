import { Model, PeerUri, slug, type t } from './common';
import { Data } from './u.Data';

/**
 * Shared location for common state-transformations.
 */
export const Remote = {
  resetError(item: t.ConnectorItemStateRemote, tx?: string, remoteid?: string) {
    if (tx && Data.remote(item).error?.tx !== tx) return false;
    item.change((d) => {
      const data = Data.remote(d);
      data.error = undefined;
      data.remoteid = remoteid;
      d.label = remoteid;
      Model.action<t.ConnectorAction>(d, 'remote:right')[0].button = Boolean(remoteid);
    });
    return true;
  },

  setPeerText(
    item: t.ConnectorItemStateRemote,
    list: t.ConnectorListState,
    peer: t.PeerModel,
    text: string,
  ) {
    const tx = slug();
    const isValid = PeerUri.Is.peerid(text) || PeerUri.Is.uri(text);
    const remoteid = isValid ? PeerUri.id(text) : '';
    const conns = peer.current.connections;

    const self = Data.self(Model.List.get(list).item(0)!);
    const isSelf = self.peerid === remoteid;
    const isAlreadyConnected = !isSelf && conns.some((c) => c.peer.remote === remoteid);

    item.change((d) => {
      const data = Data.remote(d);
      if (!isValid) data.error = { type: 'InvalidPeer', tx };
      else if (isSelf) data.error = { type: 'PeerIsSelf', tx };
      else if (isAlreadyConnected) data.error = { type: 'PeerAlreadyConnected', tx };
      else data.error = undefined;

      d.label = remoteid;
      if (data.error) d.label = undefined;
      data.remoteid = data.error ? undefined : remoteid;
      d.editable = !Boolean(data.remoteid);
      Model.action<t.ConnectorAction>(d, 'remote:right')[0].button = true;
    });

    return { tx } as const;
  },

  clearPeerText(item: t.ConnectorItemStateRemote) {
    item.change((d) => {
      const data = Data.remote(d);
      data.error = undefined;
      data.remoteid = undefined;
      data.stage = undefined;
      d.label = undefined;
      d.editable = true;
    });
  },

  setAsConnecting(item: t.ConnectorItemStateRemote, isConnecting: boolean) {
    item.change((d) => {
      const data = Data.remote(d);
      data.stage = isConnecting ? 'Connecting' : undefined;
      Model.action<t.ConnectorAction>(d, 'remote:right')[0].enabled = !isConnecting;
    });
  },

  setAsConnected(item: t.ConnectorItemStateRemote, list: t.ConnectorListState, conn: t.PeerJsConn) {
    item.change((d) => {
      Model.action<t.ConnectorAction>(d, 'remote:right')[0].button = true;
      const data = Data.remote(d);
      data.stage = 'Connected';
      data.connid = conn.connectionId;
      data.remoteid = conn.peer;
      d.label = conn.peer;
      d.editable = false;
    });

    // Add the next [+] item.
    list.change((item) => (item.total += 1));
  },

  setConnectError(item: t.ConnectorItemStateRemote, error: string) {
    const tx = slug();

    console.log('set connect error:', error);

    item.change((d) => {
      const data = Data.remote(d);
      data.error = { tx, type: 'ConnectFail', message: error };
      d.label = undefined;
      Model.action<t.ConnectorAction>(d, 'remote:right')[0].button = false;
    });

    return { tx } as const;
  },

  removeFromList(item: t.ConnectorItemStateRemote, list: t.ConnectorListState) {
    const index = list.current.getItem?.(item.instance)[1] ?? -1;
    if (index > -1) {
      const dispatch = Model.List.commands(list);
      dispatch.remove(index);
      dispatch.select(index === 0 ? 0 : index - 1);
    }
  },
} as const;
