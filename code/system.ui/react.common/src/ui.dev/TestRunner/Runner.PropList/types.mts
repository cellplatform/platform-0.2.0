import type { t } from '../../../common.t';

export type TestRunnerField = 'Module' | 'Module.Version' | 'Tests.Run';

/**
 * Data model for the <TestRunner.PropList> component.
 */
export type TestRunnerPropListData = {
  pkg?: t.ModuleDef;
  run?: {
    infoUrl?: string;
  };
};
