import { DEFAULTS, Pkg, TestRunner, type t } from './common';

/**
 * Module package.
 */
export function module(theme?: t.CommonTheme): t.PropListItem {
  return { label: 'Module', value: `${Pkg.name}@${Pkg.version}` };
}

/**
 * Test runner.
 */
export function moduleVerify(theme?: t.CommonTheme) {
  const ctx = {};
  return TestRunner.PropList.runner({
    ctx,
    theme,

    infoUrl() {
      const url = new URL(location.origin);
      url.searchParams.set(DEFAULTS.query.dev, `${Pkg.name}.tests`);
      return url.href;
    },

    async modules() {
      const { TESTS } = await import('../../test.ui/-TestRunner.TESTS');
      return TESTS.all;
    },
  });
}
