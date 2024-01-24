import { type t } from '../../common';
export type * from './Test.PropList/types.mjs';

type Milliseconds = number;
type Ctx = Record<string, unknown>;

/**
 * Retrieve a test model (suite | "describe").
 */
export type GetTestBundle = () => Promise<GetTestBundleResponse>;
export type GetTestBundleResponse = {
  specs: t.TestSuiteModel[];
  ctx?: Ctx;
  timeout?: Milliseconds;
};
