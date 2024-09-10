import type { t } from '../common';

/**
 * Component
 */
export type HarnessProps = {
  instance?: t.DevInstance;
  spec?: t.SpecImport | t.SpecImporter | t.TestSuiteModel;
  env?: t.DevEnvVars;
  allowRubberband?: boolean;
  background?: string | number;
  style?: t.CssValue;
};
