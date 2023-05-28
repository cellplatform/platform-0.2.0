import type { t } from '../../../common.t';

export type TestRunnerField = 'Module' | 'Module.Version' | 'Tests.Run' | 'Tests.Selector';

/**
 * Data model for the <TestRunner.PropList> component.
 */
export type TestRunnerPropListData = {
  pkg?: t.ModuleDef;
  specs?: t.SpecImport[];
  run?: {
    infoUrl?: string;
    label?: string;
    get?: t.GetTestSuite;
  };
};
