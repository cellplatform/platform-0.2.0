/**
 * @external
 */
export type { next as A } from '@automerge/automerge';
export type { NetworkAdapter } from '@automerge/automerge-repo';
export type { Observable } from 'rxjs';
export type { DataConnection } from 'peerjs';

/**
 * @system
 */
export type { DocRefHandle, DocUri, Store, WebStore } from 'ext.lib.automerge/src/types';
export type { PeerModel } from 'ext.lib.peerjs/src/types';
export type { SpecImport, TestSuiteRunResponse } from 'sys.test.spec/src/types.mjs';
export type { Disposable, EventBus, Lifecycle } from 'sys.types/src/types';

/**
 * @local
 */
export type * from '../types';