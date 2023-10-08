/**
 * @external
 */
export type { Observable } from 'rxjs';
export type { next as A } from '@automerge/automerge';
export type { NetworkAdapter } from '@automerge/automerge-repo';

export type { DocUri, DocRefHandle } from 'ext.lib.automerge/src/types';

/**
 * @system
 */
export type { SpecImport, TestSuiteRunResponse } from 'sys.test.spec/src/types.mjs';
export type { Disposable, EventBus, Lifecycle } from 'sys.types/src/types';

/**
 * @local
 */
export type * from '../types';
