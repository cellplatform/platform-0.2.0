import { DEFAULTS, TestRunner, t } from '../common';

export function FieldModuleVerify(data: t.CrdtInfoData, info?: {}) {
  const ctx = {};
  return TestRunner.PropList.runner({
    ctx,
    infoUrl: () => Wrangle.infoUrl(),
    async all() {
      const { TESTS } = await import('../../../test/-TESTS.mjs');
      return TESTS.all;
    },
  });
}

const Wrangle = {
  infoUrl() {
    const url = new URL(location.origin);
    url.searchParams.set(DEFAULTS.query.dev, 'sys.crdt.tests');
    return url.href;
  },
};
