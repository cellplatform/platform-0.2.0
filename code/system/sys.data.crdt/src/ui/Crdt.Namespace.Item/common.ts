import { type t } from '../common';

export * from '../common';
export { CrdtLens } from '../../crdt.Lens';

export const DEFAULTS = {
  enabled: true,
  selected: false,
  editing: false,
  indent: 0,
  padding: 5,
  maxLength: 120,
} as const;
