import { LabelItem, type t } from '../common';

export { CrdtLens } from '../../crdt/crdt.Lens';
export * from '../common';

/**
 * @system → (sys.ui.common)
 */

/**
 * Constants.
 */
const data: t.CrdtNsInfoData = { maxLength: LabelItem.DEFAULTS.maxLength };

export const DEFAULTS = {
  data,
  // item,
  indent: 0,
  useBehaviors: LabelItem.Stateful.DEFAULTS.useBehaviors.defaults,
  placeholder: {
    default: 'namespace',
    empty: 'add namespace',
  },
} as const;
