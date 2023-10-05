import { type t } from '../common';
export * from '../common';

export { FieldSelector } from '../PropList.FieldSelector';
export { Keyboard } from '../Text.Keyboard';
export { ActiveElement, Focus } from '../Focus';

/**
 * Constants
 */
type B = t.LabelItemBehaviorKind;
const useBehaviorAll: B[] = [
  //
  'Item',
  'Item.Selection',
  'Item.Edit',
  'List',
  'List.Navigation',
];
const useBehaviorDefaults: B[] = ['Item', 'List'];

export const DEFAULTS = {
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
