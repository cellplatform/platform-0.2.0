import { type t } from '../common';

export { CrdtLens } from '../../crdt/crdt.Lens';
export * from '../common';

/**
 * Constants
 */
const data: t.CrdtHistoryInfoData = {};

export const DEFAULTS = {
  enabled: true,
  data,
} as const;
