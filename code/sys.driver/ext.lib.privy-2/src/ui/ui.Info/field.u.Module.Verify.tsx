import { DEFAULTS, TestRunner, type t } from './common';

type Args = t.InfoFieldArgs;

export function moduleVerify(args: Args) {
  const ctx = {};
  return TestRunner.PropList.runner({
    ctx,
    theme: args.theme,

    infoUrl() {
      const url = new URL(location.origin);
      url.searchParams.set(DEFAULTS.query.dev, 'ext.lib.privy.tests');
      return url.href;
    },

    async modules() {
      const { TESTS } = await import('../../test.ui/-TestRunner.TESTS');
      return TESTS.all;
    },
  });
}
