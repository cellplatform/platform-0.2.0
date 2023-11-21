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
export const DEFAULTS = {
  index: -1,
  total: -1,
  enabled: true,
  editing: false,
  editable: true,
  data: MODEL_DEFAULTS.data,
  behaviors: {
    get all(): t.LabelItemBehaviorKind[] {
      return [
        'Item',
        'Item.Selection',
        'Item.Edit',
        'List',
        'List.Navigation',
        'Focus.OnLoad',
        'Focus.OnArrowKey',
      ];
    },
    get defaults(): t.LabelItemBehaviorKind[] {
      return ['Item', 'List'];
    },
  },
} as const;
