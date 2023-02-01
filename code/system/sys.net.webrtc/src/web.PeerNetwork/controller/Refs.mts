import { PeerJS, t, StringUtil, UriUtil } from '../common';

type ConnectionKind = t.PeerConnectRes['kind'];

export type SelfRef = {
  id: t.PeerId;
  peer: PeerJS;
  createdAt: number;
  signal: t.PeerSignallingEndpoint;
  connections: ConnectionRef[];
  media: { video?: MediaStream; screen?: MediaStream };
};

export type ConnectionRef = {
  kind: t.PeerConnectionKind;
  peer: t.PeerConnectionStatus['peer'];
  id: t.PeerConnectionId;
  uri: t.PeerConnectionUriString;
  conn: t.DataConnection | t.MediaConnection;
  direction: t.PeerConnectDirection;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  parent?: t.PeerConnectionId;
};

/**
 * Memory references to network objects.
 */
export function MemoryRefs() {
  const self: { [id: string]: SelfRef } = {};

  const refs = {
    self,

    connection(input: SelfRef | string) {
      const self = typeof input === 'string' ? refs.self[input] : input;
      type C = t.DataConnection | t.MediaConnection;
      const getId = (conn: C) => {
        return StringUtil.formatConnectionId((conn as any).connectionId);
      };
      return {
        add(
          kind: ConnectionKind,
          direction: t.PeerConnectDirection,
          conn: t.DataConnection | t.MediaConnection,
          remoteStream?: MediaStream,
        ) {
          if (!conn) {
            throw new Error(`Expected PeerJS connection object (data or media)`);
          }

          const id = getId(conn);
          const metadata = conn.metadata as t.PeerConnectionMetadata;
          const { parent, module, userAgent } = metadata;

          const remote = { id: conn.peer, module, userAgent };
          const peer = { self: self.peer.id, remote };
          const uri = UriUtil.connection.create(kind, remote.id, id);

          const existing = self.connections.find((item) => item.uri === uri);
          if (existing) return existing;

          const ref: ConnectionRef = { kind, uri, id, peer, direction, conn, remoteStream, parent };
          self.connections = [...self.connections, ref];

          return ref;
        },

        remove(conn: C) {
          self.connections = self.connections.filter((item) => item.conn !== conn);
        },

        get(conn: C) {
          const id = getId(conn);
          const ref = self.connections.find((ref) => ref.id == id);
          if (!ref) {
            const remote = conn.peer;
            const err = `The connection reference '${remote}' for local network '${self.id}' has not been added`;
            throw new Error(err);
          }
          return ref;
        },

        get data() {
          return self.connections
            .filter((ref) => ref.kind === 'data')
            .map((ref) => ref.conn as t.DataConnection);
        },

        get media() {
          return self.connections
            .filter((ref) => ref.kind === 'media/video' || ref.kind === 'media/screen')
            .map((ref) => ref.conn as t.MediaConnection);
        },

        get ids() {
          return self.connections.map((ref) => ref.peer.remote.id);
        },
      };
    },

    dispose() {
      Object.keys(refs.self).forEach((key) => delete refs.self[key]);
    },
  };

  return refs;
}
