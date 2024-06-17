import type { t } from './common';

/**
 * Events API
 */
export type CrdtSharedEvents = t.Lifecycle & {
  readonly $: t.Observable<t.CrdtSharedEvent>;
  readonly changed$: t.Observable<t.CrdtSharedChanged>;
  readonly remoteConnected$: t.Observable<t.CrdtSharedRemoteConnected>;
};

/**
 * Events
 */
export type CrdtSharedEvent = CrdtSharedChangedEvent | CrdtSharedRemoteConnectedEvent;

/**
 * Fired when the shared doc changes.
 */
export type CrdtSharedChangedEvent = {
  type: 'crdt:net:shared/Changed';
  payload: t.CrdtSharedChanged;
};
export type CrdtSharedChanged = {
  uri: t.UriString;
  before: t.CrdtShared;
  after: t.CrdtShared;
};

/**
 * Ephemeral messages.
 */
export type CrdtSharedRemoteConnectedEvent = {
  type: 'crdt:net:shared/RemoteConnected';
  payload: CrdtSharedRemoteConnected;
};
export type CrdtSharedRemoteConnected = {
  shared: { uri: t.UriString };
};
