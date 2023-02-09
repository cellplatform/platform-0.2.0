import { t, cuid } from './common';

export const Util = {
  randomPeerId() {
    return `p${cuid()}`;
  },

  asId(input: string) {
    input = (input || '').trim();
    input = input.replace(/^peer\:/, '');
    return input.trim();
  },

  asUri(id: string) {
    return `peer:${Util.asId(id)}`;
  },

  isType: {
    PeerDataPayload(input: any) {
      if (typeof input !== 'object') return false;

      const data = input as t.PeerDataPayload;
      if (typeof data.source !== 'object') return false;
      if (typeof data.source.peer !== 'string') return false;
      if (typeof data.source.connection !== 'string') return false;
      if (typeof data.event !== 'object') return false;
      if (typeof data.event.type !== 'string') return false;
      if (typeof data.event.payload !== 'object') return false;

      return true;
    },
  },

  filter: {
    onConnection<C extends t.PeerConnection>(
      kind: C['kind'] | C['kind'][],
      source: t.PeerConnection[],
    ) {
      const match = Array.isArray(kind) ? kind : [kind];
      return source.filter(({ kind }) => match.includes(kind)) as C[];
    },

    onDataConnection(source: t.PeerConnection[]) {
      return Util.filter.onConnection<t.PeerDataConnection>('data', source);
    },

    onMediaConnection(source: t.PeerConnection[]) {
      return Util.filter.onConnection<t.PeerMediaConnection>(['media'], source);
    },
  },
};
