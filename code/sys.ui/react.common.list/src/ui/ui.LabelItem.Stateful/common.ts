import { Pkg, type t } from '../common';
export * from '../common';

import { DEFAULTS as MODEL_DEFAULTS } from '../ui.LabelItem.Model';

export { Model } from '../ui.LabelItem.Model';
export { ListContext } from '../ui.LabelItem/Context.List';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:LabelItem.Stateful`,
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
