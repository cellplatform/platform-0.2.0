import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { BehaviorSelector } from './ui.BehaviorSelector';
import {
  useItemController,
  useItemEditController,
  useItemSelectionController,
  useListController,
  useListSelectionController,
} from './use.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  BehaviorSelector: typeof BehaviorSelector;

  useItemController: typeof useItemController;
  useItemEditController: typeof useItemEditController;
  useItemSelectionController: typeof useItemSelectionController;

  useListController: typeof useListController;
  useListSelectionController: typeof useListSelectionController;
};

export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    BehaviorSelector,

    useItemController,
    useItemEditController,
    useItemSelectionController,

    useListController,
    useListSelectionController,
  },
  { displayName: 'LabelItem.Stateful' },
);
