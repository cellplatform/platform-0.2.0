import { Item } from './Item';
import { Stateful } from './Root.Stateful';
import { controller } from './Root.controller.mjs';
import { DEFAULTS, FC, FIELDS } from './common';
import { useController } from './hooks/useController.mjs';
import { PropList as View, type TestRunnerPropListProps } from './ui/PropList';
import { PropListFieldSelector as FieldSelector } from './ui/PropList.FieldSelector';

export type { TestRunnerPropListProps };

const runner = Item.runner;

/**
 * Export
 */
type Fields = {
  FIELDS: typeof FIELDS;
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  FieldSelector: typeof FieldSelector;
  Item: typeof Item;
  controller: typeof controller;
  runner: typeof runner;
  useController: typeof useController;
};

export const TestRunnerPropList = FC.decorate<TestRunnerPropListProps, Fields>(
  View,
  {
    FIELDS,
    DEFAULTS,
    FieldSelector,
    Stateful,
    Item,
    controller,
    runner,
    useController,
  },
  { displayName: 'TestRunnerPropList' },
);
