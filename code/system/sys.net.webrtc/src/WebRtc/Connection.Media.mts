import { rx, type t } from './common';

/**
 * Represents a P2P media connection (video/screenshare).
 */
export function PeerMediaConnection(
  conn: t.MediaConnection,
  stream: t.PeerMediaStreams,
): t.PeerMediaConnection {
  const { dispose, dispose$ } = rx.disposable();
  const metadata: t.PeerMetaMedia = conn.metadata;
  if (!metadata) {
    throw new Error(`The media connection did not expose metadata`);
  }

  let _disposed = false;
  dispose$.subscribe(() => {
    _disposed = true;
    conn.close();
  });

  conn.on('close', dispose);

  const api: t.PeerMediaConnection = {
    id: conn.connectionId,
    kind: 'media',
    metadata,
    stream,
    peer: {
      local: (conn.provider as any)._id as string,
      remote: conn.peer,
    },

    get isOpen() {
      return conn.open;
    },

    dispose,
    dispose$,
    get isDisposed() {
      return _disposed;
    },
  };

  return api;
}
