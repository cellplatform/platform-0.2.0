/**
 * @external
 */
export type { next as A } from '@automerge/automerge';
export type { NetworkAdapter } from '@automerge/automerge-repo';
export type { Observable } from 'rxjs';

export type {
  DocChanged,
  DocMeta,
  DocRefHandle,
  DocUri,
  DocWithMeta,
  RepoIndexDoc,
  Store,
  StoreIndex,
  StoreNetworkKind,
  WebStore,
} from 'ext.lib.automerge/src/types';
export type {
  PeerConnectDirection,
  PeerConnectMetadata,
  PeerJsConnData,
  PeerModel,
} from 'ext.lib.peerjs/src/types';

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
export type { UserAgent } from 'sys.ui.dom/src/types';

/**
 * @local
 */
export type * from '../types';
