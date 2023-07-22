import { type t } from '../common';

export { Keyboard } from '../Text.Keyboard';
export { FieldSelector } from '../PropList.FieldSelector';
export * from '../common';

/**
 * Constants
 */

import { DEFAULTS as item } from '../Item.LabelItem/common';

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
  item,
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
