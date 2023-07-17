import { DEFAULTS, FC, type t } from './common';

import { View } from './ui';
import { BehaviorSelector } from './ui.BehaviorSelector';
import { useEditController } from './useEditController.mjs';
import { useSelectionController } from './useSelectionController.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  useEditController: typeof useEditController;
  useSelectionController: typeof useSelectionController;
  BehaviorSelector: typeof BehaviorSelector;
};
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    useEditController,
    useSelectionController,
    BehaviorSelector,
  },
  { displayName: 'LabelItem.Stateful' },
);
