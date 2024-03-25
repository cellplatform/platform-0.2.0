import { DEFAULTS, Pkg } from './common';
import { TestRunner } from '../../ui.dev';
import type * as t from './-SPEC.t';

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

/**
 * Component display
 */
export function component(data: t.InfoData['component'], theme?: t.CommonTheme): t.PropListItem {
  return {
    label: data?.label || 'Component',
    value: data?.name || '(Unnamed)',
  };
}
