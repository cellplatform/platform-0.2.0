import type { t } from '../common.t';

type Id = string;
type Hostname = string;

/**
 * The local peer.
 */
export type Peer = t.Disposable & {
  readonly kind: 'local:peer';
  readonly id: Id;
  readonly signal: Hostname;
  readonly connections$: t.Observable<PeerConnectionChange>;
  readonly connections: PeerConnection[];
  readonly dataConnections: PeerDataConnection[];
  readonly mediaConnections: PeerMediaConnection[];
  data(connectTo: Id): Promise<PeerDataConnection>;
};

export type PeerConnection = PeerDataConnection | PeerMediaConnection;

/**
 * A [Data] connection with a remote peer.
 */
export type PeerDataConnection = t.Disposable & {
  readonly kind: 'data';
  readonly id: Id;
  readonly peer: { local: Id; remote: Id };
  readonly open: boolean;
  readonly in$: t.Observable<t.PeerDataPayload>;
  readonly disposed: boolean;
  send<E extends t.Event>(event: E): PeerDataPayload;
};

export type PeerDataPayload = {
  source: { peer: Id; connection: Id };
  event: t.Event<any>;
};

/**
 * A [Media] connection with a remote peer.
 */
export type PeerMediaConnection = t.Disposable & {
  readonly kind: 'media';
  readonly id: Id;
  readonly peer: { local: Id; remote: Id };
};

/**
 * Peer connection change
 */
export type PeerConnectionChange = PeerDataConnectionChange | PeerMediaConnectionChange;

type ConnectionChange = {
  action: 'added' | 'removed';
  connections: PeerConnection[];
};

export type PeerDataConnectionChange = ConnectionChange & {
  kind: 'data';
  subject: PeerDataConnection;
};

export type PeerMediaConnectionChange = ConnectionChange & {
  kind: 'media';
  subject: PeerMediaConnection;
};
