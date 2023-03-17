import { t } from './common';

export const filter = {
  onConnectionKind<C extends t.PeerConnection>(kind: C['kind'], source: t.PeerConnection[]) {
    return source.filter((conn) => conn.kind === kind) as C[];
  },

  onDataConnection(source: t.PeerConnection[]) {
    return filter.onConnectionKind<t.PeerDataConnection>('data', source);
  },

  onMediaConnection(source: t.PeerConnection[]) {
    return filter.onConnectionKind<t.PeerMediaConnection>('media', source);
  },
};
