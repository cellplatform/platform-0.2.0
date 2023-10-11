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
  index: -1,
  total: -1,
  enabled: true,
  editing: false,
  editable: true,
  useBehaviors: {
    all: useBehaviorAll,
    defaults: useBehaviorDefaults,
  },
  data: {
    get item(): t.LabelItem {
      return {};
    },
    get list(): t.LabeList {
      return {};
    },
  },
} as const;
