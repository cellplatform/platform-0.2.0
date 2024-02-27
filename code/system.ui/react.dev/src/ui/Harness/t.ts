import { type t } from '../common';

export type HarnessProps = {
  instance?: t.DevInstance;
  spec?: t.SpecImport | t.TestSuiteModel;
  allowRubberband?: boolean;
  style?: t.CssValue;
  background?: string | number;
};
