import { type t } from '../common';

export * from '../common';
export { CrdtLens } from '../../crdt.Lens';

const data: t.CrdtNsInfoData = {
  maxLength: 120,
};

export const DEFAULTS = {
  data,
  enabled: true,
  item: {
    selected: false,
    indent: 0,
    padding: 3,
  },
} as const;
