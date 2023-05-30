import type { t } from '../../../common.t';

type HashString = string;
type Ctx = Record<string, unknown>;

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
  ctx?: Ctx | (() => Ctx);
  all?: t.SpecImport[];
  selected?: HashString[];
  ellipsis?: boolean | (() => boolean | undefined);
  onSelect?: SpecsSelectionHandler;
  onRunSingle?: SpecRunClickHandler;
  onReset?: SpecsSelectionResetHandler;
};

/**
 * Event handlers.
 */
export type SpecsSelectionHandler = (e: SpecsSelectionHandlerArgs) => void;
export type SpecsSelectionHandlerArgs = {
  import: t.SpecImport;
  spec: t.TestSuiteModel;
  from: boolean;
  to: boolean;
  modifiers: t.KeyboardModifierFlags;
};

export type SpecsSelectionResetHandler = (e: SpecsSelectionResetHandlerArgs) => void;
export type SpecsSelectionResetHandlerArgs = {
  modifiers: t.KeyboardModifierFlags;
};

export type SpecRunClickHandler = (e: SpecRunClickHandlerArgs) => void;
export type SpecRunClickHandlerArgs = {
  spec: t.TestSuiteModel;
  modifiers: t.KeyboardModifierFlags;
};

/**
 * Observable.
 */
export type TestRunnerPropListChange = {
  op: 'selection' | 'reset' | 'run:single';
  data: TestRunnerPropListData;
  selected: HashString[];
};
