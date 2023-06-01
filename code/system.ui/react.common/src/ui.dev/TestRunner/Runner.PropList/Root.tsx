import { Stateful } from './Root.Stateful';
import { DEFAULTS, FC, FIELDS } from './common';
import { useController } from './hooks/useController.mjs';
import { PropListController as controller } from './logic/Controller.mjs';
import { PropList as View, type TestRunnerPropListProps } from './ui/PropList';
import { PropListFieldSelector as FieldSelector } from './ui/PropList.FieldSelector';

export type { TestRunnerPropListProps };

/**
 * Export
 */
type Fields = {
  FIELDS: typeof FIELDS;
  DEFAULTS: typeof DEFAULTS;
  Stateful: typeof Stateful;
  FieldSelector: typeof FieldSelector;
  controller: typeof controller;
  useController: typeof useController;
};

export const TestRunnerPropList = FC.decorate<TestRunnerPropListProps, Fields>(
  View,
  {
    FIELDS,
    DEFAULTS,
    FieldSelector,
    Stateful,
    controller,
    useController,
  },
  { displayName: 'TestRunnerPropList' },
);
