import { State } from './Root.State';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { BehaviorSelector } from './ui.BehaviorSelector';
import { useItemController, useListController } from './use';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  State: typeof State;
  BehaviorSelector: typeof BehaviorSelector;
  useItemController: typeof useItemController;
  useListController: typeof useListController;
};

/**
 * A stateful version of the <LabelItem> component.
 */
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    State,
    BehaviorSelector,
    useItemController,
    useListController,
  },
  { displayName: 'LabelItem.Stateful' },
);
