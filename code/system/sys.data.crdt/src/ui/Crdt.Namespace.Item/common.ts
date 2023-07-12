import { type t } from '../common';

export * from '../common';
export { CrdtLens } from '../../crdt.Lens';

export const DEFAULTS = {
  enabled: true,
  selected: false,
  editing: false,
  focusOnReady: false,
  maxLength: 120,
  indent: 0,
  padding: 5,
} as const;
