import { type t } from '../common';

export * from '../common';
export { CrdtLens } from '../../crdt.Lens';

const data: t.CrdtHistoryInfoData = {};

export const DEFAULTS = {
  enabled: true,
  data,
} as const;
