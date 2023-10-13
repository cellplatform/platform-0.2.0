import { type t } from '../common';
export * from '../common';

import { DEFAULTS as MODEL_DEFAULTS } from '../LabelItem.Model';

export { ActiveElement, Focus } from '../Focus';
export { Model } from '../LabelItem.Model';
export { ListContext } from '../LabelItem/Context.List';
export { FieldSelector } from '../PropList.FieldSelector';
export { Keyboard } from '../Text.Keyboard';

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
  data: MODEL_DEFAULTS.data,
} as const;
