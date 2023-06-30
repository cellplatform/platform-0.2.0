import { init } from './Func.impl.mjs';
import { Util } from './util.mjs';

/**
 * Adapter for running an RPC style function
 * based on an observable CRDT.
 */
export const CrdtFunc = {
  init,
  data: Util.data,
} as const;
