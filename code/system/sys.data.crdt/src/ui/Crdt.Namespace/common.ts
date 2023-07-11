import { type t } from '../common';

export * from '../common';
export { CrdtLens } from '../../crdt.Lens';
import { DEFAULTS as item } from '../Crdt.Namespace.Item/common';

/**
 * Constants.
 */
const data: t.CrdtNsInfoData = {
  maxLength: item.maxLength,
};

export const DEFAULTS = {
  enabled: true,
  data,
  item,
} as const;
