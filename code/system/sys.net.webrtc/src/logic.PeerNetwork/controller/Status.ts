import { PeerJS, t, Delete } from '../common';
import { ConnectionRef, SelfRef } from './Refs';

export const Status = {
  /**
   * Derive a [PeerStatus] from a reference.
   */
  refToSelf(self: SelfRef): t.PeerStatus {
    const { peer, createdAt, signal } = self;
    const id = peer.id;
    const connections = self.connections.map((ref) => Status.refToConnection(ref));
    const isOnline = navigator.onLine;
    return Delete.undefined<t.PeerStatus>({ id, isOnline, createdAt, signal, connections });
  },

  /**
   * Derive a [PeerConnectionStatus] from a reference.
   */
  refToConnection(ref: ConnectionRef): t.PeerConnectionStatus {
    const { kind, peer, id, uri, direction } = ref;

    if (kind === 'data') {
      const conn = ref.conn as t.DataConnection;
      const { reliable: isReliable, open: isOpen } = conn;
      const metadata = (conn.metadata || {}) as t.PeerConnectionMetadataData;
      const { parent } = metadata;
      return { uri, id, peer, kind, direction, isReliable, isOpen, parent };
    }

    if (kind === 'media/video' || kind === 'media/screen') {
      const media = ref.remoteStream as MediaStream;
      const conn = ref.conn as t.MediaConnection;
      const { open: isOpen } = conn;
      const metadata = (conn.metadata || {}) as t.PeerConnectionMetadataMedia;
      const { parent } = metadata;
      return { uri, id, peer, kind, direction, isOpen, media, parent };
    }

    throw new Error(`Kind of connection not supported: ${uri}`);
  },
};
