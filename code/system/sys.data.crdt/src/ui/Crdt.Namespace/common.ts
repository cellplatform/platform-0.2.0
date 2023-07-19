import { DEFAULTS as item } from '../../-sys.ui.common/LabelItem/common';
import { type t } from '../common';

export { CrdtLens } from '../../crdt/crdt.Lens';
export * from '../common';

/**
 * @system → (sys.ui.common)
 */
import { Item } from '../../-sys.ui.common';
export { Item };

/**
 * Constants.
 */
const data: t.CrdtNsInfoData = { maxLength: item.maxLength };

export const DEFAULTS = {
  data,
  item,
  indent: 0,
  useBehaviors: Item.State.DEFAULTS.useBehaviors.defaults,
  placeholder: {
    default: 'namespace',
    empty: 'add namespace',
  },
} as const;
