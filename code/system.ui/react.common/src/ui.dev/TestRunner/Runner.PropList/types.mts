import type { t } from '../../../common.t';

type HashString = string;

export type TestRunnerField =
  | 'Module'
  | 'Module.Version'
  | 'Tests.Run'
  | 'Tests.Selector'
  | 'Tests.Selector.Reset';

/**
 * Data model for the <TestRunner.PropList> component.
 */
export type TestRunnerPropListData = {
  pkg?: t.ModuleDef;
  specs?: TestRunnerPropListSpecsData;
  run?: TestRunnerPropListRunData;
};

export type TestRunnerPropListRunData = {
  infoUrl?: string | (() => string | undefined);
  label?: string | (() => string | undefined);
  get?: t.GetTestSuite;
};

export type TestRunnerPropListSpecsData = {
  all?: t.SpecImport[];
  selected?: HashString[];
  ellipsis?: boolean | (() => boolean | undefined);
  onChange?: SpecSelectionHandler;
};

/**
 * Event handlers.
 */
export type SpecSelectionHandler = (e: SpecSelectionHandlerArgs) => void;
export type SpecSelectionHandlerArgs = {
  import: t.SpecImport;
  spec: t.TestSuiteModel;
  from: boolean;
  to: boolean;
};

export type TestRunnerPropListChange = {
  action: 'Specs:Selection';
  data: TestRunnerPropListData;
};
