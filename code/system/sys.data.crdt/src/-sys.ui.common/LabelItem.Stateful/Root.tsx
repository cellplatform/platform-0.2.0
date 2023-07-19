import { DEFAULTS, FC, type t } from './common';

import { View } from './ui';
import { BehaviorSelector } from './ui.BehaviorSelector';
import { useController } from './useController.mjs';
import { useItemEditController } from './useItem.EditController.mjs';
import { useItemSelectionController } from './useItem.SelectionController.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  BehaviorSelector: typeof BehaviorSelector;
  useController: typeof useController;
  useItemEditController: typeof useItemEditController;
  useItemSelectionController: typeof useItemSelectionController;
};
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    BehaviorSelector,
    useController,
    useItemEditController,
    useItemSelectionController,
  },
  { displayName: 'LabelItem.Stateful' },
);
