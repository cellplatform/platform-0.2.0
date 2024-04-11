import type { t } from '../common';

export type HarnessProps = {
  instance?: t.DevInstance;
  spec?: t.SpecImport | t.SpecImporter | t.TestSuiteModel;
  env?: t.DevEnvVars;
  allowRubberband?: boolean;
  style?: t.CssValue;
  background?: string | number;
};
