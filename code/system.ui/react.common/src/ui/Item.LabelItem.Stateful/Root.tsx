import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { BehaviorSelector } from './ui.BehaviorSelector';
import {
  useItemController,
  useItemEditController,
  useItemSelectionController,
  useListController,
  useListNavigationController,
} from './use';
import { State } from './Root.State';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  State: typeof State;
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
    State,
    BehaviorSelector,

    useController: useItemController,

    useItemEditController,
    useItemSelectionController,

    useListController,
    useListNavigationController,
  },
  { displayName: 'LabelItem.Stateful' },
);
