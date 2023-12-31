import { DEFAULTS, Model, PeerUri, Time, slug, type t } from './common';
import { Data } from './u.Data';

type ErrorCleared = (e: { tx: string; reason: ErrorClearedReason }) => void;
type ErrorClearedReason = 'timedout' | 'escaped';

/**
 * Shared location for common state-transformations.
 */
export const Remote = {
  redraw(item: t.ConnectorItemStateRemote) {
    Model.Item.incrementRedraw(item);
  },

  setError(
    item: t.ConnectorItemStateRemote,
    type: t.ConnectorDataRemoteError,
    options: {
      tx?: string;
      message?: string;
      events?: t.ConnectorItemStateRemoteEvents;
      timeout?: true | number;
      cleared?: ErrorCleared;
    } = {},
  ) {
    const { message, events, timeout } = options;
    const tx = options.tx ?? slug();

    // Update state.
    item.change((d) => {
      const data = Data.remote(d);
      data.error = { tx, type, message };
      d.label = undefined;
      Model.action<t.ConnectorAction>(d, 'remote:right')[0].button = false;
    });

    let timer: t.TimeDelayPromise<any> | undefined;

    const resetError = (reason: ErrorClearedReason) => {
      timer?.cancel();
      Remote.resetError(item, tx);
      options.cleared?.({ tx, reason });
    };

    // Handle timeout.
    if (timeout !== undefined) {
      const delay = typeof timeout === 'number' ? timeout : DEFAULTS.timeout.error;
      timer = Time.delay(delay, () => resetError('timedout'));
    }

    // Handle escape key.
    events?.key.escape$.subscribe((e) => resetError('escaped'));

    return { tx } as const;
  },

  resetError(item: t.ConnectorItemStateRemote, tx?: string, remoteid?: string) {
    if (tx && Data.remote(item).error?.tx !== tx) return false;
    item.change((d) => {
      const data = Data.remote(d);
      data.error = undefined;
      data.remoteid = remoteid;
      d.label = remoteid;
      Model.action<t.ConnectorAction>(d, 'remote:right')[0].button = Boolean(remoteid);
    });
    Remote.redraw(item);
    return true;
  },

  setPeerText(
    item: t.ConnectorItemStateRemote,
    list: t.ConnectorListState,
    peer: t.PeerModel,
    text: string,
    options: {
      events?: t.ConnectorItemStateRemoteEvents;
      errorTimeout?: true | number;
      errorCleared?: ErrorCleared;
    } = {},
  ) {
    const { events } = options;
    const tx = slug();
    const isValidUri = PeerUri.Is.peerid(text) || PeerUri.Is.uri(text);
    const remoteid = isValidUri ? PeerUri.id(text) : '';
    const conns = peer.current.connections;

    const self = Data.self(Model.List.get(list).item(0)!);
    const isSelf = self.peerid === remoteid;
    const isAlreadyConnected = !isSelf && conns.some((c) => c.peer.remote === remoteid);

    let errorType: t.ConnectorDataRemoteError | undefined;
    if (!isValidUri) errorType = 'InvalidPeer';
    else if (isSelf) errorType = 'PeerIsSelf';
    else if (isAlreadyConnected) errorType = 'PeerAlreadyConnected';

    if (errorType) {
      Remote.setError(item, errorType, {
        tx,
        events,
        timeout: options.errorTimeout,
        cleared: options.errorCleared,
      });
    }

    item.change((d) => {
      const data = Data.remote(d);
      if (!errorType) data.error = undefined;

      d.label = remoteid;
      if (data.error) d.label = undefined;
      data.remoteid = data.error ? undefined : remoteid;
      d.editable = !Boolean(data.remoteid);
      Model.action<t.ConnectorAction>(d, 'remote:right')[0].button = true;
    });

    const data = Data.remote(item);
    const error = data.error;
    Remote.redraw(item);
    return { tx, error } as const;
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

  removeFromList(item: t.ConnectorItemStateRemote, list: t.ConnectorListState) {
    const index = list.current.getItem?.(item.instance)[1] ?? -1;
    if (index > -1) {
      const dispatch = Model.List.commands(list);
      dispatch.remove(index);
      dispatch.select(index === 0 ? 0 : index - 1);
    }
  },
} as const;
