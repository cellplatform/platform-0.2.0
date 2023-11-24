/**
 * @external
 */
export type { next as A } from '@automerge/automerge';
export type { NetworkAdapter } from '@automerge/automerge-repo';
export type { DataConnection } from 'peerjs';
export type { Observable } from 'rxjs';

export type {
  DocRefHandle,
  DocUri,
  Store,
  StoreNetworkKind,
  WebStore,
} from 'ext.lib.automerge/src/types';
export type { PeerModel } from 'ext.lib.peerjs/src/types';

/**
 * @system
 */
export type {
  Disposable,
  EventBus,
  Lifecycle,
  Msecs,
  Percent,
  UntilObservable,
} from 'sys.types/src/types';

export type { SpecImport, TestSuiteRunResponse } from 'sys.test.spec/src/types.mjs';

/**
 * @local
 */
export type * from '../types';
