import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { BehaviorSelector } from './ui.BehaviorSelector';
import {
  useItemController,
  useItemEditController,
  useItemSelectionController,
  useListController,
  useListNavigationController,
} from './use.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  BehaviorSelector: typeof BehaviorSelector;

  useController: typeof useItemController;
  useItemEditController: typeof useItemEditController;
  useItemSelectionController: typeof useItemSelectionController;

  useListController: typeof useListController;
  useListNavigationController: typeof useListNavigationController;
};

export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    BehaviorSelector,

    useController: useItemController,

    useItemEditController,
    useItemSelectionController,

    useListController,
    useListNavigationController,
  },
  { displayName: 'LabelItem.Stateful' },
);
