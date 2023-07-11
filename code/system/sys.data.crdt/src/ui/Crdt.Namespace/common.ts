import { type t } from '../common';

export * from '../common';
export { CrdtLens } from '../../crdt.Lens';

const data: t.CrdtNsInfoData = {
  maxLength: 120,
};

export const DEFAULTS = {
  enabled: true,
  selected: false,
  data,
} as const;
