import type { t } from '../../common.t';

type Milliseconds = number;
type Ctx = Record<string, unknown>;

export * from './Runner.PropList/types.mjs';

/**
 * Retrieve a test model (suite | "describe").
 */
export type GetTestBundle = () => Promise<GetTestBundleResponse>;
export type GetTestBundleResponse = {
  specs: t.TestSuiteModel[];
  ctx?: Ctx;
  timeout?: Milliseconds;
};
