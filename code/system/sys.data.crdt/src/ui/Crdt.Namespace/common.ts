import { Item, type t } from '../common';

export { CrdtLens } from '../../crdt/crdt.Lens';
export * from '../common';

/**
 * @system → (sys.ui.common)
 */
export const LabelItem = Item.Label;

/**
 * Constants.
 */
const item = LabelItem.State.DEFAULTS.item;
const data: t.CrdtNsInfoData = { maxLength: item.maxLength };

export const DEFAULTS = {
  data,
  // item,
  indent: 0,
  useBehaviors: Item.Label.State.DEFAULTS.useBehaviors.defaults,
  placeholder: {
    default: 'namespace',
    empty: 'add namespace',
  },
} as const;
