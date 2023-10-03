import { type t } from '../common';

export { FieldSelector } from '../PropList.FieldSelector';
export { Keyboard } from '../Text.Keyboard';
export * from '../common';

/**
 * Constants
 */
import { DEFAULTS as item } from '../Item.LabelItem/common';

type K = t.LabelItemBehaviorKind;
const useBehaviorAll: K[] = [
  //
  'Item',
  'Item.Selection',
  'Item.Edit',
  'List',
  'List.Navigation',
];
const useBehaviorDefaults: K[] = ['Item', 'Item.Selection'];

export const DEFAULTS = {
  item,
  enabled: true,
  editing: false,
  useBehaviors: {
    all: useBehaviorAll,
    defaults: useBehaviorDefaults,
  },
  data: {
    get item(): t.LabelItem {
      return {};
    },
    get list(): t.LabelItemList {
      return {};
    },
  },
} as const;
