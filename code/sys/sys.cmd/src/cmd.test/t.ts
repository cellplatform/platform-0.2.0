import type { t } from './common';
export * from '../common/t';

export type TestArgs = {
  expect: t.Expect;
  describe: t.Describe;
  it: t.It;
};
