import type { t } from '../common';

type O = Record<string, unknown>;

export type HarnessProps = {
  instance?: t.DevInstance;
  spec?: t.SpecImport | t.TestSuiteModel;
  env?: O;
  allowRubberband?: boolean;
  style?: t.CssValue;
  background?: string | number;
};
