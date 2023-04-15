import type { t } from '../../common.t';

type Milliseconds = number;
type Ctx = Record<string, unknown>;

export type GetTestPayload = () => Promise<TestPayload>;
export type TestPayload = {
  root: t.TestSuiteModel;
  ctx?: Ctx;
  timeout?: Milliseconds;
};
