import type { t } from './common';

export type PeerState = {
  open: boolean;
  connections: t.PeerStateConnection[];
};

export type PeerStateConnection = {
  kind: 'data' | 'media';
  id: string;
  peer: { local: string; remote: string };
  open: boolean;
};

/**
 * Logical API over the peer state.
 */
export type PeerModel = {
  id: string;
  current: t.PeerState;
  connect: { data(remotePeer: string): void };
  disconnect(id: string): void;
  events(dispose$?: t.UntilObservable): t.PatchStateEvents<t.PeerState>;
  purge(): void;
};
