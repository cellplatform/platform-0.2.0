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
  all?: t.BundleImport[] | (() => t.BundleImport[] | Promise<t.BundleImport[]>);
  ctx?: Ctx | (() => Ctx);
  infoUrl?: string | (() => string | undefined);
  label?: string | (() => string | undefined);
  bundle?: t.GetTestBundle;
  onRunSingle?: SpecRunClickHandler;
  onRunAll?: SpecRunAllClickHandler;
};

export type TestRunnerPropListSpecsData = {
  selected?: HashString[];
  ellipsis?: boolean | (() => boolean | undefined);
  results?: { [key: HashString]: true | t.TestSuiteRunResponse };
  onSelect?: SpecsSelectionHandler;
  onReset?: SpecsSelectionResetHandler;
};

/**
 * Event handlers.
 */
export type SpecsSelectionHandler = (e: SpecsSelectionHandlerArgs) => void;
export type SpecsSelectionHandlerArgs = {
  spec: t.TestSuiteModel;
  from: boolean;
  to: boolean;
  modifiers: t.KeyboardModifierFlags;
};

export type SpecsSelectionResetHandler = (e: SpecsSelectionResetHandlerArgs) => void;
export type SpecsSelectionResetHandlerArgs = {
  modifiers: t.KeyboardModifierFlags;
  select?: 'all' | 'none';
};

export type SpecRunClickHandler = (e: SpecRunClickHandlerArgs) => void | Promise<void>;
export type SpecRunClickHandlerArgs = {
  spec: t.TestSuiteModel;
  modifiers: t.KeyboardModifierFlags;
};

export type SpecRunAllClickHandler = (e: SpecRunAllClickHandlerArgs) => void | Promise<void>;
export type SpecRunAllClickHandlerArgs = {
  modifiers: t.KeyboardModifierFlags;
};

/**
 * Observable.
 */
export type TestRunnerPropListChange = {
  op:
    | 'selection'
    | 'reset'
    | 'run:all:start'
    | 'run:single:start'
    | 'run:single:complete'
    | 'run:all:complete';
  data: TestRunnerPropListData;
  selected: HashString[];
  results: t.TestSuiteRunResponse[];
};
