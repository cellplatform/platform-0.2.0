/**
 * @external
 */
export type { Observable } from 'rxjs';
export type { next as A } from '@automerge/automerge';
export type { NetworkAdapter } from '@automerge/automerge-repo';

/**
 * @system
 */
import type * as p from 'ext.lib.peerjs/src/types';
export type { p };

export type { DocUri, DocRefHandle } from 'ext.lib.automerge/src/types';

export type { SpecImport, TestSuiteRunResponse } from 'sys.test.spec/src/types.mjs';
export type { Disposable, EventBus, Lifecycle } from 'sys.types/src/types';

/**
 * @local
 */
export type * from '../types';
