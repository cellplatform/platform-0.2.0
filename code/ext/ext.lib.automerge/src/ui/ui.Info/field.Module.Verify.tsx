import { DEFAULTS, TestRunner } from './common';

export function fieldModuleVerify() {
  const ctx = {};
  return TestRunner.PropList.runner({
    ctx,

    infoUrl() {
      const url = new URL(location.origin);
      url.searchParams.set(DEFAULTS.query.dev, 'ext.lib.automerge.tests');
      return url.href;
    },

    async modules() {
      const { TESTS } = await import('../../test.ui/-TestRunner.TESTS');
      return TESTS.all;
    },
  });
}
