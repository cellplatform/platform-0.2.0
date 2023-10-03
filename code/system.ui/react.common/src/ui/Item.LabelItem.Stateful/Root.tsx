import { DEFAULTS, FC, type t } from './common';
import { BehaviorSelector } from './ui.BehaviorSelector';
import { Item } from './ui.Item';
import { List } from './ui.List';
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
  List: typeof List;
  BehaviorSelector: typeof BehaviorSelector;

  useItemController: typeof useItemController;
  useItemEditController: typeof useItemEditController;
  useItemSelectionController: typeof useItemSelectionController;

  useListController: typeof useListController;
  useListSelectionController: typeof useListSelectionController;
};

export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  Item,
  {
    DEFAULTS,
    BehaviorSelector,
    List,

    useItemController,
    useItemEditController,
    useItemSelectionController,

    useListController,
    useListSelectionController,
  },
  { displayName: 'LabelItem.Stateful' },
);
