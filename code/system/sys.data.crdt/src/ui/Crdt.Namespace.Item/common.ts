import { type t } from '../common';

export * from '../common';
export { CrdtLens } from '../../crdt.Lens';

export const DEFAULTS = {
  enabled: true,
  selected: false,
  indent: 0,
  padding: 3,
  maxLength: 120,
} as const;
