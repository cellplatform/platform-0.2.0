import { rx, t } from './common';
import { Util } from './util.mjs';

/**
 * Represents a P2P media connection (video/screenshare).
 */
export function PeerMediaConnection(
  conn: t.MediaConnection,
  stream: t.PeerMediaStreams,
): t.PeerMediaConnection {
  const { dispose, dispose$ } = rx.disposable();

  let _disposed = false;
  dispose$.subscribe(() => {
    _disposed = true;
    conn.close();
  });

  conn.on('close', dispose);

  const api: t.PeerMediaConnection = {
    kind: 'media',
    id: conn.connectionId,
    stream,
    peer: {
      local: (conn.provider as any)._id as string,
      remote: conn.peer,
    },

    get open() {
      return conn.open;
    },

    dispose,
    dispose$,
    get disposed() {
      return _disposed;
    },
  };

  return api;
}
