import { DEFAULTS, FC, type t } from './common';

import { View } from './ui';
import { BehaviorSelector } from './ui.BehaviorSelector';
import {
  useController,
  useItemEditController,
  useItemSelectionController,
  useListSelectionController,
  useItemController,
} from './use.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  BehaviorSelector: typeof BehaviorSelector;
  useController: typeof useController;
  useItemController: typeof useItemController;
  useItemEditController: typeof useItemEditController;
  useItemSelectionController: typeof useItemSelectionController;
  useListSelectionController: typeof useListSelectionController;
};

export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    BehaviorSelector,
    useController,
    useItemController,
    useItemEditController,
    useItemSelectionController,
    useListSelectionController,
  },
  { displayName: 'LabelItem.Stateful' },
);
