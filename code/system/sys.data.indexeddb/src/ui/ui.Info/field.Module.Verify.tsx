import { DEFAULTS, TestRunner, type t } from './common';

export function fieldModuleVerify(data: t.InfoData, info?: {}) {
  const ctx = {};
  return TestRunner.PropList.runner({
    ctx,

    infoUrl() {
      const url = new URL(location.origin);
      url.searchParams.set(DEFAULTS.query.dev, 'sys.data.indexeddb.tests');
      return url.href;
    },

    async modules() {
      const { TESTS } = await import('../../test.ui/-TestRunner.TESTS');
      return TESTS.all;
    },
  });
}
