import type { t } from '../../common.t';

type Milliseconds = number;
type Ctx = Record<string, unknown>;

export * from './Runner.PropList/types.mjs';

/**
 * Retrieve a test model (suite | "describe").
 */
export type GetTestSuite = () => Promise<GetTestSuitePayload>;
export type GetTestSuitePayload = {
  root: t.TestSuiteModel;
  ctx?: Ctx;
  timeout?: Milliseconds;
};
