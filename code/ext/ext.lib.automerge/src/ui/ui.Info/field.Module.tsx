import { DEFAULTS, Pkg, TestRunner, type t } from './common';

/**
 * Module package.
 */
export function module(ctx: t.InfoFieldCtx): t.PropListItem {
  return { label: 'Module', value: `${Pkg.name}@${Pkg.version}` };
}

/**
 * Test runner.
 */
export function moduleVerify(ctx: t.InfoFieldCtx) {
  return TestRunner.PropList.runner({
    ctx: {},
    theme: ctx.theme,

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

/**
 * Component display
 */
export function component(data: t.InfoData['component'], ctx: t.InfoFieldCtx): t.PropListItem {
  return {
    label: data?.label || 'Component',
    value: data?.name || '(Unnamed)',
  };
}
