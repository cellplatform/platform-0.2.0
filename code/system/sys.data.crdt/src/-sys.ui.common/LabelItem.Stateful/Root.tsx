import { DEFAULTS, FC, type t } from './common';

import { View } from './ui';
import { BehaviorSelector } from './ui.BehaviorSelector';
import { useController } from './useController.mjs';
import { useEditController } from './useEditController.mjs';
import { useSelectionController } from './useSelectionController.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  BehaviorSelector: typeof BehaviorSelector;
  useController: typeof useController;
  useEditController: typeof useEditController;
  useSelectionController: typeof useSelectionController;
};
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    BehaviorSelector,
    useController,
    useEditController,
    useSelectionController,
  },
  { displayName: 'LabelItem.Stateful' },
);
