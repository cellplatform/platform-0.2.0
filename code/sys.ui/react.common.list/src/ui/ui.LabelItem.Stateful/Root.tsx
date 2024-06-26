import { DEFAULTS, FC, Model, type t } from './common';
import { View } from './ui';
import { BehaviorSelector } from './ui.Config.BehaviorSelector';
import { useItemController, useListController } from './use';
import { Wrangle } from './Wrangle';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Model: typeof Model;
  BehaviorSelector: typeof BehaviorSelector;
  useItemController: typeof useItemController;
  useListController: typeof useListController;
  dataid: typeof Wrangle.dataid;
};

/**
 * A stateful version of the <LabelItem> component.
 */
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    Model,
    BehaviorSelector,
    useItemController,
    useListController,
    dataid: Wrangle.dataid,
  },
  { displayName: DEFAULTS.displayName },
);
