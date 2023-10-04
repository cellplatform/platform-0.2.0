import { LabelItemStateful, type t } from '../common';

export { CrdtLens } from '../../crdt/crdt.Lens';
export * from '../common';

/**
 * @system → (sys.ui.common)
 */

/**
 * Constants.
 */
const item = LabelItemStateful.DEFAULTS.item;
const data: t.CrdtNsInfoData = { maxLength: item.maxLength };

export const DEFAULTS = {
  data,
  // item,
  indent: 0,
  useBehaviors: LabelItemStateful.DEFAULTS.useBehaviors.defaults,
  placeholder: {
    default: 'namespace',
    empty: 'add namespace',
  },
} as const;
