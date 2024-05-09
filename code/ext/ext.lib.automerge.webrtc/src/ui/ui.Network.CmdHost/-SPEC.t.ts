import type { t } from './common';

export type TEnv = { Specs?: t.SpecImports };

export type THarness = {
  theme?: t.CommonTheme;
  debugWidth: number;
  debugShowJson?: boolean;
};
