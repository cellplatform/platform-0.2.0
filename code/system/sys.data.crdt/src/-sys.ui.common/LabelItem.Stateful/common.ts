import { type t } from '../common';
export * from '../common';

type K = t.LabelItemBehaviorKind;
const useBehaviorAll: K[] = [
  //
  'Item',
  'Item.Edit',
  'Item.Selection',
  'List',
  'List.Selection',
];
const useBehaviorDefaults: K[] = ['Item', 'List'];

export const DEFAULTS = {
  enabled: true,
  editing: false,
  useBehaviors: {
    all: useBehaviorAll,
    defaults: useBehaviorDefaults,
  },
  get data(): t.LabelItem {
    return {};
  },
} as const;
