import { rx, t } from './common';
import { PeerDataConnection } from './Connection.Data.mjs';
import { PeerMediaConnection } from './Connection.Media.mjs';

/**
 * State management of current WebRTC session - peers/connections.
 */
export function MemoryState() {
  const memory = { connections: [] as t.PeerConnection[] };
  const connections$ = new rx.Subject<t.PeerConnectionChange>();

  const api = {
    connections: {
      $: connections$.asObservable(),
      get all() {
        return [...memory.connections];
      },
      get data() {
        const list = memory.connections;
        return list.filter(({ kind }) => kind === 'data') as t.PeerDataConnection[];
      },
      get media() {
        const list = memory.connections;
        return list.filter(({ kind }) => kind === 'media') as t.PeerMediaConnection[];
      },
    },

    fireChanged<P extends t.PeerConnectionChange>(action: P['action'], subject: P['subject']) {
      const kind = subject.kind;
      const connections = memory.connections;
      connections$.next({ kind, action, connections, subject } as P);
    },

    handleDispose(subject: t.PeerConnection) {
      subject.dispose$.subscribe(() => {
        memory.connections = memory.connections.filter((item) => item.id !== subject.id);
        api.fireChanged('removed', subject);
        if (subject.kind === 'data') api.ensureClosed(subject);
      });
    },

    ensureClosed(data: t.PeerDataConnection) {
      /**
       * NOTE:
       * The close event is not being fired for [Media] connections.
       * Issue: https://github.com/peers/peerjs/issues/780
       *
       * This work-around checks all media-connections connected to the
       * remote peer if there are no other data-connections open.
       */
      const isLastDataConnection = !api.connections.data
        .filter((item) => item.peer.remote === data.peer.remote)
        .some((item) => item.id !== data.id);

      if (isLastDataConnection) {
        api.connections.media
          .filter((item) => item.peer.remote === data.peer.remote)
          .forEach((item) => item.dispose());
      }
    },

    async storeData(conn: t.DataConnection) {
      const existing = api.connections.data.find((item) => item.id === conn.connectionId);
      if (existing) return existing;

      const subject = PeerDataConnection(conn);
      memory.connections.push(subject);
      api.handleDispose(subject);
      api.fireChanged('added', subject);
      return subject;
    },

    async storeMedia(conn: t.MediaConnection, stream: t.PeerMediaStreams) {
      const existing = api.connections.media.find((item) => item.id === conn.connectionId);
      if (existing) return existing;

      const subject = PeerMediaConnection(conn, stream);
      memory.connections.push(subject);
      api.handleDispose(subject);
      api.fireChanged('added', subject);
      return subject;
    },
  };

  return api;
}
